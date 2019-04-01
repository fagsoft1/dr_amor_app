import json

from django.utils import timezone

from dr_amor_app.utilities_tests.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class PuntoVentaTestApi(BaseTestsApi):
    def setUp(self):
        super().setUp()
        from puntos_venta.factories import PuntoVentaFactory
        from inventarios.factories import BodegaFactory
        from puntos_venta.models import PuntoVenta
        self.bodega = BodegaFactory(es_principal=True)
        self.Factory = PuntoVentaFactory
        self.url = '/api/puntos_ventas/'
        self.permiso = 'puntoventa'
        self.modelo = PuntoVenta
        self.data_for_create_test = self.Factory.stub(abierto=False).__dict__
        self.data_for_create_test['bodega'] = self.bodega.id
        self.data_for_create_test['usuario_actual'] = self.user.id
        self.data_for_update_test = {'abierto': True}

    def test_ingreso_no_autorizado(self):
        self.ingreso_no_autorizado()

    def test_crear(self):
        self.crear()

    def test_update(self):
        self.update()

    def test_delete(self):
        self.delete()

    def test_list(self):
        self.list()

    def crear_productos(self):
        from inventarios.services import (
            movimiento_inventario_saldo_inicial_crear,
            movimiento_inventario_aplicar_movimiento
        )
        from inventarios.factories import MovimientoInventarioDetalleFactory
        movimiento = movimiento_inventario_saldo_inicial_crear(
            fecha=timezone.now(),
            bodega_destino_id=self.bodega.id,
            usuario_id=self.user.id

        )
        self.mid_uno = MovimientoInventarioDetalleFactory(
            movimiento=movimiento
        )
        self.mid_dos = MovimientoInventarioDetalleFactory(
            movimiento=movimiento
        )
        self.mid_tres = MovimientoInventarioDetalleFactory(
            movimiento=movimiento
        )
        movimiento_inventario_aplicar_movimiento(
            movimiento_inventario_id=movimiento.id
        )

    def crear_base_venta(self):
        self.crear_productos()
        from terceros.factories import ColaboradorFactory, AcompananteFactory, CuentaColaboradorFactory
        from ..factories import PuntoVentaFactory
        from ..services import punto_venta_abrir
        from terceros.services import (
            tercero_set_new_pin,
            tercero_registra_entrada
        )
        tercero = ColaboradorFactory()
        tercero.usuario = self.user
        tercero.save()
        tercero_set_new_pin(
            tercero_id=tercero.id,
            raw_pin='0000'
        )
        tercero_registra_entrada(
            tercero_id=tercero.id,
            raw_pin='0000'
        )
        punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None, bodega=self.bodega)
        self.punto_venta, punto_venta_turno = punto_venta_abrir(
            punto_venta_id=punto_venta.id,
            usuario_pv_id=self.user.id
        )

        acompanante = AcompananteFactory()
        tercero_set_new_pin(
            tercero_id=acompanante.id,
            raw_pin='0000'
        )
        tercero_registra_entrada(
            tercero_id=acompanante.id,
            raw_pin='0000'
        )
        self.cuenta = CuentaColaboradorFactory(propietario=acompanante.usuario)
        self.pedido = [
            {'producto_id': self.mid_uno.producto.id, 'precio_total': 2000, 'cantidad': 1},
            {'producto_id': self.mid_dos.producto.id, 'precio_total': 3000, 'cantidad': 2},
            {'producto_id': self.mid_tres.producto.id, 'precio_total': 4000, 'cantidad': 3},
        ]

    def test_efectuar_venta_producto_con_cuenta(self):
        self.crear_base_venta()
        from terceros.services import tercero_generarQR
        self.detail_route_post(
            'efectuar_venta_producto',
            {
                'tercero_id': self.user.tercero.id,
                'qr_codigo': tercero_generarQR(self.user.tercero.id).qr_acceso,
                'tipo_venta': 2,
                'pedido': json.dumps(self.pedido)
            },
            self.punto_venta.id
        )

    def test_efectuar_venta_producto_sin_cuenta(self):
        self.crear_base_venta()
        self.detail_route_post(
            'efectuar_venta_producto',
            {
                'tipo_venta': 1,
                'pedido': json.dumps(self.pedido),
                'pago_efectivo': 9000
            },
            self.punto_venta.id
        )

    def test_listar_por_colaborador_y_username(self):
        from terceros.factories import ColaboradorFactory
        from ..factories import PuntoVentaFactory
        tercero = ColaboradorFactory()
        response = self.list_route_get('listar_por_colaborador/?colaborador_id=%s' % tercero.id)
        self.assertEqual(len(response.data), 0)
        response = self.list_route_get('listar_por_usuario_username/?username=%s' % tercero.usuario.username)
        self.assertEqual(len(response.data), 0)
        pv_uno = PuntoVentaFactory()
        pv_dos = PuntoVentaFactory()
        tercero.usuario.mis_puntos_venta.add(pv_uno)
        tercero.usuario.mis_puntos_venta.add(pv_dos)
        response = self.list_route_get('listar_por_colaborador/?colaborador_id=%s' % tercero.id)
        self.assertEqual(len(response.data), 2)
        response = self.list_route_get('listar_por_usuario_username/?username=%s' % tercero.usuario.username)
        self.assertEqual(len(response.data), 2)
