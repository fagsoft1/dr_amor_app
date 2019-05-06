from ..models import OperacionCaja, ArqueoCaja
from dr_amor_app.utilities_tests.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class OperacionCajaTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import OperacionCajaFactory, ConceptoOperacionCajaFactory
        from terceros.factories import ColaboradorFactory
        from puntos_venta.factories import PuntoVentaFactory
        from terceros.services import tercero_registra_entrada, tercero_set_new_pin
        from puntos_venta.services import punto_venta_abrir
        super().setUp()
        self.Factory = OperacionCajaFactory
        self.url = '/api/operaciones_caja/'
        self.permiso = 'operacioncaja'
        self.modelo = OperacionCaja
        self.data_for_create_test = self.Factory.stub().__dict__
        self.colaborador = ColaboradorFactory(usuario=self.user)
        tercero_set_new_pin(self.colaborador.id, '0000')
        tercero_registra_entrada(self.colaborador.id, '0000')
        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)
        punto_venta_abrir(
            base_inicial_efectivo=0,
            usuario_pv_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id
        )

        self.concepto = ConceptoOperacionCajaFactory(
            tipo='I',
            grupo='C',
            tipo_cuenta='CXC'
        )
        self.data_for_create_test['tercero'] = self.colaborador.id
        self.data_for_create_test['concepto'] = self.concepto.id
        self.data_for_create_test.pop('cuenta')
        self.data_for_update_test = {'observacion': 'probando'}

    def test_ingreso_no_autorizado(self):
        self.ingreso_no_autorizado()

    def test_crear(self):
        self.crear()

    def test_delete(self):
        self.delete()

    def test_list(self):
        self.list()

    def test_consultar_por_tercero_cuenta_abierta(self):
        self.crear()
        cuenta = self.colaborador.cuenta_abierta
        self.colaborador.usuario = self.superuser
        self.colaborador.save()
        response = self.list_route_get('consultar_por_tercero_cuenta_abierta/')
        cuenta_id = int(response.data[0]['cuenta'])
        self.assertEqual(cuenta_id, cuenta.id)
        valor = float(response.data[0]['valor'])
        self.assertEqual(abs(float(self.data_for_create_test.get('valor'))), abs(valor))


class ArqueoCajaTestsApi(BaseTestsApi):
    def setUp(self):
        from terceros.factories import ColaboradorFactory
        from puntos_venta.factories import PuntoVentaFactory
        from terceros.services import tercero_registra_entrada, tercero_set_new_pin
        from puntos_venta.services import punto_venta_abrir, punto_venta_cerrar
        super().setUp()
        self.url = '/api/arqueos_cajas/'
        self.permiso = 'arqueocaja'
        self.modelo = ArqueoCaja
        self.colaborador = ColaboradorFactory(usuario=self.superuser)
        tercero_set_new_pin(self.colaborador.id, '0000')
        tercero_registra_entrada(self.colaborador.id, '0000')
        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)
        punto_venta_abrir(
            base_inicial_efectivo=0,
            usuario_pv_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id
        )

        punto_venta_cerrar(
            usuario_pv_id=self.colaborador.usuario.id,
            entrega_efectivo_dict={},
            operaciones_caja_dict={},
            entrega_base_dict={},
            valor_tarjeta=0,
            nro_vauchers=0,
            valor_dolares=0,
            tasa_dolar=0
        )

        punto_venta_abrir(
            base_inicial_efectivo=0,
            usuario_pv_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id
        )
        self.punto_venta, self.arqueo = punto_venta_cerrar(
            usuario_pv_id=self.colaborador.usuario.id,
            entrega_efectivo_dict={},
            operaciones_caja_dict={},
            entrega_base_dict={},
            valor_tarjeta=200000,
            nro_vauchers=1,
            valor_dolares=0,
            tasa_dolar=0
        )

    def test_mi_ultimo_arqueo_caja(self):
        response = self.list_route_get('mi_ultimo_arqueo_caja/')
        data = response.data
        self.assertEqual(float(data.get('valor_tarjeta_entregados')), float(200000))

    def test_imprimir_entrega(self):
        response = self.detail_route_post('imprimir_entrega', {}, self.arqueo.id)
        data = response
        self.assertEqual(data.__dict__.get('_headers').get('content-type')[1], 'application/pdf')

    def test_imprimir_arqueo(self):
        response = self.detail_route_post('imprimir_arqueo', {}, self.arqueo.id)
        data = response
        self.assertEqual(data.__dict__.get('_headers').get('content-type')[1], 'application/pdf')
