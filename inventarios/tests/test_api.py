from django.utils import timezone

from dr_amor_app.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class BodegaTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import BodegaFactory
        from ..models import Bodega
        super().setUp()
        self.Factory = BodegaFactory
        self.url = '/api/bodegas/'
        self.permiso = 'bodega'
        self.modelo = Bodega
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_update_test = {'nombre': 'probando'}

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


class MovimientoInventarioTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import MovimientoInventarioFactory, BodegaFactory
        from usuarios.factories import UserFactory
        from terceros.factories import ProveedorFactory
        from ..models import MovimientoInventario
        super().setUp()
        self.Factory = MovimientoInventarioFactory
        self.url = '/api/movimiento_inventario/'
        self.permiso = 'movimientoinventario'
        self.modelo = MovimientoInventario
        bodega = BodegaFactory()
        creado_por = UserFactory()
        proveedor = ProveedorFactory()
        self.data_for_create_test = self.Factory.stub(motivo='compra').__dict__
        self.data_for_create_test['creado_por'] = creado_por.id
        self.data_for_create_test['proveedor'] = proveedor.id
        self.data_for_create_test['bodega'] = bodega.id
        self.data_for_update_test = {'entra_cantidad': 15}

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

    def test_saldos_iniciales(self):
        from ..services import movimiento_inventario_saldo_inicial_crear
        from ..factories import BodegaFactory
        from ..models import MovimientoInventario
        qs = MovimientoInventario.saldos_iniciales.all()
        count = qs.count()
        bodega_destino = BodegaFactory(es_principal=True)
        movimiento_inventario_saldo_inicial_crear(
            fecha=timezone.now(),
            bodega_destino_id=bodega_destino.id,
            usuario_id=self.user.id
        )
        movimiento_inventario_saldo_inicial_crear(
            fecha=timezone.now(),
            bodega_destino_id=bodega_destino.id,
            usuario_id=self.user.id
        )
        self.assertTrue(count == 0)
        response = self.list_route_get('saldos_iniciales/')
        count_dos = qs.count()
        self.assertEqual(len(response.data), count_dos)

    def test_cargar_inventario(self):
        from ..services import movimiento_inventario_saldo_inicial_crear, movimiento_inventario_detalle_entrada_add_item
        from ..factories import BodegaFactory
        from productos.factories import ProductoFactory
        producto_uno = ProductoFactory()
        producto_dos = ProductoFactory()
        producto_tres = ProductoFactory()
        bodega_destino = BodegaFactory(es_principal=True)
        movimiento_inventario = movimiento_inventario_saldo_inicial_crear(
            fecha=timezone.now(),
            bodega_destino_id=bodega_destino.id,
            usuario_id=self.user.id
        )
        self.assertFalse(movimiento_inventario.cargado)
        md_uno = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=movimiento_inventario.id,
            costo_total=100000,
            cantidad=30,
            producto_id=producto_uno.id
        )
        self.assertEqual(md_uno.saldo_costo, 0)
        self.assertEqual(md_uno.saldo_cantidad, 0)
        self.assertFalse(md_uno.es_ultimo_saldo)
        md_dos = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=movimiento_inventario.id,
            costo_total=200000,
            cantidad=55,
            producto_id=producto_dos.id
        )
        md_tres = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=movimiento_inventario.id,
            costo_total=150000,
            cantidad=22,
            producto_id=producto_tres.id
        )
        self.detail_route_post('cargar_inventario', None, movimiento_inventario.id)
        movimiento_inventario.refresh_from_db()
        md_uno.refresh_from_db()
        md_dos.refresh_from_db()
        md_tres.refresh_from_db()

        self.assertTrue(movimiento_inventario.cargado)

        self.assertEqual(md_uno.saldo_costo, 100000)
        self.assertEqual(md_uno.saldo_cantidad, 30)
        self.assertTrue(md_uno.es_ultimo_saldo)

        self.assertEqual(md_dos.saldo_costo, 200000)
        self.assertEqual(md_dos.saldo_cantidad, 55)
        self.assertTrue(md_dos.es_ultimo_saldo)

        self.assertEqual(md_tres.saldo_costo, 150000)
        self.assertEqual(md_tres.saldo_cantidad, 22)
        self.assertTrue(md_tres.es_ultimo_saldo)


class MovimientoInventarioDetalleTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import MovimientoInventarioDetalleFactory, BodegaFactory
        from productos.factories import ProductoFactory
        from ..services import movimiento_inventario_traslado_entrada_crear
        from ..models import MovimientoInventarioDetalle
        super().setUp()
        self.Factory = MovimientoInventarioDetalleFactory
        self.url = '/api/movimiento_inventario_detalle/'
        self.permiso = 'movimientoinventariodetalle'
        self.modelo = MovimientoInventarioDetalle
        movimiento = movimiento_inventario_traslado_entrada_crear(
            bodega_destino_id=BodegaFactory().id,
            usuario_id=self.user.id,
            detalle='algo'
        )
        self.producto = ProductoFactory()
        self.producto_dos = ProductoFactory()
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['movimiento'] = movimiento.id
        self.data_for_create_test['producto'] = self.producto.id
        self.data_for_update_test = {'entra_cantidad': 15}

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

    def crear_movimiento(self):
        from ..services import (
            movimiento_inventario_saldo_inicial_crear,
            movimiento_inventario_detalle_entrada_add_item,
            movimiento_inventario_aplicar_movimiento
        )
        from ..factories import BodegaFactory
        from puntos_venta.factories import PuntoVentaFactory
        from productos.factories import ProductoFactory
        producto_tres = ProductoFactory()
        bodega_destino = BodegaFactory(es_principal=True)
        PuntoVentaFactory(bodega=bodega_destino)
        movimiento_inventario = movimiento_inventario_saldo_inicial_crear(
            fecha=timezone.now(),
            bodega_destino_id=bodega_destino.id,
            usuario_id=self.user.id
        )
        movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=movimiento_inventario.id,
            costo_total=100000,
            cantidad=30,
            producto_id=self.producto.id
        )
        movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=movimiento_inventario.id,
            costo_total=200000,
            cantidad=55,
            producto_id=self.producto_dos.id
        )
        movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=movimiento_inventario.id,
            costo_total=150000,
            cantidad=22,
            producto_id=producto_tres.id
        )
        movimiento_inventario = movimiento_inventario_aplicar_movimiento(
            movimiento_inventario_id=movimiento_inventario.id
        )
        return movimiento_inventario

    def crear_movimiento_dos(self):
        from ..services import (
            movimiento_inventario_saldo_inicial_crear,
            movimiento_inventario_detalle_entrada_add_item,
            movimiento_inventario_aplicar_movimiento
        )
        from ..factories import BodegaFactory
        from productos.factories import ProductoFactory
        producto_dos = ProductoFactory()
        bodega_destino = BodegaFactory(es_principal=True)
        movimiento_inventario = movimiento_inventario_saldo_inicial_crear(
            fecha=timezone.now(),
            bodega_destino_id=bodega_destino.id,
            usuario_id=self.user.id
        )
        movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=movimiento_inventario.id,
            costo_total=40000,
            cantidad=8,
            producto_id=self.producto.id
        )
        movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=movimiento_inventario.id,
            costo_total=180000,
            cantidad=51,
            producto_id=producto_dos.id
        )
        movimiento_inventario = movimiento_inventario_aplicar_movimiento(
            movimiento_inventario_id=movimiento_inventario.id
        )
        return movimiento_inventario

    def test_por_movimiento(self):
        movimiento_inventario = self.crear_movimiento()
        movimiento_inventario_dos = self.crear_movimiento_dos()
        response = self.list_route_get('por_movimiento/?movimiento_id=%s' % movimiento_inventario.id)
        self.assertEqual(len(response.data), 3)
        response = self.list_route_get('por_movimiento/?movimiento_id=%s' % movimiento_inventario_dos.id)
        self.assertEqual(len(response.data), 2)

    def test_por_actual_por_bodega(self):
        movimiento_inventario = self.crear_movimiento()
        movimiento_inventario_dos = self.crear_movimiento_dos()
        response = self.list_route_get('actual_por_bodega/?bodega_id=%s' % movimiento_inventario.bodega_id)
        self.assertEqual(len(response.data), 3)
        response = self.list_route_get('actual_por_bodega/?bodega_id=%s' % movimiento_inventario_dos.bodega_id)
        self.assertEqual(len(response.data), 2)

    def test_por_bodega_por_producto(self):
        movimiento_inventario = self.crear_movimiento()
        movimiento_inventario_dos = self.crear_movimiento_dos()
        response = self.list_route_get('por_bodega_por_producto/?bodega_id=%s&producto_id=%s' % (
            movimiento_inventario.bodega_id, self.producto_dos.id))
        self.assertEqual(len(response.data), 1)
        response = self.list_route_get('por_bodega_por_producto/?bodega_id=%s&producto_id=%s' % (
            movimiento_inventario_dos.bodega_id, self.producto_dos.id))
        self.assertEqual(len(response.data), 0)

    def test_actual_por_pdv(self):
        movimiento_inventario = self.crear_movimiento()
        response = self.list_route_get(
            'actual_por_pdv/?punto_venta_id=%s' % movimiento_inventario.bodega.punto_venta.id)
        self.assertEqual(len(response.data), 3)
        response = self.list_route_get(
            'actual_por_pdv/?punto_venta_id=1123')
        self.assertEqual(len(response.data), 0)

    def test_por_bodega_por_fecha(self):
        fecha_inicial = timezone.now()
        movimiento_inventario = self.crear_movimiento()
        response = self.list_route_get(
            'por_bodega_por_fecha/?bodega_id=%s&fecha_inicial=01/%s/%s&fecha_final=01/01/2099' % (
                movimiento_inventario.bodega_id, fecha_inicial.month, fecha_inicial.year))
        self.assertEqual(len(response.data), 3)

        response = self.list_route_get(
            'por_bodega_por_fecha/?bodega_id=%s&fecha_inicial=01/%s/%s&fecha_final=01/01/2099' % (
                movimiento_inventario.bodega_id, fecha_inicial.month, fecha_inicial.year + 1))
        self.assertEqual(len(response.data), 0)


class TrasladoInventarioTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import TrasladoFactory, BodegaFactory
        from productos.factories import ProductoFactory
        from ..models import TrasladoInventario
        super().setUp()
        self.Factory = TrasladoFactory
        self.url = '/api/traslados_inventarios/'
        self.permiso = 'trasladoinventario'
        self.modelo = TrasladoInventario

        self.bodega_origen = BodegaFactory(es_principal=True)
        self.bodega_destino = BodegaFactory(es_principal=True)

        self.producto = ProductoFactory()
        self.producto_dos = ProductoFactory()
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['bodega_origen'] = self.bodega_origen.id
        self.data_for_create_test['bodega_destino'] = self.bodega_destino.id
        self.data_for_update_test = {'estado': 1}

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

    def test_trasladar(self):
        from ..services import traslado_inventario_crear
        traslado = traslado_inventario_crear(
            bodega_origen_id=self.bodega_origen.id,
            bodega_destino_id=self.bodega_destino.id,
            usuario_crea_id=self.superuser.id
        )
        self.assertFalse(traslado.trasladado)
        response = self.detail_route_post('trasladar', None, traslado.id)
        self.assertTrue(response.data.get('trasladado', None))


class TrasladoInventarioDetalleTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import (
            TrasladoInventarioDetalleFactory,
            TrasladoFactory,
            MovimientoInventarioDetalleFactory
        )
        from productos.factories import ProductoFactory
        from ..models import TrasladoInventarioDetalle
        from ..services import movimiento_inventario_aplicar_movimiento
        from ..factories import BodegaFactory
        super().setUp()
        self.Factory = TrasladoInventarioDetalleFactory
        self.url = '/api/traslados_inventarios_detalles/'
        self.permiso = 'trasladoinventariodetalle'
        self.modelo = TrasladoInventarioDetalle
        self.bodega_destino = BodegaFactory(es_principal=True)

        self.movimiento_inventario_detalle = MovimientoInventarioDetalleFactory()
        movimiento = self.movimiento_inventario_detalle.movimiento
        movimiento.motivo = 'compra'
        movimiento.tipo = 'E'
        movimiento.save()
        self.movimiento_inventario_detalle_dos = MovimientoInventarioDetalleFactory(
            movimiento=movimiento
        )
        self.movimiento_inventario_detalle_tres = MovimientoInventarioDetalleFactory(
            movimiento=movimiento
        )
        movimiento_inventario_aplicar_movimiento(movimiento.id)

        self.traslado = TrasladoFactory(
            bodega_origen=movimiento.bodega,
            bodega_destino=self.bodega_destino
        )
        self.producto = ProductoFactory()

        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['traslado'] = self.traslado.id
        self.data_for_create_test['producto'] = self.movimiento_inventario_detalle.producto.id
        self.data_for_update_test = {'cantidad': 1}

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

    def test_por_traslado(self):
        from ..factories import (
            TrasladoInventarioDetalleFactory
        )

        traslado_detalle = TrasladoInventarioDetalleFactory(
            traslado=self.traslado,
            producto=self.movimiento_inventario_detalle.producto,
            cantidad=1
        )
        TrasladoInventarioDetalleFactory(
            traslado=self.traslado,
            producto=self.movimiento_inventario_detalle_dos.producto,
            cantidad=1
        )
        TrasladoInventarioDetalleFactory(
            traslado=self.traslado,
            producto=self.movimiento_inventario_detalle_tres.producto,
            cantidad=1
        )
        response = self.list_route_get('por_traslado/?traslado_id=%s' % traslado_detalle.traslado.id)
        self.assertEqual(len(response.data), 3)
        response = self.list_route_get('por_traslado/?traslado_id=%s' % 11111)
        self.assertEqual(len(response.data), 0)
