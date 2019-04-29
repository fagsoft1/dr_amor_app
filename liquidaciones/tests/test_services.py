import sys

from faker import Faker
from rest_framework.exceptions import ValidationError

from dr_amor_app.utilities_tests.test_base import BaseTest
from terceros.models import Cuenta

faker = Faker()


class LiquidacionServicesTests(BaseTest):
    def setUp(self):
        self.habitacionesSetUp()
        self.colaboradoresSetUp()
        self.acompanantesSetUp()
        self.ventasProductosInventarioInicialSetUp()

    # region Liquidaciones Meseros
    def test_liquidar_cuenta_mesero_solo_presentes(self):
        from ..services import liquidar_cuenta_mesero

        self.colaborador_mesero.presente = False
        self.colaborador_mesero.save()

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Sólo se puede liquidar una cuenta mesero a colaborador presente'}"
        ):
            liquidar_cuenta_mesero(
                colaborador_id=self.colaborador_mesero.id,
                punto_venta_turno_id=self.punto_venta_turno.id,
                valor_tarjetas=2000,
                valor_efectivo=5000,
                nro_vauchers=10
            )

    def test_liquidar_cuenta_mesero_solo_colaboradores(self):
        from ..services import liquidar_cuenta_mesero
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Sólo se puede liquidar una cuenta mesero a alguien que sea un colaborador'}"
        ):
            liquidar_cuenta_mesero(
                colaborador_id=self.acompanante.id,
                punto_venta_turno_id=self.punto_venta_turno.id,
                valor_tarjetas=2000,
                valor_efectivo=5000,
                nro_vauchers=10
            )

    def test_liquidar_cuenta_mesero_solo_con_transacciones(self):
        from ..services import liquidar_cuenta_mesero
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No hay nada que deba pagar este mesero'}"
        ):
            liquidar_cuenta_mesero(
                colaborador_id=self.colaborador_mesero.id,
                punto_venta_turno_id=self.punto_venta_turno.id,
                valor_tarjetas=2000,
                valor_efectivo=5000,
                nro_vauchers=10
            )

    def test_liquidar_cuenta_mesero(self):
        from ..services import liquidar_cuenta_mesero, liquidar_cuenta_mesero_generar_comprobante
        venta, informacion = self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=5,
            mesero=self.colaborador_mesero
        )
        valor_compra_productos = informacion['valor_venta']
        liquidacion_cuenta_uno = liquidar_cuenta_mesero(
            colaborador_id=self.colaborador_mesero.id,
            punto_venta_turno_id=self.punto_venta_turno.id,
            valor_tarjetas=valor_compra_productos / 2,
            valor_efectivo=valor_compra_productos / 2,
            nro_vauchers=10
        )
        if 'test' not in sys.argv and 'test_coverage' not in sys.argv:
            comprobante = liquidar_cuenta_mesero_generar_comprobante(
                liquidacion_id=liquidacion_cuenta_uno.id
            )
            comprobante.write_pdf(
                target='media/pruebas_pdf/liquidacion_mesero_comprobante_1.pdf'
            )

        self.assertEqual(liquidacion_cuenta_uno.saldo_anterior, 0)
        self.assertEqual(liquidacion_cuenta_uno.saldo, 0)
        self.assertEqual(liquidacion_cuenta_uno.a_cobrar_a_tercero, valor_compra_productos)
        self.assertEqual(liquidacion_cuenta_uno.pagado, valor_compra_productos)
        self.assertEqual(liquidacion_cuenta_uno.efectivo, valor_compra_productos / 2)
        self.assertEqual(liquidacion_cuenta_uno.tarjeta_o_transferencia, valor_compra_productos / 2)
        self.assertEqual(self.colaborador_mesero.ultima_cuenta_mesero_liquidada, liquidacion_cuenta_uno.cuenta)

        # comprueba con otro mesero que no modifique los resultados

        self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=6,
            mesero=self.colaborador_mesero_dos
        )
        liquidar_cuenta_mesero(
            colaborador_id=self.colaborador_mesero_dos.id,
            punto_venta_turno_id=self.punto_venta_turno.id,
            valor_tarjetas=valor_compra_productos / 2,
            valor_efectivo=valor_compra_productos / 2,
            nro_vauchers=10
        )

        venta, informacion = self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=5,
            mesero=self.colaborador_mesero
        )

        valor_compra_productos_dos = informacion['valor_venta']
        valor_a_entregar_dos = valor_compra_productos_dos / 2
        saldo_dos = valor_compra_productos_dos - valor_a_entregar_dos

        liquidacion_cuenta_dos = liquidar_cuenta_mesero(
            colaborador_id=self.colaborador_mesero.id,
            punto_venta_turno_id=self.punto_venta_turno.id,
            valor_tarjetas=valor_a_entregar_dos / 2,
            valor_efectivo=valor_a_entregar_dos / 2,
            nro_vauchers=10
        )
        if 'test' not in sys.argv and 'test_coverage' not in sys.argv:
            comprobante = liquidar_cuenta_mesero_generar_comprobante(
                liquidacion_id=liquidacion_cuenta_dos.id
            )
            comprobante.write_pdf(
                target='media/pruebas_pdf/liquidacion_mesero_comprobante_2.pdf'
            )

        self.assertEqual(liquidacion_cuenta_dos.saldo_anterior, 0)
        self.assertEqual(int(liquidacion_cuenta_dos.saldo), int(saldo_dos))
        self.assertEqual(liquidacion_cuenta_dos.a_cobrar_a_tercero, valor_compra_productos_dos)
        self.assertEqual(int(liquidacion_cuenta_dos.pagado), int(valor_a_entregar_dos))
        self.assertEqual(int(liquidacion_cuenta_dos.efectivo), int(valor_a_entregar_dos / 2))
        self.assertEqual(int(liquidacion_cuenta_dos.tarjeta_o_transferencia), int(valor_a_entregar_dos / 2))
        self.assertEqual(self.colaborador_mesero.ultima_cuenta_mesero_liquidada, liquidacion_cuenta_dos.cuenta)

        self.assertEqual(
            int(self.colaborador_mesero.ultima_cuenta_mesero_liquidada.liquidacion.saldo),
            int(saldo_dos)
        )

        venta, informacion = self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=2,
            mesero=self.colaborador_mesero
        )
        valor_compra_productos_tres = informacion['valor_venta']
        liquidacion_cuenta_tres = liquidar_cuenta_mesero(
            colaborador_id=self.colaborador_mesero.id,
            punto_venta_turno_id=self.punto_venta_turno.id,
            valor_tarjetas=int(liquidacion_cuenta_dos.saldo),
            valor_efectivo=int(valor_compra_productos_tres) + 1000,
            nro_vauchers=10
        )
        if 'test' not in sys.argv and 'test_coverage' not in sys.argv:
            comprobante = liquidar_cuenta_mesero_generar_comprobante(
                liquidacion_id=liquidacion_cuenta_tres.id
            )
            comprobante.write_pdf(
                target='media/pruebas_pdf/liquidacion_mesero_comprobante_3.pdf'
            )
        self.assertEqual(int(liquidacion_cuenta_tres.saldo_anterior), int(saldo_dos))
        self.assertEqual(int(liquidacion_cuenta_tres.saldo), -1000)

    # endregion

    # region Liquidaciones Acompañantes
    def test_liquidar_cuenta_acompanante_solo_presentes(self):
        from ..services import liquidar_cuenta_acompanante

        self.acompanante.presente = False
        self.acompanante.save()

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Sólo se puede liquidar cuenta a una acompanante presente'}"
        ):
            liquidar_cuenta_acompanante(
                punto_venta_turno_id=self.punto_venta_turno.id,
                valor_efectivo=70000,
                acompanante_id=self.acompanante.id,
                valor_transferencia=100000
            )

    def test_liquidar_cuenta_acompanante_solo_acompanante(self):
        from ..services import liquidar_cuenta_acompanante
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Sólo se puede liquidar una cuenta a un tercero que sea acompanante'}"
        ):
            liquidar_cuenta_acompanante(
                punto_venta_turno_id=self.punto_venta_turno.id,
                valor_efectivo=70000,
                acompanante_id=self.colaborador_dos.id,
                valor_transferencia=100000
            )

    def test_liquidar_cuenta_acompanante_solo_con_transacciones(self):
        from ..services import liquidar_cuenta_acompanante
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No hay nada para liquidar para acompañante'}"
        ):
            liquidar_cuenta_acompanante(
                punto_venta_turno_id=self.punto_venta_turno.id,
                valor_efectivo=70000,
                acompanante_id=self.acompanante.id,
                valor_transferencia=100000
            )

    def test_liquidar_cuenta_acompanante(self):
        from ..services import (
            liquidar_cuenta_acompanante,
            liquidar_cuenta_acompanante_generar_comprobante
        )
        qs_cuenta = Cuenta.cuentas_acompanantes.filter(propietario__tercero=self.acompanante)
        self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            acompanante_dos=self.acompanante,
            punto_venta=self.punto_venta,
            comision=1000,
            terminados=True,
            iniciados=True,
            nro_servicios=5
        )

        self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=1,
            cliente=self.acompanante
        )

        self.hacer_operaciones_caja_dos(
            tercero=self.acompanante,
            cantidad_operaciones=1
        )

        cuenta = qs_cuenta.sin_liquidar().first()
        ingresos_acompanante = cuenta.total_ingresos
        egresos_acompanante = cuenta.total_egresos

        valor_a_pagar_a_acompanante = ingresos_acompanante - egresos_acompanante

        liquidacion_cuenta_uno = liquidar_cuenta_acompanante(
            punto_venta_turno_id=self.punto_venta_turno.id,
            valor_efectivo=valor_a_pagar_a_acompanante,
            acompanante_id=self.acompanante.id
        )
        if 'test' not in sys.argv and 'test_coverage' not in sys.argv:
            comprobante = liquidar_cuenta_acompanante_generar_comprobante(
                liquidacion_id=liquidacion_cuenta_uno.id
            )

            comprobante.write_pdf(
                target='media/pruebas_pdf/liquidacion_acompanante_comprobante_1.pdf'
            )

        self.assertEqual(liquidacion_cuenta_uno.saldo_anterior, 0)
        self.assertEqual(liquidacion_cuenta_uno.saldo, 0)
        self.assertEqual(liquidacion_cuenta_uno.a_cobrar_a_tercero, egresos_acompanante)
        self.assertEqual(liquidacion_cuenta_uno.a_pagar_a_tercero, ingresos_acompanante)
        self.assertEqual(liquidacion_cuenta_uno.pagado, valor_a_pagar_a_acompanante)
        self.assertEqual(liquidacion_cuenta_uno.efectivo, valor_a_pagar_a_acompanante)
        self.assertEqual(self.acompanante.ultima_cuenta_liquidada, liquidacion_cuenta_uno.cuenta)

        self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            acompanante_dos=self.acompanante,
            punto_venta=self.punto_venta,
            comision=1000,
            terminados=True,
            iniciados=True,
            nro_servicios=8
        )

        self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=1,
            cliente=self.acompanante
        )

        self.hacer_operaciones_caja_dos(
            tercero=self.acompanante,
            cantidad_operaciones=1
        )

        # Comprueba que otra liquidación de acompañante no modifique el resutado

        self.hacer_operaciones_caja_dos(
            tercero=self.acompanante_dos,
            cantidad_operaciones=1
        )
        liquidar_cuenta_acompanante(
            punto_venta_turno_id=self.punto_venta_turno.id,
            valor_efectivo=1,
            acompanante_id=self.acompanante_dos.id
        )

        # ------------------

        cuenta = qs_cuenta.sin_liquidar().first()
        ingresos_acompanante = cuenta.total_ingresos
        egresos_acompanante = cuenta.total_egresos

        valor_a_pagar_a_acompanante = int((ingresos_acompanante - egresos_acompanante) / 3)
        valor_a_deber_a_acompanante_dos = ingresos_acompanante - egresos_acompanante - valor_a_pagar_a_acompanante

        liquidacion_cuenta_dos = liquidar_cuenta_acompanante(
            punto_venta_turno_id=self.punto_venta_turno.id,
            valor_efectivo=valor_a_pagar_a_acompanante,
            acompanante_id=self.acompanante.id
        )
        if 'test' not in sys.argv and 'test_coverage' not in sys.argv:
            comprobante = liquidar_cuenta_acompanante_generar_comprobante(
                liquidacion_id=liquidacion_cuenta_dos.id
            )

            comprobante.write_pdf(
                target='media/pruebas_pdf/liquidacion_acompanante_comprobante_2.pdf'
            )

        self.assertEqual(liquidacion_cuenta_dos.saldo, valor_a_deber_a_acompanante_dos)
        self.assertEqual(self.acompanante.ultima_cuenta_liquidada, liquidacion_cuenta_dos.cuenta)

        self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            acompanante_dos=self.acompanante,
            punto_venta=self.punto_venta,
            comision=1000,
            terminados=True,
            iniciados=True,
            nro_servicios=8
        )

        liquidacion_cuenta_tres = liquidar_cuenta_acompanante(
            punto_venta_turno_id=self.punto_venta_turno.id,
            valor_efectivo=100000,
            acompanante_id=self.acompanante.id
        )
        comprobante = liquidar_cuenta_acompanante_generar_comprobante(
            liquidacion_id=liquidacion_cuenta_tres.id
        )
        if 'test' not in sys.argv and 'test_coverage' not in sys.argv:
            comprobante.write_pdf(
                target='media/pruebas_pdf/liquidacion_acompanante_comprobante_3.pdf'
            )
            self.assertEqual(liquidacion_cuenta_tres.saldo_anterior, valor_a_deber_a_acompanante_dos)

    # endregion

    # region Liquidaciones Colaboradores

    def test_liquidar_cuenta_colaborador_solo_presentes(self):
        from ..services import liquidar_cuenta_colaborador

        self.colaborador_dos.presente = False
        self.colaborador_dos.save()

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Sólo se puede liquidar cuenta a un colaborador presente'}"
        ):
            liquidar_cuenta_colaborador(
                user_id=self.colaborador_cajero.id,
                colaborador_id=self.colaborador_dos.id,
                valor_cuadre_cierre_nomina=10000
            )

    def test_liquidar_cuenta_colaborador_solo_acompanante(self):
        from ..services import liquidar_cuenta_colaborador
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Sólo se puede liquidar una cuenta a un tercero que sea colaborador'}"
        ):
            liquidar_cuenta_colaborador(
                colaborador_id=self.acompanante.id,
                valor_cuadre_cierre_nomina=10000,
                user_id=self.colaborador_cajero.id
            )

    def test_liquidar_cuenta_colaborador_solo_con_transacciones(self):
        from ..services import liquidar_cuenta_colaborador
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No hay nada para liquidar para colaborador'}"
        ):
            liquidar_cuenta_colaborador(
                user_id=self.colaborador_cajero.id,
                colaborador_id=self.colaborador_dos.id,
                valor_cuadre_cierre_nomina=10000
            )

    def test_liquidar_cuenta_colaborador(self):
        from ..services import liquidar_cuenta_colaborador, liquidar_cuenta_colaborador_generar_comprobante
        qs_cuenta = Cuenta.cuentas_colaboradores.filter(propietario__tercero=self.colaborador_dos)

        self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=1,
            cliente=self.colaborador_dos
        )

        self.hacer_operaciones_caja_dos(
            tercero=self.colaborador_dos,
            cantidad_operaciones=1
        )

        cuenta = qs_cuenta.sin_liquidar().first()
        ingresos = cuenta.total_ingresos
        egresos = cuenta.total_egresos

        valor_a_tramitar = egresos - ingresos

        liquidacion_cuenta_uno = liquidar_cuenta_colaborador(
            user_id=self.colaborador_cajero.usuario.id,
            colaborador_id=self.colaborador_dos.id,
            valor_cuadre_cierre_nomina=valor_a_tramitar
        )
        if 'test' not in sys.argv and 'test_coverage' not in sys.argv:
            comprobante = liquidar_cuenta_colaborador_generar_comprobante(
                liquidacion_id=liquidacion_cuenta_uno.id
            )
            comprobante.write_pdf(
                target='media/pruebas_pdf/liquidacion_colaborador_comprobante_1.pdf'
            )

        self.assertEqual(liquidacion_cuenta_uno.saldo_anterior, 0)
        self.assertEqual(liquidacion_cuenta_uno.saldo, 0)
        self.assertEqual(liquidacion_cuenta_uno.a_cobrar_a_tercero, egresos)
        self.assertEqual(liquidacion_cuenta_uno.a_pagar_a_tercero, ingresos)
        self.assertEqual(liquidacion_cuenta_uno.pagado, valor_a_tramitar)
        self.assertEqual(liquidacion_cuenta_uno.efectivo, 0)
        self.assertEqual(liquidacion_cuenta_uno.tarjeta_o_transferencia, 0)
        self.assertEqual(self.colaborador_dos.ultima_cuenta_liquidada, liquidacion_cuenta_uno.cuenta)

        # Comprueba que otra liquidación de colaborador no modifique el resutado

        self.hacer_operaciones_caja_dos(
            tercero=self.colaborador_mesero,
            cantidad_operaciones=1
        )
        liquidar_cuenta_colaborador(
            user_id=self.colaborador_cajero.usuario.id,
            colaborador_id=self.colaborador_mesero.id,
            valor_cuadre_cierre_nomina=1
        )

        # ------------------

        self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=3,
            cliente=self.colaborador_dos
        )

        self.hacer_operaciones_caja_dos(
            tercero=self.colaborador_dos,
            cantidad_operaciones=1
        )

        cuenta = qs_cuenta.sin_liquidar().first()
        ingresos = cuenta.total_ingresos
        egresos = cuenta.total_egresos

        valor_a_tramitar_dos = int((egresos - ingresos) / 3)
        saldo_dos = egresos - ingresos - valor_a_tramitar_dos

        liquidacion_cuenta_dos = liquidar_cuenta_colaborador(
            user_id=self.colaborador_cajero.usuario.id,
            colaborador_id=self.colaborador_dos.id,
            valor_cuadre_cierre_nomina=valor_a_tramitar_dos
        )
        if 'test' not in sys.argv and 'test_coverage' not in sys.argv:
            comprobante = liquidar_cuenta_colaborador_generar_comprobante(
                liquidacion_id=liquidacion_cuenta_dos.id
            )
            comprobante.write_pdf(
                target='media/pruebas_pdf/liquidacion_colaborador_comprobante_2.pdf'
            )
        self.assertEqual(liquidacion_cuenta_dos.saldo, saldo_dos)
        self.assertEqual(self.colaborador_dos.ultima_cuenta_liquidada, liquidacion_cuenta_dos.cuenta)

        self.hacer_venta_productos_dos(
            punto_venta=self.punto_venta,
            nro_referencias=1,
            cliente=self.colaborador_dos
        )

        cuenta = qs_cuenta.sin_liquidar().first()
        ingresos = cuenta.total_ingresos
        egresos = cuenta.total_egresos

        valor_a_tramitar_tres = int(egresos - ingresos) + liquidacion_cuenta_dos.saldo

        liquidacion_cuenta_tres = liquidar_cuenta_colaborador(
            user_id=self.colaborador_cajero.usuario.id,
            colaborador_id=self.colaborador_dos.id,
            valor_cuadre_cierre_nomina=valor_a_tramitar_tres
        )
        if 'test' not in sys.argv and 'test_coverage' not in sys.argv:
            comprobante = liquidar_cuenta_colaborador_generar_comprobante(
                liquidacion_id=liquidacion_cuenta_tres.id
            )
            comprobante.write_pdf(
                target='media/pruebas_pdf/liquidacion_colaborador_comprobante_3.pdf'
            )

        self.assertEqual(liquidacion_cuenta_tres.saldo_anterior, saldo_dos)
        self.assertEqual(self.colaborador_dos.ultima_cuenta_liquidada, liquidacion_cuenta_tres.cuenta)

    # endregion
