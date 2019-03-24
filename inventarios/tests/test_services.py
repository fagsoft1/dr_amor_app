from django.test import TestCase
from faker import Faker
from django.utils import timezone
from rest_framework.exceptions import ValidationError

faker = Faker()


class MovimientoInventarioEntradasServicesTests(TestCase):
    def setUp(self):
        from productos.factories import ProductoFactory
        from terceros.factories import ProveedorFactory
        from ..factories import BodegaFactory
        from usuarios.factories import UserFactory
        from ..services import (
            movimiento_inventario_saldo_inicial_crear,
            movimiento_inventario_compra_crear,
            movimiento_inventario_detalle_entrada_add_item
        )
        self.user = UserFactory()
        self.bodega_destino = BodegaFactory()
        self.usuario = UserFactory()
        self.proveedor = ProveedorFactory()

        self.movimiento_saldo_inicial = movimiento_inventario_saldo_inicial_crear(
            bodega_destino_id=self.bodega_destino.id,
            usuario_id=self.usuario.id,
            fecha=timezone.now()
        )

        self.movimiento_compra_dos = movimiento_inventario_compra_crear(
            bodega_destino_id=self.bodega_destino.id,
            usuario_id=self.usuario.id,
            proveedor_id=self.proveedor.id,
            fecha=timezone.now()
        )

        self.movimiento_compra_tres = movimiento_inventario_compra_crear(
            bodega_destino_id=self.bodega_destino.id,
            usuario_id=self.usuario.id,
            proveedor_id=self.proveedor.id,
            fecha=timezone.now()
        )

        self.producto_uno = ProductoFactory()
        self.producto_dos = ProductoFactory()
        self.producto_tres = ProductoFactory()

        self.mv_uno_detalle_uno = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=self.movimiento_saldo_inicial.id,
            producto_id=self.producto_uno.id,
            cantidad=20,
            costo_total=10000
        )
        self.mv_uno_detalle_dos = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=self.movimiento_saldo_inicial.id,
            producto_id=self.producto_dos.id,
            cantidad=20,
            costo_total=40000
        )

        self.mv_dos_detalle_uno = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=self.movimiento_compra_dos.id,
            producto_id=self.producto_uno.id,
            cantidad=10,
            costo_total=6000
        )
        self.mv_dos_detalle_dos = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=self.movimiento_compra_dos.id,
            producto_id=self.producto_dos.id,
            cantidad=10,
            costo_total=22000
        )

        self.mv_tres_detalle_tres = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=self.movimiento_compra_tres.id,
            producto_id=self.producto_tres.id,
            cantidad=15,
            costo_total=25000
        )

    def test_movimiento_inventario_aplicar_movimiento_a_movimiento_cargado(self):
        from ..services import movimiento_inventario_aplicar_movimiento
        self.movimiento_saldo_inicial.cargado = True
        self.movimiento_saldo_inicial.save()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Revisar, el movimiento ya ha sido cargado'}"
        ):
            movimiento_inventario_aplicar_movimiento(self.movimiento_saldo_inicial.id)

    def test_movimiento_inventario_saldo_inicial_crear(self):
        self.assertEqual(self.movimiento_saldo_inicial.tipo, 'E')
        self.assertEqual(self.movimiento_saldo_inicial.motivo, 'saldo_inicial')

    def test_movimiento_inventario_devolucion_crear(self):
        from ..services import movimiento_inventario_devolucion_crear
        movimiento_devolucion = movimiento_inventario_devolucion_crear(
            bodega_destino_id=self.movimiento_saldo_inicial.bodega.id,
            usuario_id=self.usuario.id
        )
        self.assertEqual(movimiento_devolucion.tipo, 'E')
        self.assertEqual(movimiento_devolucion.motivo, 'devolucion')

    def test_movimiento_inventario_traslado_entrada_crear(self):
        from ..services import movimiento_inventario_traslado_entrada_crear
        movimiento_traslado = movimiento_inventario_traslado_entrada_crear(
            bodega_destino_id=self.movimiento_saldo_inicial.bodega.id,
            usuario_id=self.usuario.id,
            detalle='el texto'
        )
        self.assertEqual(movimiento_traslado.tipo, 'E')
        self.assertEqual(movimiento_traslado.motivo, 'traslado')

    def test_movimiento_inventario_entrada_ajuste_crear(self):
        from ..services import movimiento_inventario_entrada_ajuste_crear
        movimiento_ajuste = movimiento_inventario_entrada_ajuste_crear(
            bodega_destino_id=self.movimiento_saldo_inicial.bodega.id,
            usuario_id=self.usuario.id,
            detalle='razón'
        )
        self.assertEqual(movimiento_ajuste.tipo, 'E')
        self.assertEqual(movimiento_ajuste.motivo, 'entrada_ajuste')

    def test_movimiento_inventario_compra_crear(self):
        self.assertEqual(self.movimiento_compra_dos.tipo, 'E')
        self.assertEqual(self.movimiento_compra_dos.motivo, 'compra')

    def test_movimiento_inventario_detalle_saldo_inicial_add_item(self):
        self.assertEqual(self.mv_uno_detalle_uno.entra_cantidad, 20)
        self.assertEqual(self.mv_uno_detalle_uno.entra_costo, 10000)
        self.assertEqual(self.mv_uno_detalle_uno.costo_unitario, 10000 / 20)
        self.assertFalse(self.mv_uno_detalle_uno.es_ultimo_saldo)

    def test_movimiento_inventario_detalle_saldo_inicial_aplicar_movimiento_sin_existencias(self):
        from ..services import movimiento_inventario_aplicar_movimiento
        movimiento_inventario = movimiento_inventario_aplicar_movimiento(self.movimiento_saldo_inicial.id)
        self.assertTrue(movimiento_inventario.cargado)
        [self.assertTrue(x.es_ultimo_saldo) for x in movimiento_inventario.detalles.all()]
        [self.assertEqual(x.costo_unitario, x.entra_costo / x.entra_cantidad) for x in
         movimiento_inventario.detalles.all()]
        [self.assertEqual(x.saldo_costo, x.entra_costo) for x in
         movimiento_inventario.detalles.all()]
        [self.assertEqual(x.saldo_cantidad, x.entra_cantidad) for x in
         movimiento_inventario.detalles.all()]

    def test_movimiento_inventario_detalle_saldo_inicial_aplicar_movimiento_con_existencias(self):
        from ..services import movimiento_inventario_detalle_entrada_add_item
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Este producto ya tiene existencias, no puede crear saldo inicial de nuevo'}"
        ):
            movimiento_inventario_detalle_entrada_add_item(
                movimiento_id=self.movimiento_saldo_inicial.id,
                producto_id=self.producto_uno,
                cantidad=10,
                costo_total=1000
            )

    def test_movimiento_inventario_detalle_compra_aplicar_movimiento_sin_existencias(self):
        from ..services import movimiento_inventario_aplicar_movimiento
        movimiento_inventario = movimiento_inventario_aplicar_movimiento(self.movimiento_compra_tres.id)
        self.assertTrue(movimiento_inventario.cargado)
        [self.assertTrue(x.es_ultimo_saldo) for x in movimiento_inventario.detalles.all()]
        [self.assertEqual(int(x.costo_unitario), int(x.entra_costo / x.entra_cantidad)) for x in
         movimiento_inventario.detalles.all()]
        [self.assertEqual(x.saldo_costo, x.entra_costo) for x in
         movimiento_inventario.detalles.all()]
        [self.assertEqual(x.saldo_cantidad, x.entra_cantidad) for x in
         movimiento_inventario.detalles.all()]

    def test_movimiento_inventario_detalle_compra_aplicar_movimiento_con_existencias(self):
        from ..services import movimiento_inventario_aplicar_movimiento
        movimiento_inventario = movimiento_inventario_aplicar_movimiento(self.movimiento_saldo_inicial.id)
        movimiento_inventario_dos = movimiento_inventario_aplicar_movimiento(self.movimiento_compra_dos.id)
        movimiento_inventario.refresh_from_db()
        self.assertTrue(movimiento_inventario.cargado)
        [self.assertFalse(x.es_ultimo_saldo) for x in movimiento_inventario.detalles.all()]
        self.assertTrue(movimiento_inventario_dos.cargado)
        [self.assertTrue(x.es_ultimo_saldo) for x in movimiento_inventario_dos.detalles.all()]

        self.mv_dos_detalle_uno.refresh_from_db()
        self.mv_uno_detalle_uno.refresh_from_db()

        self.assertEqual(self.mv_uno_detalle_uno.saldo_cantidad, 20)
        self.assertEqual(self.mv_uno_detalle_uno.saldo_costo, 10000)
        self.assertEqual(int(self.mv_uno_detalle_uno.costo_unitario_promedio), int(10000 / 20))
        self.assertEqual(int(self.mv_uno_detalle_uno.costo_unitario), int(10000 / 20))

        self.assertEqual(self.mv_dos_detalle_uno.saldo_cantidad, 30)
        self.assertEqual(self.mv_dos_detalle_uno.saldo_costo, 16000)
        self.assertEqual(int(self.mv_dos_detalle_uno.costo_unitario_promedio), int(16000 / 30))
        self.assertEqual(int(self.mv_dos_detalle_uno.costo_unitario), int(6000 / 10))

    def test_movimiento_inventario_add_detalle_tipo_entrada_en_movimiento_salida(self):
        from ..services import movimiento_inventario_venta_crear, movimiento_inventario_detalle_entrada_add_item
        movimiento_venta = movimiento_inventario_venta_crear(
            bodega_origen_id=self.bodega_destino.id,
            usuario_id=self.usuario.id
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No se puede agregar un detalle tipo entrada en un movimiento tipo salida'}"
        ):
            movimiento_inventario_detalle_entrada_add_item(
                movimiento_id=movimiento_venta.id,
                producto_id=self.producto_uno.id,
                cantidad=0,
                costo_total=0
            )


class MovimientoInventarioSalidasServicesTests(TestCase):
    def setUp(self):
        from productos.factories import ProductoFactory
        from terceros.factories import ProveedorFactory
        from ..factories import BodegaFactory
        from usuarios.factories import UserFactory
        from ..services import (
            movimiento_inventario_saldo_inicial_crear,
            movimiento_inventario_detalle_entrada_add_item,
            movimiento_inventario_aplicar_movimiento,
            movimiento_inventario_venta_crear,
            movimiento_inventario_detalle_salida_add_item
        )
        self.user = UserFactory()
        self.bodega = BodegaFactory()
        self.usuario = UserFactory()
        self.proveedor = ProveedorFactory()

        self.movimiento_compra = movimiento_inventario_saldo_inicial_crear(
            bodega_destino_id=self.bodega.id,
            usuario_id=self.usuario.id,
            fecha=timezone.now()
        )

        self.producto_uno = ProductoFactory()
        self.producto_dos = ProductoFactory()
        self.producto_tres = ProductoFactory()

        self.mv_uno_detalle_uno = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=self.movimiento_compra.id,
            producto_id=self.producto_uno.id,
            cantidad=20,
            costo_total=10000
        )
        self.mv_uno_detalle_dos = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=self.movimiento_compra.id,
            producto_id=self.producto_dos.id,
            cantidad=20,
            costo_total=40000
        )
        self.movimiento_compra = movimiento_inventario_aplicar_movimiento(
            movimiento_inventario_id=self.movimiento_compra.id
        )

        self.movimiento_venta = movimiento_inventario_venta_crear(
            bodega_origen_id=self.bodega.id,
            usuario_id=self.usuario.id
        )

        self.mv_venta_uno_uno = movimiento_inventario_detalle_salida_add_item(
            movimiento_id=self.movimiento_venta.id,
            producto_id=self.producto_uno.id,
            cantidad=5
        )

        self.mv_venta_uno_dos = movimiento_inventario_detalle_salida_add_item(
            movimiento_id=self.movimiento_venta.id,
            producto_id=self.producto_dos.id,
            cantidad=5
        )

        self.movimiento_venta = movimiento_inventario_aplicar_movimiento(
            movimiento_inventario_id=self.movimiento_venta.id
        )

        self.movimiento_compra.refresh_from_db()

    def test_movimiento_inventario_venta_crear(self):
        self.assertEqual(self.movimiento_venta.tipo, 'S')
        self.assertEqual(self.movimiento_venta.motivo, 'venta')

    def test_movimiento_inventario_salida_ajuste_crear(self):
        from ..services import movimiento_inventario_salida_ajuste_crear
        movimiento_salida_ajuste = movimiento_inventario_salida_ajuste_crear(
            bodega_origen_id=self.bodega.id,
            usuario_id=self.usuario.id,
            detalle='Este es el detalle'
        )
        self.assertEqual(movimiento_salida_ajuste.tipo, 'S')
        self.assertEqual(movimiento_salida_ajuste.motivo, 'salida_ajuste')

    def test_movimiento_inventario_traslado_salida_crear(self):
        from ..services import movimiento_inventario_traslado_salida_crear
        movimiento_salida_ajuste = movimiento_inventario_traslado_salida_crear(
            bodega_origen_id=self.bodega.id,
            usuario_id=self.usuario.id,
            detalle='el texto'
        )
        self.assertEqual(movimiento_salida_ajuste.tipo, 'S')
        self.assertEqual(movimiento_salida_ajuste.motivo, 'traslado')

    def test_movimiento_inventario_salida_aplicar_movimiento(self):
        self.assertTrue(self.movimiento_venta.cargado)
        [self.assertTrue(x.es_ultimo_saldo) for x in self.movimiento_venta.detalles.all()]
        [self.assertFalse(x.es_ultimo_saldo) for x in self.movimiento_compra.detalles.all()]
        self.mv_venta_uno_uno.refresh_from_db()
        self.assertEqual(self.mv_venta_uno_uno.saldo_cantidad, 20 - 5)
        self.assertEqual(self.mv_venta_uno_uno.saldo_costo, 10000 - ((10000 / 20) * 5))
        self.assertEqual(self.mv_venta_uno_uno.sale_costo, ((10000 / 20) * 5))
        self.assertEqual(self.mv_venta_uno_uno.costo_unitario, (10000 / 20))
        self.assertEqual(self.mv_venta_uno_uno.costo_unitario_promedio, (10000 / 20))

    def test_movimiento_inventario_salida_sin_existencia(self):
        from ..services import (
            movimiento_inventario_aplicar_movimiento,
            movimiento_inventario_venta_crear,
            movimiento_inventario_detalle_salida_add_item
        )
        self.movimiento_venta_no_existia = movimiento_inventario_venta_crear(
            bodega_origen_id=self.bodega.id,
            usuario_id=self.usuario.id
        )
        self.mvd_venta_no_existia = movimiento_inventario_detalle_salida_add_item(
            movimiento_id=self.movimiento_venta_no_existia.id,
            producto_id=self.producto_tres.id,
            cantidad=5
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No hay existencias de"
        ):
            movimiento_inventario_aplicar_movimiento(self.movimiento_venta_no_existia.id)

        self.movimiento_venta_sin_existencia = movimiento_inventario_venta_crear(
            bodega_origen_id=self.bodega.id,
            usuario_id=self.usuario.id
        )
        self.mvd_venta_sin_existencia = movimiento_inventario_detalle_salida_add_item(
            movimiento_id=self.movimiento_venta_sin_existencia.id,
            producto_id=self.producto_dos.id,
            cantidad=100
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No hay suficientes existencias de"
        ):
            movimiento_inventario_aplicar_movimiento(self.movimiento_venta_sin_existencia.id)

    def test_movimiento_inventario_add_detalle_tipo_salida_en_movimiento_entrada(self):
        from ..services import movimiento_inventario_devolucion_crear, movimiento_inventario_detalle_salida_add_item
        movimiento_venta = movimiento_inventario_devolucion_crear(
            bodega_destino_id=self.bodega.id,
            usuario_id=self.usuario.id
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No se puede agregar un detalle tipo salida en un movimiento tipo entrada'}"
        ):
            movimiento_inventario_detalle_salida_add_item(
                movimiento_id=movimiento_venta.id,
                producto_id=self.producto_uno.id,
                cantidad=0,
            )


class TrasladoServicesTests(TestCase):
    def setUp(self):
        from productos.factories import ProductoFactory
        from usuarios.factories import UserFactory
        from ..services import (
            movimiento_inventario_detalle_entrada_add_item,
            movimiento_inventario_saldo_inicial_crear,
            movimiento_inventario_aplicar_movimiento
        )
        from ..factories import TrasladoFactory, BodegaFactory
        from terceros.factories import ColaboradorFactory
        from terceros.services import (
            tercero_set_new_pin,
            tercero_registra_entrada
        )
        from usuarios.services import usuario_login
        from puntos_venta.factories import PuntoVentaFactory

        # Primer colaborador presente
        self.punto_venta_abierto = PuntoVentaFactory(
            usuario_actual=None,
            abierto=False
        )
        self.colaborador_presente = ColaboradorFactory()
        tercero_set_new_pin(
            tercero_id=self.colaborador_presente.id,
            raw_pin='0000'
        )
        tercero_registra_entrada(
            self.colaborador_presente.id,
            raw_pin='0000'
        )
        self.colaborador_presente.usuario.set_password('otro')
        self.colaborador_presente.usuario.save()
        usuario_login(
            usuario_id=self.colaborador_presente.usuario.id,
            punto_venta_id=self.punto_venta_abierto.id
        )
        self.punto_venta_abierto.refresh_from_db()
        self.bodega_punto_venta_abierto = self.punto_venta_abierto.bodega
        self.bodega_punto_venta_abierto.es_principal = False
        self.bodega_punto_venta_abierto.save()
        self.colaborador_presente.refresh_from_db()

        # Segundo colaborador presente
        self.punto_venta_abierto_dos = PuntoVentaFactory(
            usuario_actual=None,
            abierto=False
        )
        self.colaborador_presente_dos = ColaboradorFactory()
        tercero_set_new_pin(
            tercero_id=self.colaborador_presente_dos.id,
            raw_pin='0000'
        )
        tercero_registra_entrada(
            self.colaborador_presente_dos.id,
            raw_pin='0000'
        )
        self.colaborador_presente_dos.usuario.set_password('otro')
        self.colaborador_presente_dos.usuario.save()
        usuario_login(
            usuario_id=self.colaborador_presente_dos.usuario.id,
            punto_venta_id=self.punto_venta_abierto_dos.id
        )
        self.punto_venta_abierto_dos.refresh_from_db()
        self.bodega_punto_venta_abierto_dos = self.punto_venta_abierto_dos.bodega
        self.bodega_punto_venta_abierto_dos.es_principal = False
        self.bodega_punto_venta_abierto_dos.save()
        self.colaborador_presente_dos.refresh_from_db()

        # Colaborador no presente
        self.colaborador_no_presente = ColaboradorFactory()

        self.usuario = UserFactory()

        self.traslado = TrasladoFactory()

        self.producto_uno = ProductoFactory()
        self.producto_dos = ProductoFactory()
        self.producto_tres = ProductoFactory()
        self.producto_cuatro = ProductoFactory()

        self.bodega_inventario = BodegaFactory(es_principal=True)
        self.bodega_destino = BodegaFactory(es_principal=False)

        self.movimiento_saldo_inicial = movimiento_inventario_saldo_inicial_crear(
            bodega_destino_id=self.bodega_inventario.id,
            usuario_id=self.usuario.id,
            fecha=timezone.now()
        )

        self.mv_uno_detalle_uno = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=self.movimiento_saldo_inicial.id,
            producto_id=self.producto_uno.id,
            cantidad=20,
            costo_total=10000
        )
        self.mv_uno_detalle_dos = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=self.movimiento_saldo_inicial.id,
            producto_id=self.producto_dos.id,
            cantidad=30,
            costo_total=40000
        )
        self.mv_uno_detalle_tres = movimiento_inventario_detalle_entrada_add_item(
            movimiento_id=self.movimiento_saldo_inicial.id,
            producto_id=self.producto_tres.id,
            cantidad=40,
            costo_total=90000
        )
        movimiento_inventario_aplicar_movimiento(self.movimiento_saldo_inicial.id)

    def test_crear_traslado_origen_bodega_principal_destino_bodega_principal(self):
        from ..factories import BodegaFactory
        from ..services import traslado_inventario_crear
        self.bodega_inventario.es_principal = True
        self.bodega_inventario.save()
        bodega_inventario_principal_dos = BodegaFactory(es_principal=True)
        traslado = traslado_inventario_crear(
            bodega_origen_id=self.bodega_inventario.id,
            bodega_destino_id=bodega_inventario_principal_dos.id,
            usuario_crea_id=self.usuario.id
        )
        self.assertTrue(traslado.estado == 0)
        self.assertFalse(traslado.trasladado)
        self.assertEqual(traslado.bodega_origen_id, self.bodega_inventario.id)
        self.assertEqual(traslado.bodega_destino.id, bodega_inventario_principal_dos.id)
        self.assertEqual(traslado.creado_por.id, self.usuario.id)

    def test_crear_traslado_origen_bodega_principal_destino_bodega_no_principal(self):
        from ..services import traslado_inventario_crear
        traslado = traslado_inventario_crear(
            bodega_origen_id=self.bodega_inventario.id,
            bodega_destino_id=self.bodega_punto_venta_abierto.id,
            usuario_crea_id=self.usuario.id
        )
        self.assertTrue(traslado.estado == 0)
        self.assertFalse(traslado.trasladado)
        self.assertEqual(traslado.bodega_origen_id, self.bodega_inventario.id)
        self.assertEqual(traslado.bodega_destino.id, self.bodega_punto_venta_abierto.id)
        self.assertEqual(traslado.creado_por.id, self.usuario.id)

    def test_crear_traslado_origen_bodega_no_principal_destino_bodega_no_principal(self):
        from ..services import traslado_inventario_crear
        traslado = traslado_inventario_crear(
            bodega_origen_id=self.bodega_punto_venta_abierto_dos.id,
            bodega_destino_id=self.bodega_punto_venta_abierto.id,
            usuario_crea_id=self.colaborador_presente_dos.usuario.id
        )
        self.assertTrue(traslado.estado == 0)
        self.assertFalse(traslado.trasladado)
        self.assertEqual(traslado.bodega_origen_id, self.bodega_punto_venta_abierto_dos.id)
        self.assertEqual(traslado.bodega_destino.id, self.bodega_punto_venta_abierto.id)
        self.assertEqual(traslado.creado_por.id, self.colaborador_presente_dos.usuario.id)

    def test_crear_traslado_a_destino_bodega_no_principal_solo_pdv_destino_abierto(self):
        from ..services import traslado_inventario_crear
        self.punto_venta_abierto.abierto = False
        self.punto_venta_abierto.save()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Para realizar traslado a una bodega que no es principal, debe de haber alguien en el para recibirlo. Actualmente no hay nadie'}"
        ):
            traslado_inventario_crear(
                bodega_origen_id=self.bodega_inventario.id,
                bodega_destino_id=self.bodega_punto_venta_abierto.id,
                usuario_crea_id=self.usuario.id
            )
        self.punto_venta_abierto.abierto = True
        self.punto_venta_abierto.usuario_actual = None
        self.punto_venta_abierto.save()

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Para realizar traslado a una bodega que no es principal, debe de haber alguien en el para recibirlo. Actualmente no hay nadie'}"
        ):
            traslado_inventario_crear(
                bodega_origen_id=self.bodega_inventario.id,
                bodega_destino_id=self.bodega_punto_venta_abierto.id,
                usuario_crea_id=self.usuario.id
            )

    def test_crear_traslado_origen_bodega_no_principal_solo_pdv_origen_abierto(self):
        from ..services import traslado_inventario_crear
        self.punto_venta_abierto_dos.abierto = False
        self.punto_venta_abierto_dos.save()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Para realizar traslado desde una bodega que no es principal, debe de haber alguien en el punto de venta para crearlo. Actualmente no hay nadie'}"
        ):
            traslado_inventario_crear(
                bodega_origen_id=self.bodega_punto_venta_abierto_dos.id,
                bodega_destino_id=self.bodega_punto_venta_abierto.id,
                usuario_crea_id=self.colaborador_presente_dos.usuario.id
            )

        self.punto_venta_abierto_dos.abierto = True
        self.punto_venta_abierto_dos.save()

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Sólo el usuario de la bodega origen puede crear un traslado desde su lugar'}"
        ):
            traslado_inventario_crear(
                bodega_origen_id=self.bodega_punto_venta_abierto_dos.id,
                bodega_destino_id=self.bodega_punto_venta_abierto.id,
                usuario_crea_id=self.colaborador_presente.usuario.id
            )

        self.punto_venta_abierto_dos.usuario_actual = None
        self.punto_venta_abierto_dos.save()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Para realizar traslado desde una bodega que no es principal, debe de haber alguien en el punto de venta para crearlo. Actualmente no hay nadie'}"
        ):
            traslado_inventario_crear(
                bodega_origen_id=self.bodega_punto_venta_abierto_dos.id,
                bodega_destino_id=self.bodega_punto_venta_abierto.id,
                usuario_crea_id=self.colaborador_presente_dos.usuario.id
            )

    def test_traslado_inventario_adicionar_item(self):
        from ..services import traslado_inventario_crear, traslado_inventario_adicionar_item
        traslado = traslado_inventario_crear(
            bodega_origen_id=self.bodega_inventario.id,
            bodega_destino_id=self.bodega_punto_venta_abierto.id,
            usuario_crea_id=self.usuario.id
        )
        traslado_inventario_adicionar_item(
            traslado_inventario_id=traslado.id,
            producto_id=self.producto_uno.id,
            cantidad=10
        )
        traslado_inventario_adicionar_item(
            traslado_inventario_id=traslado.id,
            producto_id=self.producto_dos.id,
            cantidad=5
        )
        traslado_inventario_adicionar_item(
            traslado_inventario_id=traslado.id,
            producto_id=self.producto_tres.id,
            cantidad=15
        )
        self.assertTrue(traslado.detalles.filter(producto=self.producto_uno).exists())
        self.assertTrue(traslado.detalles.filter(producto=self.producto_uno).first().cantidad == 10)
        self.assertTrue(traslado.detalles.filter(producto=self.producto_dos).exists())
        self.assertTrue(traslado.detalles.filter(producto=self.producto_dos).first().cantidad == 5)
        self.assertTrue(traslado.detalles.filter(producto=self.producto_tres).exists())
        self.assertTrue(traslado.detalles.filter(producto=self.producto_tres).first().cantidad == 15)
        self.assertFalse(traslado.detalles.filter(producto=self.producto_cuatro).exists())

    def test_traslado_inventario_adicionar_item_sin_nunca_existencia(self):
        from ..services import traslado_inventario_crear, traslado_inventario_adicionar_item
        traslado = traslado_inventario_crear(
            bodega_origen_id=self.bodega_inventario.id,
            bodega_destino_id=self.bodega_punto_venta_abierto.id,
            usuario_crea_id=self.usuario.id
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No hay existencias de producto"
        ):
            traslado_inventario_adicionar_item(
                traslado_inventario_id=traslado.id,
                producto_id=self.producto_cuatro.id,
                cantidad=10
            )

    def test_traslado_inventario_adicionar_item_cantidad_mayor_a_existencia(self):
        from ..services import traslado_inventario_crear, traslado_inventario_adicionar_item
        traslado = traslado_inventario_crear(
            bodega_origen_id=self.bodega_inventario.id,
            bodega_destino_id=self.bodega_punto_venta_abierto.id,
            usuario_crea_id=self.usuario.id
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No hay existencias suficientes del producto seleccionado. Solo hay"
        ):
            traslado_inventario_adicionar_item(
                traslado_inventario_id=traslado.id,
                producto_id=self.producto_dos.id,
                cantidad=200
            )

    def test_traslado_inventario_adicionar_item_repitiendo_item(self):
        from ..services import traslado_inventario_crear, traslado_inventario_adicionar_item
        traslado = traslado_inventario_crear(
            bodega_origen_id=self.bodega_inventario.id,
            bodega_destino_id=self.bodega_punto_venta_abierto.id,
            usuario_crea_id=self.usuario.id
        )
        traslado_inventario_adicionar_item(
            traslado_inventario_id=traslado.id,
            producto_id=self.producto_dos.id,
            cantidad=1
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No puede tener 2 productos del mismo tipo en un traslado, por favor deje solo una linea de traslado por el producto"
        ):
            traslado_inventario_adicionar_item(
                traslado_inventario_id=traslado.id,
                producto_id=self.producto_dos.id,
                cantidad=1
            )

    def test_traslado_inventario_realizar_traslado(self):
        from ..services import (
            traslado_inventario_crear,
            traslado_inventario_adicionar_item,
            traslado_inventario_realizar_traslado
        )
        from ..models import MovimientoInventarioDetalle

        traslado = traslado_inventario_crear(
            bodega_origen_id=self.bodega_inventario.id,
            bodega_destino_id=self.bodega_punto_venta_abierto.id,
            usuario_crea_id=self.usuario.id
        )
        self.assertTrue(traslado.estado == 0)
        traslado_inventario_adicionar_item(
            traslado_inventario_id=traslado.id,
            producto_id=self.producto_uno.id,
            cantidad=1
        )
        traslado_inventario_adicionar_item(
            traslado_inventario_id=traslado.id,
            producto_id=self.producto_dos.id,
            cantidad=2
        )
        traslado_inventario_adicionar_item(
            traslado_inventario_id=traslado.id,
            producto_id=self.producto_tres.id,
            cantidad=3
        )

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El traslado a esta bodega sólamente puede realizarlo"
        ):
            traslado_inventario_realizar_traslado(
                traslado_inventario_id=traslado.id,
                usuario_id=self.usuario.id
            )

        traslado_inventario_realizar_traslado(
            traslado_inventario_id=traslado.id,
            usuario_id=self.punto_venta_abierto.usuario_actual.id
        )
        traslado.refresh_from_db()
        self.assertTrue(traslado.estado == 3)
        self.assertTrue(traslado.recibido_por.id == self.punto_venta_abierto.usuario_actual.id)
        self.assertTrue(traslado.movimiento_origen.cargado)
        self.assertTrue(traslado.movimiento_destino.cargado)
        [self.assertTrue(x.es_ultimo_saldo) for x in traslado.movimiento_origen.detalles.all()]
        [self.assertTrue(x.es_ultimo_saldo) for x in traslado.movimiento_destino.detalles.all()]

        movimientos_iniciales_producto_uno = MovimientoInventarioDetalle.objects.filter(
            producto_id=self.producto_uno.id).exclude(
            movimiento_id__in=[traslado.movimiento_origen_id, traslado.movimiento_destino_id])
        [self.assertFalse(x.es_ultimo_saldo) for x in movimientos_iniciales_producto_uno.all()]

        movimientos_iniciales_producto_dos = MovimientoInventarioDetalle.objects.filter(
            producto_id=self.producto_dos.id).exclude(
            movimiento_id__in=[traslado.movimiento_origen_id, traslado.movimiento_destino_id])
        [self.assertFalse(x.es_ultimo_saldo) for x in movimientos_iniciales_producto_dos.all()]

        movimientos_iniciales_producto_tres = MovimientoInventarioDetalle.objects.filter(
            producto_id=self.producto_tres.id).exclude(
            movimiento_id__in=[traslado.movimiento_origen_id, traslado.movimiento_destino_id])
        [self.assertFalse(x.es_ultimo_saldo) for x in movimientos_iniciales_producto_tres.all()]

        md_detalle_producto_uno = traslado.movimiento_destino.detalles.filter(producto=self.producto_uno).first()
        self.assertTrue(md_detalle_producto_uno.saldo_cantidad == 1)
        self.assertTrue(int(md_detalle_producto_uno.entra_cantidad) == 1)
        self.assertTrue(int(md_detalle_producto_uno.costo_unitario) == 500)
        self.assertTrue(int(md_detalle_producto_uno.saldo_costo) == 500)
        self.assertTrue(int(md_detalle_producto_uno.costo_unitario_promedio) == 500)

        md_detalle_producto_dos = traslado.movimiento_destino.detalles.filter(producto=self.producto_dos).first()
        self.assertTrue(md_detalle_producto_dos.saldo_cantidad == 2)
        self.assertTrue(int(md_detalle_producto_dos.entra_cantidad) == 2)
        self.assertTrue(int(md_detalle_producto_dos.costo_unitario) == int(40000 / 30))
        self.assertTrue(int(md_detalle_producto_dos.saldo_costo) == int(40000 / 30) * 2)
        self.assertTrue(int(md_detalle_producto_dos.costo_unitario_promedio) == int(40000 / 30))

        md_detalle_producto_tres = traslado.movimiento_destino.detalles.filter(producto=self.producto_tres).first()
        self.assertTrue(md_detalle_producto_tres.saldo_cantidad == 3)
        self.assertTrue(int(md_detalle_producto_tres.entra_cantidad) == 3)
        self.assertTrue(int(md_detalle_producto_tres.costo_unitario) == int(90000 / 40))
        self.assertTrue(int(md_detalle_producto_tres.saldo_costo) == int(90000 / 40) * 3)
        self.assertTrue(int(md_detalle_producto_tres.costo_unitario_promedio) == int(90000 / 40))

    def test_traslado_inventario_set_estado_esperando_traslado(self):
        from ..services import (
            traslado_inventario_crear,
            traslado_inventario_adicionar_item,
            traslado_inventario_set_estado_esperando_traslado
        )

        traslado = traslado_inventario_crear(
            bodega_origen_id=self.bodega_inventario.id,
            bodega_destino_id=self.bodega_punto_venta_abierto.id,
            usuario_crea_id=self.usuario.id
        )
        self.assertTrue(traslado.estado == 0)
        traslado_inventario_adicionar_item(
            traslado_inventario_id=traslado.id,
            producto_id=self.producto_uno.id,
            cantidad=1
        )
        traslado_inventario_adicionar_item(
            traslado_inventario_id=traslado.id,
            producto_id=self.producto_dos.id,
            cantidad=2
        )
        traslado_inventario_adicionar_item(
            traslado_inventario_id=traslado.id,
            producto_id=self.producto_tres.id,
            cantidad=3
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Sólo el usuario que creo el traslado puede solicitar que se realice traslado'}"
        ):
            traslado_inventario_set_estado_esperando_traslado(
                traslado_inventario_id=traslado.id,
                usuario_id=self.punto_venta_abierto.usuario_actual.id
            )
        traslado = traslado_inventario_set_estado_esperando_traslado(
            traslado_inventario_id=traslado.id,
            usuario_id=self.usuario.id
        )
        self.assertTrue(traslado.estado == 2)
