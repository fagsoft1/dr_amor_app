from django.db.models import Q
from django.test import TestCase

from ..models import MovimientoInventario
from ..factories import (
    MovimientoInventarioFactory
)
from faker import Faker

faker = Faker()


class ManageMovimientoInventarioComprasTests(TestCase):
    def test_movimiento_inventario_compras_queryset_solo_motivo_compra(self):
        count_uno = MovimientoInventario.compras.count()
        MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='ajuste_ingreso')
        MovimientoInventarioFactory(motivo='ajuste_salida')
        count_solo_compra = MovimientoInventario.objects.filter(motivo='compra').count()
        self.assertEqual(count_solo_compra, count_uno + 3)
        count_manager_compra = MovimientoInventario.compras.count()
        self.assertEqual(count_solo_compra, count_manager_compra)

    def test_movimiento_inventario_compras_queryset_sin_cargar(self):
        MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='compra', cargado=True)
        MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='ajuste_ingreso')
        MovimientoInventarioFactory(motivo='ajuste_salida')
        count_dos = MovimientoInventario.compras.sin_cargar().count()
        count_dos_qs = MovimientoInventario.objects.filter(motivo='compra', cargado=False).count()
        self.assertEqual(count_dos_qs, count_dos)

    def test_movimiento_inventario_compras_queryset_cargado(self):
        movimiento_uno = MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='compra')
        movimiento_tres = MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='ajuste_ingreso')
        MovimientoInventarioFactory(motivo='ajuste_salida')
        movimiento_uno.cargado = True
        movimiento_uno.save()
        movimiento_tres.cargado = True
        movimiento_tres.save()
        count_dos = MovimientoInventario.compras.cargados().count()
        count_dos_qs = MovimientoInventario.objects.filter(motivo='compra', cargado=True).count()
        self.assertEqual(count_dos_qs, count_dos)


class ManageMovimientoInventarioSaldosInicialesTests(TestCase):
    def test_movimiento_inventario_saldo_inicial_queryset_solo_motivo_saldo_inicial(self):
        count_uno = MovimientoInventario.compras.count()
        MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='ajuste_ingreso')
        MovimientoInventarioFactory(motivo='ajuste_salida')
        count_solo_saldo_inicial = MovimientoInventario.objects.filter(motivo='saldo_inicial').count()
        self.assertEqual(count_solo_saldo_inicial, count_uno + 3)
        count_manager_saldo_inicial = MovimientoInventario.saldos_iniciales.count()
        self.assertEqual(count_solo_saldo_inicial, count_manager_saldo_inicial)

    def test_movimiento_inventario_saldo_inicial_queryset_sin_cargar(self):
        MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='saldo_inicial', cargado=True)
        MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='ajuste_ingreso')
        MovimientoInventarioFactory(motivo='ajuste_salida')
        count_dos = MovimientoInventario.saldos_iniciales.sin_cargar().count()
        count_dos_qs = MovimientoInventario.objects.filter(motivo='saldo_inicial', cargado=False).count()
        self.assertEqual(count_dos_qs, count_dos)

    def test_movimiento_inventario_saldo_inicial_queryset_cargado(self):
        movimiento_uno = MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        movimiento_tres = MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='ajuste_ingreso')
        MovimientoInventarioFactory(motivo='ajuste_salida')
        movimiento_uno.cargado = True
        movimiento_uno.save()
        movimiento_tres.cargado = True
        movimiento_tres.save()
        count_dos = MovimientoInventario.saldos_iniciales.cargados().count()
        count_dos_qs = MovimientoInventario.objects.filter(motivo='saldo_inicial', cargado=True).count()
        self.assertEqual(count_dos_qs, count_dos)


class ManageMovimientoInventarioAjustesTests(TestCase):
    def test_movimiento_inventario_saldo_inicial_queryset_solo_motivo_compra(self):
        count_uno = MovimientoInventario.compras.count()
        MovimientoInventarioFactory(motivo='ajuste_ingreso')
        MovimientoInventarioFactory(motivo='ajuste_salida')
        MovimientoInventarioFactory(motivo='ajuste_ingreso')
        MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        count_solo_ajustes = MovimientoInventario.objects.filter(
            Q(motivo='ajuste_ingreso') |
            Q(motivo='ajuste_salida')
        ).count()
        self.assertEqual(count_solo_ajustes, count_uno + 3)
        count_manager_ajustes = MovimientoInventario.ajustes.count()
        self.assertEqual(count_solo_ajustes, count_manager_ajustes)

    def test_movimiento_inventario_saldo_inicial_queryset_sin_cargar(self):
        MovimientoInventarioFactory(motivo='ajuste_ingreso')
        MovimientoInventarioFactory(motivo='ajuste_salida')
        MovimientoInventarioFactory(motivo='ajuste_ingreso', cargado=False)
        MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        count_dos = MovimientoInventario.ajustes.sin_cargar().count()
        count_dos_qs = MovimientoInventario.objects.filter(
            Q(motivo='ajuste_ingreso') |
            Q(motivo='ajuste_salida') &
            Q(cargado=False)
        ).count()
        self.assertEqual(count_dos_qs, count_dos)

    def test_movimiento_inventario_saldo_inicial_queryset_cargado(self):
        movimiento_uno = MovimientoInventarioFactory(motivo='ajuste_ingreso')
        MovimientoInventarioFactory(motivo='ajuste_salida')
        movimiento_tres = MovimientoInventarioFactory(motivo='ajuste_ingreso')
        MovimientoInventarioFactory(motivo='compra')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        MovimientoInventarioFactory(motivo='saldo_inicial')
        movimiento_uno.cargado = True
        movimiento_uno.save()
        movimiento_tres.cargado = True
        movimiento_tres.save()
        count_dos = MovimientoInventario.ajustes.cargados().count()
        count_dos_qs = MovimientoInventario.objects.filter(
            Q(motivo='ajuste_ingreso') |
            Q(motivo='ajuste_salida') &
            Q(cargado=True)
        ).count()
        self.assertEqual(count_dos_qs, count_dos)
