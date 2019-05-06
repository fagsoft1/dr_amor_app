import json
from dr_amor_app.utilities_tests.test_api_base import BaseTestsApi

from faker import Faker
from ..models import Servicio

faker = Faker()


class ServicioTestsApi(BaseTestsApi):
    def setUp(self):
        super().setUp()
        self.acompanantesSetUp()
        self.colaboradoresSetUp()
        self.habitacionesSetUp()
        self.url = '/api/servicios/'

    def test_consultar_por_tercero_cuenta_abierta__terminados(self):
        self.hacer_servicios_desde_habitacion(
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            acompanante=self.acompanante,
            acompanante_dos=self.acompanante_dos,
            acompanante_tres=self.acompanante_tres,
            comision=0,
            nro_servicios=5,
            terminados=True
        )
        response = self.list_route_get('consultar_por_tercero_cuenta_abierta/?tercero_id=%s' % self.acompanante.id)
        for x in response.data:
            for s in x.items():
                if s[0] == 'acompanante':
                    self.assertEqual(int(s[1]), self.acompanante.id)

        response = self.list_route_get('terminados/')
        for x in response.data:
            for s in x.items():
                if s[0] == 'estado':
                    self.assertTrue(int(s[1]), 2)

    def test_en_proceso__pendientes_por_habitaciona__anulacion__terminar_servicio(self):
        self.hacer_servicios_desde_habitacion(
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            acompanante=self.acompanante,
            comision=0,
            nro_servicios=3,
            terminados=False
        )

        response = self.list_route_get('en_proceso/')
        for x in response.data:
            for s in x.items():
                if s[0] == 'estado':
                    self.assertTrue(s[1] in [1, 0])

        response = self.list_route_get('pendientes_por_habitacion/?habitacion_id=%s' % self.habitacion.id)
        for x in response.data:
            for s in x.items():
                if s[0] == 'estado':
                    self.assertTrue(s[1] in [1, 0])
                if s[0] == 'habitacion':
                    self.assertEqual(int(s[1]), self.habitacion.id)

        servicio = Servicio.objects.filter(estado=1).first()
        usuario_cajero = self.colaborador_cajero.usuario
        self.cambiar_token_admin(usuario_cajero)

        response = self.detail_route_post(
            'solicitar_anulacion',
            {
                'punto_venta_id': self.punto_venta.id,
                'observacion_anulacion': 'Esta es la observación'
            },
            servicio.id
        )
        self.assertTrue('Se ha solicitado anulación para el servicio de' in response.data.get('result'))

        servicio = Servicio.objects.filter(estado=1).last()
        usuario_cajero = self.colaborador_cajero.usuario
        self.cambiar_token_admin(usuario_cajero)

        response = self.detail_route_post(
            'terminar_servicio',
            {
                'punto_venta_id': self.punto_venta.id
            },
            servicio.id
        )
        self.assertTrue('El servicios de' in response.data.get('result'))
        self.assertTrue('se ha terminado' in response.data.get('result'))

    def test_cambiar_tiempo_servicio(self):
        from ..services import servicio_crear_nuevo, servicio_iniciar
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        valor_esperado_anterior_servicio = self.categoria_fraccion_tiempo_30.valor
        valor_esperado_nuevo_servicio = self.categoria_fraccion_tiempo_60.valor
        valor_a_pagar_esperado = valor_esperado_nuevo_servicio - valor_esperado_anterior_servicio

        usuario_cajero = self.colaborador_cajero.usuario
        self.cambiar_token_admin(usuario_cajero)

        response = self.detail_route_post(
            'cambiar_tiempo',
            {
                'pago': json.dumps({
                    'punto_venta_id': self.punto_venta.id,
                    'valor_efectivo': valor_a_pagar_esperado,
                    'valor_tarjeta': 0,
                    'nro_autorizacion': '',
                    'franquicia': '',
                    'categoria_fraccion_tiempo_id': self.categoria_fraccion_tiempo_60.id
                })
            },
            servicio.id
        )
        self.assertTrue('Se ha efectuado con éxito el cambio de tiempo' in response.data.get('result'))
