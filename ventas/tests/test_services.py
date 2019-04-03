import random

from django.db.models import Sum
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from faker import Faker

from dr_amor_app.utilities_tests.test_base import BaseTest

faker = Faker()


class VentaProductosServicesTests(BaseTest):
    def setUp(self):
        self.acompanantesSetUp()
        self.colaboradoresSetUp()
        self.ventasProductosInventarioInicialSetUp()

    def crear_pedido(self, nro_referencias=3, inventario_no_existente=False):
        from productos.models import Producto
        if not Producto.objects.exists():
            array_ids = self.crear_inventarios_productos(nro_referencias=nro_referencias)
        else:
            array_ids = Producto.objects.values_list('pk', flat=True)
        valor_pedido = 0
        cantidad_pedido = 0
        pedido = []
        informacion = {
            'cantidad_pedido': 0,
            'valor_pedido': 0,
            'array_id_items': [],
            'pedido': None
        }
        for x in array_ids:
            producto = Producto.objects.get(pk=x)
            cantidad = random.randint(1, 20)
            if inventario_no_existente:
                cantidad = cantidad * 10000000
            cantidad_pedido += cantidad

            valor = producto.precio_venta * cantidad
            valor_pedido += valor

            pedido.append({'producto_id': x, 'precio_total': valor, 'cantidad': cantidad})
            informacion['array_id_items'].append(x)
        informacion['valor_pedido'] = valor_pedido
        informacion['cantidad_pedido'] = cantidad_pedido
        informacion['pedido'] = pedido

        return informacion

    def crear_pedido_errado_producto_no_existente(self):
        return [
            {'producto_id': 1, 'precio_total': 2000, 'cantidad': 1},
            {'producto_id': 2, 'precio_total': 3000, 'cantidad': 2},
            {'producto_id': 100000, 'precio_total': 4000, 'cantidad': 3},
        ]

    def crear_venta_producto_a_acompanante(self):
        from ventas.services import venta_producto_crear
        return venta_producto_crear(
            punto_venta_turno_id=self.colaborador_cajero.turno_punto_venta_abierto.id,
            cuenta_id=self.acompanante.cuenta_abierta.id
        )

    def crear_venta_producto_sin_cuenta(self):
        from ventas.services import venta_producto_crear
        return venta_producto_crear(
            punto_venta_turno_id=self.colaborador_cajero.turno_punto_venta_abierto.id
        )

    def test_venta_producto_crear(self):
        venta = self.crear_venta_producto_a_acompanante()
        self.assertEqual(venta.punto_venta_turno_id, self.colaborador_cajero.turno_punto_venta_abierto.id)
        self.assertEqual(venta.cuenta_id, self.acompanante.cuenta_abierta.id)

        venta = self.crear_venta_producto_sin_cuenta()
        self.assertIsNone(venta.cuenta)
        self.assertEqual(venta.punto_venta_turno_id, self.colaborador_cajero.turno_punto_venta_abierto.id)

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
        punto_venta_turno = self.colaborador_cajero.turno_punto_venta_abierto
        punto_venta_turno.finish = timezone.now()
        punto_venta_turno.save()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El turno del punto de venta que crea la venta debe estar abierto'}"
        ):
            return venta_producto_crear(
                punto_venta_turno_id=punto_venta_turno.id
            )

    def test_venta_producto_efectuar(self):
        from ventas.services import venta_producto_efectuar_venta
        from terceros.services import tercero_generarQR
        self.assertTrue(self.acompanante.cuenta_abierta.compras_productos.all().count() == 0)
        pedido_ini = self.crear_pedido(nro_referencias=5)
        venta_producto_efectuar_venta(
            usuario_pdv_id=self.colaborador_cajero.usuario.id,
            punto_venta_id=self.punto_venta.id,
            tipo_venta=3,
            pedidos=pedido_ini['pedido'],
            cliente_usuario_id=self.colaborador_dos.usuario.id,
            cliente_qr_codigo=tercero_generarQR(self.colaborador_dos.id).qr_acceso
        )

        self.assertEqual(
            self.colaborador_dos.cuenta_abierta.egreso_por_compras_productos,
            pedido_ini['valor_pedido']
        )

        pedido = self.crear_pedido(nro_referencias=5)
        venta = venta_producto_efectuar_venta(
            usuario_pdv_id=self.colaborador_cajero.usuario.id,
            punto_venta_id=self.punto_venta.id,
            tipo_venta=3,
            pedidos=pedido['pedido'],
            cliente_usuario_id=self.acompanante.usuario.id,
            cliente_qr_codigo=tercero_generarQR(self.acompanante.id).qr_acceso
        )
        valor_pedido_efectivo = venta.productos.aggregate(
            precio_venta=Sum('precio_total')
        )['precio_venta']
        cantidad_pedido_efectivo = venta.productos.aggregate(
            cantidad=Sum('cantidad')
        )['cantidad']
        valor_pedido_esperado = pedido['valor_pedido']
        cantidad_pedido_esperado = pedido['cantidad_pedido']

        self.assertEqual(valor_pedido_efectivo, valor_pedido_esperado)
        self.assertEqual(cantidad_pedido_efectivo, cantidad_pedido_esperado)

        movimientos_detalles_venta = venta.movimientos.first()
        self.assertEqual(movimientos_detalles_venta.detalle, 'Salida de Mercancia x Venta')
        self.assertEqual(movimientos_detalles_venta.motivo, 'venta')
        for x in pedido['pedido']:
            producto_id = x.get('producto_id')
            cantidad = x.get('cantidad')
            precio_total = x.get('precio_total')
            movimiento_item = movimientos_detalles_venta.detalles.filter(producto__id=producto_id).first()
            venta_item = venta.productos.filter(producto__id=producto_id).first()
            self.assertEqual(movimiento_item.sale_cantidad, cantidad)
            self.assertEqual(movimiento_item.es_ultimo_saldo, True)
            self.assertEqual(venta_item.precio_total, precio_total)
            self.assertEqual(venta_item.cantidad, cantidad)
            self.assertEqual(venta_item.costo_unitario, movimiento_item.costo_unitario_promedio)
            self.assertEqual(venta_item.costo_total, movimiento_item.sale_costo)
        compras_productos = self.acompanante.cuenta_abierta.compras_productos.first()
        self.assertEqual(compras_productos.productos.count(), len(pedido['pedido']))
        self.assertEqual(
            self.acompanante.cuenta_abierta.egreso_por_compras_productos,
            pedido['valor_pedido']
        )

    def test_venta_producto_efectuar_venta_mesero(self):
        from ventas.services import venta_producto_efectuar_venta
        from terceros.services import tercero_generarQR
        pedido = self.crear_pedido()
        self.assertTrue(self.colaborador_dos.cuenta_abierta_mesero.compras_productos.all().count() == 0)
        venta = venta_producto_efectuar_venta(
            usuario_pdv_id=self.colaborador_cajero.usuario.id,
            punto_venta_id=self.punto_venta.id,
            tipo_venta=2,
            pedidos=pedido['pedido'],
            cliente_usuario_id=self.colaborador_dos.usuario.id,
            cliente_qr_codigo=tercero_generarQR(self.colaborador_dos.id).qr_acceso
        )
        movimientos_detalles_venta = venta.movimientos.first()
        self.assertEqual(movimientos_detalles_venta.detalle, 'Salida de Mercancia x Venta')
        self.assertEqual(movimientos_detalles_venta.motivo, 'venta')
        for x in pedido['pedido']:
            producto_id = x.get('producto_id')
            cantidad = x.get('cantidad')
            precio_total = x.get('precio_total')
            movimiento_item = movimientos_detalles_venta.detalles.filter(producto__id=producto_id).first()
            venta_item = venta.productos.filter(producto__id=producto_id).first()
            self.assertEqual(movimiento_item.sale_cantidad, cantidad)
            self.assertEqual(movimiento_item.es_ultimo_saldo, True)
            self.assertEqual(venta_item.precio_total, precio_total)
            self.assertEqual(venta_item.cantidad, cantidad)
            self.assertEqual(venta_item.costo_unitario, movimiento_item.costo_unitario_promedio)
            self.assertEqual(venta_item.costo_total, movimiento_item.sale_costo)

        compras_productos = self.colaborador_dos.cuenta_abierta_mesero.compras_productos.first()
        self.assertEqual(compras_productos.productos.count(), len(pedido['pedido']))
        self.assertEqual(
            self.colaborador_dos.cuenta_abierta_mesero.valor_ventas_productos,
            pedido['valor_pedido']
        )

    def test_venta_producto_efectuar_venta_sin_tipo_venta_existente(self):
        from ventas.services import venta_producto_efectuar_venta
        pedido = self.crear_pedido()

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No hay ninguna venta de este tipo'}"
        ):
            venta_producto_efectuar_venta(
                usuario_pdv_id=self.colaborador_cajero.usuario.id,
                punto_venta_id=self.punto_venta.id,
                tipo_venta=5,
                pedidos=pedido['pedido'],
                pago_efectivo=1
            )

    def test_venta_producto_efectuar_venta_sin_tercero(self):
        from ventas.services import venta_producto_efectuar_venta
        pedido = self.crear_pedido()

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El valor del pago no coincide con el valor de la compra. El valor de la compra es"
        ):
            venta_producto_efectuar_venta(
                usuario_pdv_id=self.colaborador_cajero.usuario.id,
                punto_venta_id=self.punto_venta.id,
                tipo_venta=1,
                pedidos=pedido['pedido'],
                pago_efectivo=1
            )
        venta = venta_producto_efectuar_venta(
            usuario_pdv_id=self.colaborador_cajero.usuario.id,
            punto_venta_id=self.punto_venta.id,
            tipo_venta=1,
            pedidos=pedido['pedido'],
            pago_efectivo=pedido['valor_pedido']
        )
        movimientos_detalles_venta = venta.movimientos.first()
        self.assertEqual(movimientos_detalles_venta.detalle, 'Salida de Mercancia x Venta')
        self.assertEqual(movimientos_detalles_venta.motivo, 'venta')
        for x in pedido['pedido']:
            producto_id = x.get('producto_id')
            cantidad = x.get('cantidad')
            precio_total = x.get('precio_total')
            movimiento_item = movimientos_detalles_venta.detalles.filter(producto__id=producto_id).first()
            venta_item = venta.productos.filter(producto__id=producto_id).first()
            self.assertEqual(movimiento_item.sale_cantidad, cantidad)
            self.assertEqual(movimiento_item.es_ultimo_saldo, True)
            self.assertEqual(venta_item.precio_total, precio_total)
            self.assertEqual(venta_item.cantidad, cantidad)
            self.assertEqual(venta_item.costo_unitario, movimiento_item.costo_unitario_promedio)
            self.assertEqual(venta_item.costo_total, movimiento_item.sale_costo)

        transaccion = venta.transacciones_caja.filter(
            tipo='I',
            tipo_dos='VENTA_PRODUCTO',
            concepto__contains='Ingreso x Venta de Producto en Efectivo'
        ).last()
        self.assertEqual(transaccion.valor_efectivo, pedido['valor_pedido'])
        self.assertEqual(transaccion.concepto, 'Ingreso x Venta de Producto en Efectivo')
        self.assertIsNone(venta.cuenta)

    def test_venta_producto_efectuar_venta_producto_no_existente(self):
        from ventas.services import venta_producto_efectuar_venta
        from terceros.services import tercero_generarQR
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No existe en el inventario el item de código"
        ):
            venta_producto_efectuar_venta(
                usuario_pdv_id=self.colaborador_cajero.usuario.id,
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
            pedido = self.crear_pedido(inventario_no_existente=True)
            venta_producto_efectuar_venta(
                usuario_pdv_id=self.colaborador_cajero.usuario.id,
                punto_venta_id=self.punto_venta.id,
                tipo_venta=3,
                pedidos=pedido['pedido'],
                cliente_usuario_id=self.acompanante.usuario.id,
                cliente_qr_codigo=tercero_generarQR(self.acompanante.id).qr_acceso
            )
