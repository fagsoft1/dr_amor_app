from django.test import TestCase
from faker import Faker
from rest_framework.exceptions import ValidationError

from dr_amor_app.utilities_tests.test_base import BaseTest

faker = Faker()


class PuntoVentaTests(BaseTest):
    def setUp(self):
        self.acompanantesSetUp()
        self.colaboradoresSetUp()
        self.habitacionesSetUp()
        self.usuariosSetUp()

    def cerrar_punto_venta(self):
        from ..services import punto_venta_cerrar
        punto_venta_cerrar(
            usuario_pv_id=self.colaborador_cajero.usuario.id,
            valor_dinero_efectivo=0,
            valor_tarjeta=0,
            nro_vauchers=0
        )

    # region Abrir Punto Venta
    def test_punto_venta_abrir(self):
        from ..services import punto_venta_abrir
        self.cerrar_punto_venta()
        punto_venta, punto_venta_turno = punto_venta_abrir(
            usuario_pv_id=self.colaborador_cajero.usuario.id,
            punto_venta_id=self.punto_venta.id,
            base_inicial_efectivo=500000,
            saldo_cierre_caja_anterior=300000
        )
        transacciones_caja_base_inicial = punto_venta_turno.transacciones_caja.filter(
            tipo_dos='BASE_INI_CAJA'
        ).first()
        transacciones_caja_saldo_cierre_anterior = punto_venta_turno.transacciones_caja.filter(
            tipo_dos='SALDO_CIERRE_ANTERIOR_CAJA'
        ).first()

        self.assertEqual(transacciones_caja_base_inicial.valor_efectivo, 500000)
        self.assertEqual(transacciones_caja_base_inicial.tipo, 'I')
        self.assertEqual(transacciones_caja_saldo_cierre_anterior.valor_efectivo, 300000)
        self.assertEqual(transacciones_caja_saldo_cierre_anterior.tipo, 'I')

        self.assertTrue(punto_venta.abierto)
        self.assertEqual(punto_venta_turno.punto_venta, punto_venta)
        self.colaborador_cajero.refresh_from_db()
        self.assertEqual(self.colaborador_cajero.turno_punto_venta_abierto, punto_venta_turno)
        self.assertIsNone(punto_venta_turno.finish)
        self.assertEqual(punto_venta.usuario_actual.id, self.colaborador_cajero.usuario_id)

    def test_punto_venta_abrir_solo_punto_venta_cerrados(self):
        from ..services import punto_venta_abrir
        self.punto_venta.abierto = True
        self.punto_venta.save()
        with self.assertRaisesMessage(
                ValidationError,
                'Este punto de venta ya esta abierto'
        ):
            punto_venta_abrir(
                usuario_pv_id=self.colaborador_dos.usuario.id,
                punto_venta_id=self.punto_venta.id,
                base_inicial_efectivo=0,
                saldo_cierre_caja_anterior=0
            )

    def test_punto_venta_abrir_solo_para_usuarios_con_tercero(self):
        from ..services import punto_venta_abrir
        self.cerrar_punto_venta()
        with self.assertRaisesMessage(
                ValidationError,
                'No se puede abrir un punto de venta a un usuario sin tercero'
        ):
            punto_venta_abrir(
                usuario_pv_id=self.usuario_sin_tercero.id,
                punto_venta_id=self.punto_venta.id,
                base_inicial_efectivo=0,
                saldo_cierre_caja_anterior=0
            )

    def test_punto_venta_abrir_solo_para_colaborador_presente(self):
        from ..services import punto_venta_abrir
        self.cerrar_punto_venta()
        self.colaborador_cajero.presente = False
        self.colaborador_cajero.save()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No se puede abrir un punto de venta a un colaborador que no este presente'}"
        ):
            punto_venta_abrir(
                usuario_pv_id=self.colaborador_cajero.usuario.id,
                punto_venta_id=self.punto_venta.id,
                base_inicial_efectivo=0,
                saldo_cierre_caja_anterior=0
            )

    def test_punto_venta_abrir_solo_para_colaboradores(self):
        from ..services import punto_venta_abrir
        self.cerrar_punto_venta()
        with self.assertRaisesMessage(
                ValidationError,
                'No se puede abrir un punto de venta a alguien que no sea colaborador'
        ):
            punto_venta_abrir(
                usuario_pv_id=self.acompanante.usuario.id,
                punto_venta_id=self.punto_venta.id,
                base_inicial_efectivo=0,
                saldo_cierre_caja_anterior=0
            )

    def test_punto_venta_abrir_solo_sin_turno_abierto(self):
        from ..services import punto_venta_abrir
        with self.assertRaisesMessage(
                ValidationError,
                'Este usuario ya tiene un turno abierto y debe cerrarlo primero antes de abrir otro turno. El turno esta abierto en el punto'
        ):
            punto_venta_abrir(
                usuario_pv_id=self.colaborador_cajero.usuario.id,
                punto_venta_id=self.punto_venta_dos.id,
                base_inicial_efectivo=0,
                saldo_cierre_caja_anterior=0
            )

    # endregion

    # regio Cerrar Punto de Venta

    def test_punto_venta_cerrar(self):
        from ..services import punto_venta_cerrar, punto_venta_abrir

        operaciones = self.hacer_movimiento_para_punto_venta_abierto(
            punto_venta=self.punto_venta
        )
        print(operaciones)

        print('Total ingreso esperado %s' % operaciones['ingresos']['totales'])
        print('Total egreso esperado %s' % operaciones['egresos']['totales'])

        punto_venta = punto_venta_cerrar(
            usuario_pv_id=self.punto_venta.usuario_actual.id,
            valor_tarjeta=0,
            valor_dinero_efectivo=0,
            nro_vauchers=0
        )
        self.assertFalse(punto_venta.abierto)
        self.assertIsNone(punto_venta.usuario_actual)
        self.assertIsNone(self.colaborador_cajero.turno_punto_venta_abierto)

    def test_punto_venta_cerrar_usuario_con_tercero(self):
        from ..services import punto_venta_cerrar
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El usuario no tiene un tercero relacionado, por ende, no tiene ningún punto de venta que cerrar'}"
        ):
            usuario = self.acompanante.usuario
            self.acompanante.usuario = None
            self.acompanante.save()
            punto_venta_cerrar(
                usuario_pv_id=usuario.id,
                valor_tarjeta=0,
                valor_dinero_efectivo=0,
                nro_vauchers=0
            )

    def test_punto_venta_cerrar_solo_con_puntos_venta_abiertos(self):
        from ..services import punto_venta_cerrar
        self.cerrar_punto_venta()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Este tercero no posee ningún punto de venta abierto actualmente'}"
        ):
            punto_venta_cerrar(
                usuario_pv_id=self.colaborador_cajero.usuario.id,
                valor_tarjeta=0,
                valor_dinero_efectivo=0,
                nro_vauchers=0
            )

    # endregion
