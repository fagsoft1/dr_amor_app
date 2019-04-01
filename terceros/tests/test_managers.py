from django.db.models import Q
from django.test import TestCase

from dr_amor_app.utilities_tests.test_base import BaseTest
from usuarios.factories import UserFactory
from ..models import Tercero, Cuenta
from ..factories import (
    AcompananteFactory,
    CategoriaAcompananteFactory,
    ColaboradorFactory,
    ProveedorFactory
)
from faker import Faker

faker = Faker()


class ManagerCuentaTests(BaseTest):
    def setUp(self):
        self.colaboradoresSetUp()
        self.acompanantesSetUp()
        self.ventasProductosInventarioInicialSetUp()
        self.habitacionesSetUp()

    def test_cuentas_colaboradores(self):
        qs_cuenta = Cuenta.cuentas_colaboradores.filter(propietario__tercero__id=self.colaborador_dos.id)
        venta, informacion = self.hacer_venta_productos_dos(
            cliente=self.colaborador_dos,
            punto_venta=self.punto_venta,
            nro_referencias=3
        )
        valor_compra_productos = informacion['valor_venta']
        cuenta = qs_cuenta.sin_liquidar().first()
        self.assertEqual(valor_compra_productos, cuenta.egreso_por_compras_productos)

        valor_ingresos, valor_egresos = self.hacer_operaciones_caja_dos(self.colaborador_dos, 5)
        cuenta = qs_cuenta.sin_liquidar().first()

        self.assertEqual(valor_ingresos, cuenta.ingresos_por_operaciones_caja)
        self.assertEqual(valor_egresos, cuenta.egresos_por_operaciones_caja)

        self.assertEqual(valor_ingresos, cuenta.total_ingresos)
        self.assertEqual(valor_egresos + valor_compra_productos, cuenta.total_egresos)

        cuenta.liquidada = True
        cuenta.save()

        # Con los siguientes probamos que no afecte los totales
        self.hacer_operaciones_caja_dos(self.acompanante, 1)
        self.hacer_operaciones_caja_dos(self.colaborador_mesero, 1)
        self.hacer_operaciones_caja_dos(self.colaborador_mesero_dos, 1)
        self.hacer_venta_productos_dos(
            cliente=self.acompanante,
            punto_venta=self.punto_venta,
            nro_referencias=1
        )
        self.hacer_venta_productos_dos(
            cliente=self.colaborador_mesero,
            punto_venta=self.punto_venta,
            nro_referencias=1
        )
        self.hacer_venta_productos_dos(
            cliente=self.colaborador_mesero_dos,
            punto_venta=self.punto_venta,
            nro_referencias=1
        )

        valor_ingresos2, valor_egresos2 = self.hacer_operaciones_caja_dos(self.colaborador_dos, 5)
        cuenta2 = qs_cuenta.sin_liquidar().first()
        self.assertEqual(valor_ingresos2, cuenta2.ingresos_por_operaciones_caja)
        self.assertEqual(valor_egresos2, cuenta2.egresos_por_operaciones_caja)
        self.assertEqual(valor_ingresos2, cuenta2.total_ingresos)
        self.assertEqual(valor_egresos2, cuenta2.total_egresos)

        cuenta = qs_cuenta.liquidada().last()
        self.assertEqual(valor_compra_productos, cuenta.egreso_por_compras_productos)
        self.assertEqual(valor_ingresos, cuenta.ingresos_por_operaciones_caja)
        self.assertEqual(valor_egresos, cuenta.egresos_por_operaciones_caja)
        self.assertEqual(valor_ingresos, cuenta.total_ingresos)
        self.assertEqual(valor_egresos + valor_compra_productos, cuenta.total_egresos)

    def test_cuentas_acompanantes(self):
        qs_cuenta = Cuenta.cuentas_acompanantes.filter(propietario__tercero__id=self.acompanante.id)
        valores_servicios_totales = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            acompanante_dos=self.acompanante_dos,
            punto_venta=self.punto_venta,
            comision=1000,
            terminados=True,
            iniciados=True,
            nro_servicios=5
        )

        cuenta = qs_cuenta.sin_liquidar().first()

        ingresos_por_comisiones = valores_servicios_totales['acompanante_1']['comision']
        ingresos_por_servicios = valores_servicios_totales['acompanante_1']['valor_servicio']

        self.assertEqual(ingresos_por_servicios, cuenta.ingreso_por_servicios)
        self.assertEqual(ingresos_por_comisiones, cuenta.ingreso_por_comisiones_habitacion)

        venta, informacion = self.hacer_venta_productos_dos(
            cliente=self.acompanante,
            punto_venta=self.punto_venta,
            nro_referencias=3
        )
        valor_compra_productos = informacion['valor_venta']

        cuenta = qs_cuenta.sin_liquidar().first()
        self.assertEqual(valor_compra_productos, cuenta.egreso_por_compras_productos)

        valor_ingresos, valor_egresos = self.hacer_operaciones_caja_dos(self.acompanante, 5)
        cuenta = qs_cuenta.sin_liquidar().first()

        self.assertEqual(valor_ingresos, cuenta.ingresos_por_operaciones_caja)
        self.assertEqual(valor_egresos, cuenta.egresos_por_operaciones_caja)

        self.assertEqual(valor_ingresos + ingresos_por_comisiones + ingresos_por_servicios, cuenta.total_ingresos)
        self.assertEqual(valor_egresos + valor_compra_productos, cuenta.total_egresos)

        cuenta.liquidada = True
        cuenta.save()

        # Con los siguientes probamos que no afecte los totales
        self.hacer_operaciones_caja_dos(self.acompanante_dos, 1)
        self.hacer_operaciones_caja_dos(self.colaborador_mesero, 1)
        self.hacer_operaciones_caja_dos(self.colaborador_mesero_dos, 1)
        self.hacer_venta_productos_dos(
            cliente=self.acompanante_dos,
            punto_venta=self.punto_venta,
            nro_referencias=1
        )
        self.hacer_venta_productos_dos(
            cliente=self.colaborador_mesero,
            punto_venta=self.punto_venta,
            nro_referencias=1
        )
        self.hacer_venta_productos_dos(
            cliente=self.colaborador_mesero_dos,
            punto_venta=self.punto_venta,
            nro_referencias=1
        )
        self.hacer_servicios_dos(
            acompanante=self.acompanante_dos,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            comision=1000,
            terminados=True,
            iniciados=True,
            nro_servicios=5
        )

        valor_ingresos2, valor_egresos2 = self.hacer_operaciones_caja_dos(self.acompanante, 5)
        cuenta2 = qs_cuenta.sin_liquidar().first()
        self.assertEqual(valor_ingresos2, cuenta2.ingresos_por_operaciones_caja)
        self.assertEqual(valor_egresos2, cuenta2.egresos_por_operaciones_caja)
        self.assertEqual(valor_ingresos2, cuenta2.total_ingresos)
        self.assertEqual(valor_egresos2, cuenta2.total_egresos)

        cuenta = qs_cuenta.liquidada().last()
        self.assertEqual(valor_compra_productos, cuenta.egreso_por_compras_productos)
        self.assertEqual(valor_ingresos, cuenta.ingresos_por_operaciones_caja)
        self.assertEqual(valor_egresos, cuenta.egresos_por_operaciones_caja)
        self.assertEqual(valor_ingresos + ingresos_por_comisiones + ingresos_por_servicios, cuenta.total_ingresos)
        self.assertEqual(valor_egresos + valor_compra_productos, cuenta.total_egresos)

    def test_cuentas_meseros(self):
        qs_cuenta = Cuenta.cuentas_meseros.filter(propietario__tercero__id=self.colaborador_mesero.id)
        valor_venta, informacion = self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=5,
            mesero=self.colaborador_mesero
        )
        valor_compra_productos = informacion['valor_venta']
        cuenta = qs_cuenta.sin_liquidar().first()
        self.assertEqual(valor_compra_productos, cuenta.valor_ventas_productos)
        valor_venta, informacion = self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=5,
            mesero=self.colaborador_mesero
        )
        valor_compra_productos += informacion['valor_venta']
        cuenta = qs_cuenta.sin_liquidar().first()
        self.assertEqual(valor_compra_productos, cuenta.valor_ventas_productos)

        cuenta.liquidada = True
        cuenta.save()

        # Valida que otro mesero no modifique los resultados
        self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=7,
            mesero=self.colaborador_mesero_dos
        )

        venta2, informacion2 = self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=5,
            mesero=self.colaborador_mesero
        )
        valor_compra_productos2 = informacion2['valor_venta']

        cuenta = qs_cuenta.liquidada().first()
        self.assertEqual(valor_compra_productos, cuenta.valor_ventas_productos)

        cuenta = qs_cuenta.sin_liquidar().first()
        self.assertEqual(valor_compra_productos2, cuenta.valor_ventas_productos)


class ManagerAcompananteTests(TestCase):
    def setUp(self):
        self.usuario = UserFactory()
        self.categoria_modelo = CategoriaAcompananteFactory()

    def test_acompanantes_queryset(self):
        AcompananteFactory()
        AcompananteFactory()
        ColaboradorFactory()
        count = Tercero.acompanantes.count()
        count2 = Tercero.objects.filter(es_acompanante=True).count()
        self.assertEqual(count, count2)

    def test_acompanantes_queryset_presentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory()
        AcompananteFactory(presente=True)
        AcompananteFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory()
        count = Tercero.acompanantes.presentes().count()
        count2 = Tercero.objects.filter(Q(es_acompanante=True) & Q(presente=True)).count()
        self.assertEqual(count, count2)

    def test_acompanantes_queryset_ausentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory(presente=True)
        AcompananteFactory(presente=False)
        AcompananteFactory(presente=False)
        AcompananteFactory(presente=False)
        ColaboradorFactory(presente=False)
        ColaboradorFactory(presente=True)
        count = Tercero.acompanantes.ausentes().count()
        count2 = Tercero.objects.filter(Q(es_acompanante=True) & Q(presente=False)).count()
        self.assertEqual(count, count2)


class ManagerColaboradorTests(TestCase):
    def setUp(self):
        self.usuario = UserFactory()
        self.categoria_modelo = CategoriaAcompananteFactory()

    def test_colaboradores_queryset(self):
        AcompananteFactory()
        AcompananteFactory()
        ColaboradorFactory()
        count = Tercero.colaboradores.count()
        count2 = Tercero.objects.filter(es_colaborador=True).count()
        self.assertEqual(count, count2)

    def test_colaboradores_queryset_ausentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        ColaboradorFactory(presente=True)
        AcompananteFactory(presente=False)
        ColaboradorFactory(presente=False)
        AcompananteFactory(presente=False)
        ColaboradorFactory(presente=False)
        ColaboradorFactory(presente=True)
        count = Tercero.colaboradores.ausentes().count()
        count2 = Tercero.objects.filter(Q(es_colaborador=True) & Q(presente=False)).count()
        self.assertEqual(count, count2)
        self.assertEqual(count, count2)

    def test_colaboradores_queryset_presentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory()
        AcompananteFactory(presente=False)
        AcompananteFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=False)
        count = Tercero.colaboradores.presentes().count()
        count2 = Tercero.objects.filter(Q(es_colaborador=True) & Q(presente=True)).count()
        self.assertEqual(count, count2)


class ManagerProveedorTests(TestCase):
    def setUp(self):
        self.usuario = UserFactory()
        self.categoria_modelo = CategoriaAcompananteFactory()

    def test_proveedores_queryset(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory()
        ColaboradorFactory()
        count = Tercero.proveedores.count()
        count2 = Tercero.objects.filter(es_proveedor=True).count()
        self.assertEqual(count, count2)


class ManagerInternosTests(TestCase):
    def setUp(self):
        self.usuario = UserFactory()
        self.categoria_modelo = CategoriaAcompananteFactory()

    def test_internos_queryset(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory()
        ColaboradorFactory()
        count = Tercero.internos.count()
        count2 = Tercero.objects.filter(
            Q(es_acompanante=True) |
            Q(es_colaborador=True)
        ).count()
        self.assertEqual(count, count2)

    def test_internos_queryset_presentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory()
        AcompananteFactory(presente=True)
        AcompananteFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory()
        ColaboradorFactory()
        count = Tercero.internos.presentes().count()
        count2 = Tercero.objects.filter(
            (
                    Q(es_acompanante=True) |
                    Q(es_colaborador=True)
            )
            & Q(presente=True)
        ).count()
        self.assertEqual(count, count2)

    def test_internos_queryset_ausentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory(presente=True)
        AcompananteFactory(presente=False)
        AcompananteFactory(presente=False)
        ColaboradorFactory(presente=False)
        ColaboradorFactory(presente=False)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=True)
        count = Tercero.internos.ausentes().count()
        count2 = Tercero.objects.filter(
            (
                    Q(es_acompanante=True) |
                    Q(es_colaborador=True)
            )
            & Q(presente=False)
        ).count()
        self.assertEqual(count, count2)

    def test_internos_queryset_ausentes_activos(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory(presente=True)
        AcompananteFactory(presente=False)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=False)

        interno1 = AcompananteFactory(presente=False)
        usuario1 = interno1.usuario
        usuario1.is_active = False
        usuario1.save()

        interno2 = ColaboradorFactory(presente=False)
        usuario2 = interno2.usuario
        usuario2.is_active = False
        usuario2.save()

        ColaboradorFactory(presente=True)
        count = Tercero.internos.ausentes().activos().count()
        count2 = Tercero.objects.filter(
            (
                    Q(es_acompanante=True) |
                    Q(es_colaborador=True)
            )
            &
            (
                    Q(presente=False)
                    &
                    Q(usuario__is_active=True)
            )
        ).count()
        self.assertEqual(count, count2)
