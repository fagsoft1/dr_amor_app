from django.test import TestCase
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from faker import Faker

faker = Faker()


class VentaProductosServicesTests(TestCase):
    def setUp(self):
        from terceros.factories import ColaboradorFactory, AcompananteFactory
        from puntos_venta.factories import PuntoVentaFactory
        from usuarios.services import usuario_login
        from terceros.services import tercero_registra_entrada, tercero_set_new_pin
        from inventarios.factories import MovimientoInventarioDetalleFactory
        from inventarios.services import (
            movimiento_inventario_aplicar_movimiento,
            movimiento_inventario_saldo_inicial_crear
        )
        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)

        self.bodega = self.punto_venta.bodega
        self.bodega.es_principal = False
        self.bodega.save()

        self.colaborador = ColaboradorFactory()
        tercero_set_new_pin(
            tercero_id=self.colaborador.id,
            raw_pin='0000'
        )
        tercero_registra_entrada(
            tercero_id=self.colaborador.id,
            raw_pin='0000'
        )
        usuario_login(
            usuario_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id
        )

        self.acompanante = AcompananteFactory()
        tercero_set_new_pin(
            tercero_id=self.acompanante.id,
            raw_pin='0000'
        )
        tercero_registra_entrada(
            tercero_id=self.acompanante.id,
            raw_pin='0000'
        )
        movimiento = movimiento_inventario_saldo_inicial_crear(
            fecha=timezone.now(),
            bodega_destino_id=self.bodega.id,
            usuario_id=self.colaborador.usuario.id

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

    def crear_pedido(self):
        return [
            {'producto_id': self.mid_uno.producto.id, 'precio_total': 2000, 'cantidad': 1},
            {'producto_id': self.mid_dos.producto.id, 'precio_total': 3000, 'cantidad': 2},
            {'producto_id': self.mid_tres.producto.id, 'precio_total': 4000, 'cantidad': 3},
        ]

    def crear_pedido_errado_producto_no_existente(self):
        return [
            {'producto_id': self.mid_uno.producto.id, 'precio_total': 2000, 'cantidad': 1},
            {'producto_id': self.mid_dos.producto.id, 'precio_total': 3000, 'cantidad': 2},
            {'producto_id': 1000, 'precio_total': 4000, 'cantidad': 3},
        ]

    def crear_pedido_errado_cantidad_no_existente(self):
        return [
            {'producto_id': self.mid_uno.producto.id, 'precio_total': 2000, 'cantidad': 1},
            {'producto_id': self.mid_dos.producto.id, 'precio_total': 3000, 'cantidad': 2},
            {'producto_id': self.mid_tres.producto.id, 'precio_total': 4000000, 'cantidad': 3000},
        ]

    def crear_venta_producto_a_acompanante(self):
        from ventas.services import venta_producto_crear
        return venta_producto_crear(
            punto_venta_turno_id=self.colaborador.turno_punto_venta_abierto.id,
            cuenta_id=self.acompanante.cuenta_abierta.id
        )

    def crear_venta_producto_sin_cuenta(self):
        from ventas.services import venta_producto_crear
        return venta_producto_crear(
            punto_venta_turno_id=self.colaborador.turno_punto_venta_abierto.id
        )

    def test_venta_producto_crear(self):
        venta = self.crear_venta_producto_a_acompanante()
        self.assertEqual(venta.punto_venta_turno_id, self.colaborador.turno_punto_venta_abierto.id)
        self.assertEqual(venta.cuenta_id, self.acompanante.cuenta_abierta.id)

        venta = self.crear_venta_producto_sin_cuenta()
        self.assertIsNone(venta.cuenta)
        self.assertEqual(venta.punto_venta_turno_id, self.colaborador.turno_punto_venta_abierto.id)

    def test_venta_producto_crear_tercero_no_presente(self):
        self.acompanante.presente = False
        self.acompanante.save()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El usuario al que se le crea la venta debe de estar presente'}"
        ):
            self.crear_venta_producto_a_acompanante()

    def test_venta_producto_crear_cajero_turno_cerrado(self):
        from ventas.services import venta_producto_crear
        punto_venta_turno = self.colaborador.turno_punto_venta_abierto
        punto_venta_turno.finish = timezone.now()
        punto_venta_turno.save()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El turno del punto de venta que crea la venta debe estar abierto'}"
        ):
            return venta_producto_crear(
                punto_venta_turno_id=punto_venta_turno.id
            )

    def test_venta_producto_efectuar_venta_colaborador(self):
        from ventas.services import venta_producto_efectuar_venta
        from terceros.services import tercero_generarQR
        self.assertTrue(self.acompanante.cuenta_abierta.compras_productos.all().count() == 0)
        venta = venta_producto_efectuar_venta(
            usuario_pdv_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id,
            tipo_venta=3,
            pedidos=self.crear_pedido(),
            cliente_usuario_id=self.acompanante.usuario.id,
            cliente_qr_codigo=tercero_generarQR(self.acompanante.id).qr_acceso
        )
        movimientos_detalles_venta = venta.movimientos.first()
        [self.assertTrue(x.es_ultimo_saldo) for x in movimientos_detalles_venta.detalles.all()]
        self.assertTrue(movimientos_detalles_venta.sale_cantidad, 6)
        self.assertTrue(movimientos_detalles_venta.sale_costo, 6000)
        self.assertTrue(movimientos_detalles_venta.detalle, 'Salida de Mercancia x Venta')
        self.assertTrue(movimientos_detalles_venta.motivo, 'venta')
        self.assertTrue(self.acompanante.cuenta_abierta.compras_productos.all().count() == 1)
        productos = self.acompanante.cuenta_abierta.compras_productos.first().productos.all()
        self.assertEqual(productos.count(), 3)

        venta_detalle = venta.productos.all()
        [self.assertEqual(int(x.precio_unitario), int(x.precio_total / x.cantidad)) for x in venta_detalle]

    def test_venta_producto_efectuar_venta_mesero(self):
        from ventas.services import venta_producto_efectuar_venta
        from terceros.services import tercero_generarQR
        colaborador_dos = self.acompanante
        colaborador_dos.es_colaborador = True
        colaborador_dos.es_acompanante = True
        colaborador_dos.presente = True
        colaborador_dos.save()
        self.assertTrue(colaborador_dos.cuenta_abierta_mesero.compras_productos.all().count() == 0)
        venta = venta_producto_efectuar_venta(
            usuario_pdv_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id,
            tipo_venta=2,
            pedidos=self.crear_pedido(),
            cliente_usuario_id=colaborador_dos.usuario.id,
            cliente_qr_codigo=tercero_generarQR(colaborador_dos.id).qr_acceso
        )
        movimientos_detalles_venta = venta.movimientos.first()
        [self.assertTrue(x.es_ultimo_saldo) for x in movimientos_detalles_venta.detalles.all()]
        self.assertTrue(movimientos_detalles_venta.sale_cantidad, 6)
        self.assertTrue(movimientos_detalles_venta.sale_costo, 6000)
        self.assertTrue(movimientos_detalles_venta.detalle, 'Salida de Mercancia x Venta')
        self.assertTrue(movimientos_detalles_venta.motivo, 'venta')
        self.assertTrue(colaborador_dos.cuenta_abierta_mesero.compras_productos.all().count() == 1)
        productos = colaborador_dos.cuenta_abierta_mesero.compras_productos.first().productos.all()
        self.assertEqual(productos.count(), 3)
        self.assertEqual(int(colaborador_dos.cuenta_abierta_mesero.dinero_a_entregar_mesero), 9000)

    def test_venta_producto_efectuar_venta_sin_tercero(self):
        from ventas.services import venta_producto_efectuar_venta
        venta = venta_producto_efectuar_venta(
            usuario_pdv_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id,
            tipo_venta=1,
            pedidos=self.crear_pedido()
        )
        movimientos_detalles_venta = venta.movimientos.first()
        [self.assertTrue(x.es_ultimo_saldo) for x in movimientos_detalles_venta.detalles.all()]
        self.assertTrue(movimientos_detalles_venta.sale_cantidad, 6)
        self.assertTrue(movimientos_detalles_venta.sale_costo, 6000)
        self.assertTrue(movimientos_detalles_venta.detalle, 'Salida de Mercancia x Venta')
        self.assertTrue(movimientos_detalles_venta.motivo, 'venta')

    def test_venta_producto_efectuar_venta_producto_no_existente(self):
        from ventas.services import venta_producto_efectuar_venta
        from terceros.services import tercero_generarQR
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No existe en el inventario el item de código"
        ):
            venta_producto_efectuar_venta(
                usuario_pdv_id=self.colaborador.usuario.id,
                punto_venta_id=self.punto_venta.id,
                tipo_venta=3,
                pedidos=self.crear_pedido_errado_producto_no_existente(),
                cliente_usuario_id=self.acompanante.usuario.id,
                cliente_qr_codigo=tercero_generarQR(self.acompanante.id).qr_acceso
            )

    def test_venta_producto_efectuar_venta_cantidad_no_existente(self):
        from ventas.services import venta_producto_efectuar_venta
        from terceros.services import tercero_generarQR
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No hay suficientes existencias del producto"
        ):
            venta_producto_efectuar_venta(
                usuario_pdv_id=self.colaborador.usuario.id,
                punto_venta_id=self.punto_venta.id,
                tipo_venta=3,
                pedidos=self.crear_pedido_errado_cantidad_no_existente(),
                cliente_usuario_id=self.acompanante.usuario.id,
                cliente_qr_codigo=tercero_generarQR(self.acompanante.id).qr_acceso
            )
