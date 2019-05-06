from django.contrib.auth.models import Permission
from ..models import Tercero
from dr_amor_app.utilities_tests.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class TercerosTestApi(BaseTestsApi):
    def setUp(self):
        super().setUp()
        from terceros.factories import AcompananteFactory, ColaboradorFactory
        self.url = '/api/terceros/'
        self.permiso = 'tercero'
        self.acompanante = AcompananteFactory()
        self.acompanante.usuario.set_password('contrasena')
        self.acompanante.usuario.save()
        self.colaborador = ColaboradorFactory()

    def test_cambiar_pin(self):
        from terceros.services import tercero_is_pin_correct
        self.detail_route_post(
            'cambiar_pin',
            {'password': 'contrasena', 'pin': '1234'},
            self.acompanante.id
        )
        self.assertTrue(tercero_is_pin_correct(self.acompanante.id, '1234'))

    def test_generar_qr(self):
        self.assertIsNone(self.acompanante.qr_acceso)
        self.detail_route_post(
            'generar_qr',
            None,
            self.acompanante.id
        )
        self.acompanante.refresh_from_db()
        self.assertIsNotNone(self.acompanante.qr_acceso)

    def test_buscar_por_qr(self):
        from terceros.services import tercero_set_new_pin, tercero_registra_entrada
        tercero_set_new_pin(tercero_id=self.acompanante.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=self.acompanante.id, raw_pin='0000')
        self.acompanante.refresh_from_db()
        self.acompanante.qr_acceso = 'prueba_qr'
        self.acompanante.save()

        response = self.list_route_post(
            'buscar_por_qr/',
            {'codigo_qr': 'prueba_qr'}
        )
        respuesta = response.data
        self.assertEqual(self.acompanante.id, respuesta.get('id'))
        response = self.list_route_post(
            'buscar_por_qr/',
            {'codigo_qr': 'prueba_qrS'},
            True
        )
        respuesta = response.data
        self.assertEqual(respuesta, {'_error': 'No se encuentra usuario con este codigo qr'})

    def test_listar_ausentes(self):
        from terceros.factories import AcompananteFactory
        AcompananteFactory()
        response = self.list_route_get('listar_ausentes/')
        self.assertEqual(len(response.data), 3)

    def test_listar_presentes(self):
        from terceros.factories import AcompananteFactory
        from terceros.services import tercero_set_new_pin, tercero_registra_entrada
        AcompananteFactory()
        tercero_nuevo = AcompananteFactory()
        tercero_set_new_pin(tercero_id=tercero_nuevo.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=tercero_nuevo.id, raw_pin='0000')
        tercero_set_new_pin(tercero_id=self.acompanante.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=self.acompanante.id, raw_pin='0000')
        response = self.list_route_get('listar_presentes/')
        self.assertEqual(len(response.data), 2)

    def test_registrar_ingreso_salida(self):
        from terceros.services import tercero_set_new_pin
        tercero_set_new_pin(tercero_id=self.acompanante.id, raw_pin='0000')
        self.detail_route_post(
            'registrar_ingreso',
            {'pin': '0000'},
            self.acompanante.id
        )
        self.acompanante.refresh_from_db()
        self.assertTrue(self.acompanante.presente)
        self.detail_route_post(
            'registrar_salida',
            {'pin': '0000'},
            self.acompanante.id
        )
        self.acompanante.refresh_from_db()
        self.assertFalse(self.acompanante.presente)

    def test_validar_documento(self):
        response = self.list_route_get(
            'validar_documento_tercero/?nro_identificacion=%s' % self.colaborador.nro_identificacion
        )
        self.assertEqual(response.data, {'nro_identificacion': 'Ya exite'})
        response = self.list_route_get(
            'validar_documento_tercero/?nro_identificacion=no_existe',
            True
        )
        self.assertEqual(response.data, {})


class ColaboradorTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import ColaboradorFactory
        super().setUp()
        self.Factory = ColaboradorFactory
        self.url = '/api/colaboradores/'
        self.permiso = 'tercero'
        self.modelo = Tercero
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test.pop('usuario')
        self.data_for_update_test = {'nombre': 'Jaime', 'imagen_perfil': None}

    def test_crear(self):
        self.crear()

    def test_update(self):
        self.update()

    def test_delete(self):
        self.delete()

    def test_list(self):
        self.list()

    def test_adicionar_quitar_punto_venta(self):
        from ..factories import ColaboradorFactory
        from puntos_venta.factories import PuntoVentaFactory
        colaborador = ColaboradorFactory()
        punto_venta = PuntoVentaFactory()
        self.assertTrue(colaborador.usuario.mis_puntos_venta.all().count() == 0)
        self.detail_route_post('adicionar_punto_venta', {'punto_venta_id': punto_venta.id}, colaborador.id)
        self.assertTrue(colaborador.usuario.mis_puntos_venta.all().count() == 1)
        self.detail_route_post('quitar_punto_venta', {'punto_venta_id': punto_venta.id}, colaborador.id)
        self.assertTrue(colaborador.usuario.mis_puntos_venta.all().count() == 0)


class AcompananteTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import AcompananteFactory
        from terceros.factories import CategoriaAcompananteFactory
        super().setUp()
        self.Factory = AcompananteFactory
        self.url = '/api/acompanantes/'
        self.permiso = 'tercero'
        categoria_modelo = CategoriaAcompananteFactory()
        self.modelo = Tercero
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test.pop('usuario')
        self.data_for_create_test['categoria_modelo'] = categoria_modelo.id
        self.data_for_update_test = {'nombre': 'Maria', 'imagen_perfil': None}

    def test_crear(self):
        self.crear()

    def test_update(self):
        self.update()

    def callback_view_puede_ver_informacion(self, response):
        self.assertTrue(response.data['nombre_1'] == self.data_for_create_test['nombre'])
        self.assertTrue(response.data['nombre_segundo_1'] == self.data_for_create_test['nombre_segundo'])
        self.assertTrue(response.data['apellido_1'] == self.data_for_create_test['apellido'])
        self.assertTrue(
            response.data['apellido_segundo_1'] == self.data_for_create_test['apellido_segundo'])
        self.assertTrue(self.data_for_create_test['nro_identificacion'] in response.data['identificacion'])
        self.assertTrue(self.data_for_create_test['nombre'] in response.data['full_name'])
        self.assertTrue(self.data_for_create_test['apellido'] in response.data['full_name'])

    def callback_view_puede_no_puede_ver_informacion(self, response):
        self.assertIsNone(response.data['nombre_1'])
        self.assertIsNone(response.data['nombre_segundo_1'])
        self.assertIsNone(response.data['apellido_1'])
        self.assertIsNone(response.data['apellido_segundo_1'])
        self.assertIsNone(response.data['full_name'])
        self.assertIsNone(response.data['identificacion'])

    def test_view_puede_ver_informacion(self):
        permiso = Permission.objects.get(codename='view_privado_terceroacompanante')
        self.user.user_permissions.add(permiso)
        self.list(callback_view=self.callback_view_puede_ver_informacion)

    def test_view_no_puede_ver_informacion(self):
        self.list(callback_view=self.callback_view_puede_no_puede_ver_informacion)

    def test_list(self):
        self.list()

    def test_delete(self):
        self.delete()

    def test_listar_presentes(self):
        from terceros.factories import AcompananteFactory
        from terceros.services import acompanante_encriptar, tercero_registra_entrada, tercero_set_new_pin
        entrara = AcompananteFactory(
            nombre=acompanante_encriptar('uno'),
            nombre_segundo=acompanante_encriptar('dos'),
            apellido=acompanante_encriptar('uno'),
            apellido_segundo=acompanante_encriptar('uno'),
            nro_identificacion=acompanante_encriptar('uno')
        )
        AcompananteFactory()
        AcompananteFactory()
        tercero_set_new_pin(tercero_id=entrara.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=entrara.id, raw_pin='0000')
        response = self.list_route_get('listar_presentes/')
        self.assertEqual(len(response.data), 1)

    def test_validar_documento_acompanante(self):
        from terceros.factories import AcompananteFactory
        from terceros.services import acompanante_encriptar, acompanante_desencriptar
        acompanante = AcompananteFactory(
            nombre=acompanante_encriptar('uno'),
            nombre_segundo=acompanante_encriptar('dos'),
            apellido=acompanante_encriptar('uno'),
            apellido_segundo=acompanante_encriptar('uno'),
            nro_identificacion=acompanante_encriptar('uno')
        )
        response = self.list_route_get(
            'validar_documento_acompanante/?nro_identificacion_1=%s' % acompanante_desencriptar(
                acompanante.nro_identificacion))
        self.assertEqual(response.data, {'nro_identificacion_1': 'Ya exite'})
        response = self.list_route_get(
            'validar_documento_acompanante/?alias_modelo=%s' % acompanante.alias_modelo)
        self.assertEqual(response.data, {'alias_modelo': 'Ya exite'})


class CuentaTerceroTestsApi(BaseTestsApi):
    def setUp(self):
        super().setUp()
        self.acompanantesSetUp()
        self.colaboradoresSetUp()
        self.habitacionesSetUp()
        self.usuariosSetUp()
        self.billetesMonedasSetUp()
        self.url = '/api/terceros_cuentas/'

    def test_metodos_cuentas_api(self):
        from ..models import Cuenta
        usuario_cajero = self.colaborador_cajero.usuario
        self.cambiar_token_admin(usuario_cajero)
        self.hacer_movimiento_para_punto_venta_abierto(self.punto_venta)
        response = self.list_route_get('cuentas_sin_liquidar/')
        for x in response.data:
            for s in x.items():
                if s[0] == 'liquidada':
                    self.assertFalse(s[1])

        response = self.list_route_get('cuentas_acompanantes_sin_liquidar/')
        for x in response.data:
            for s in x.items():
                if s[0] == 'liquidada':
                    self.assertFalse(s[1])
                if s[0] == 'es_acompanante':
                    self.assertTrue(s[1])

        cuenta_acompanante = Cuenta.cuentas_acompanantes.sin_liquidar().first()
        response = self.retrive_get(cuenta_acompanante.id)

        response = self.detail_route_post(
            'liquidar_cuenta_acompanante',
            {
                'valor_efectivo': 10000
            },
            cuenta_acompanante.id
        )
        self.assertTrue('liquidacion_id' in response.data)

        self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=4,
            mesero=self.colaborador_mesero
        )

        cuenta_mesero = Cuenta.cuentas_meseros.sin_liquidar().first()
        response = self.retrive_get(cuenta_mesero.id)

        self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=4,
            cliente=self.colaborador_dos
        )

        cuenta_colaborador = Cuenta.cuentas_colaboradores.sin_liquidar().first()
        response = self.retrive_get(cuenta_colaborador.id)

        response = self.detail_route_post(
            'liquidar_cuenta_mesero',
            {
                'valor_efectivo': 10000
            },
            cuenta_mesero.id
        )
        self.assertTrue('liquidacion_id' in response.data)
