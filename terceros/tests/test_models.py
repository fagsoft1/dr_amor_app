from rest_framework.exceptions import ValidationError
from dr_amor_app.utilities_tests.test_base import BaseTest
from ..factories import CuentaColaboradorFactory

from faker import Faker

faker = Faker()


class TerceroTest(BaseTest):
    def setUp(self):
        self.colaboradoresSetUp()
        self.acompanantesSetUp()

    def test_tercero_full_name_proxy_acompanante(self):
        full_name_proxy = self.acompanante.full_name_proxy
        self.assertTrue(self.acompanante.es_acompanante)
        self.assertEqual(full_name_proxy, self.acompanante.alias_modelo)
        self.assertTrue(self.acompanante.nombre not in full_name_proxy)
        self.assertTrue(self.acompanante.apellido not in full_name_proxy)

    def test_tercero_full_name_proxy_colaborador(self):
        full_name_proxy = self.colaborador_dos.full_name_proxy
        self.assertTrue(self.colaborador_dos.nombre in full_name_proxy)
        self.assertTrue(self.colaborador_dos.apellido in full_name_proxy)
        self.assertTrue(self.colaborador_dos.es_colaborador)

    def test_propiedad_full_name_acompanante(self):
        self.assertTrue(self.acompanante_base['nombre'] in self.acompanante.full_name)
        self.assertTrue(self.acompanante_base['apellido'] in self.acompanante.full_name)

    def test_propiedad_identidad_acompanante(self):
        self.assertTrue(self.acompanante_base['nro_identificacion'] in self.acompanante.identificacion)

    def test_propiedad_full_name_colaborador(self):
        full_name = self.colaborador_dos.full_name
        self.assertTrue(self.colaborador_dos.nombre in full_name)
        self.assertTrue(self.colaborador_dos.apellido in full_name)

    def test_propiedad_identificacion_colaborador(self):
        identificacion = self.colaborador_dos.identificacion
        self.assertTrue(self.colaborador_dos_base['nro_identificacion'] in identificacion)
        self.assertTrue(self.colaborador_dos_base['tipo_documento'] in identificacion)

    def test_propiedad_cuenta_abierta_tipo_1_no_liquidada(self):
        cuenta_abierta_1 = self.colaborador_dos.cuenta_abierta
        self.assertFalse(cuenta_abierta_1.liquidada)
        self.assertTrue(cuenta_abierta_1.tipo == 1)

    def test_propiedad_cuenta_abierta_solo_una_cuando_se_vuelve_a_llamar(self):
        cuenta_abierta_1 = self.colaborador_dos.cuenta_abierta
        cuenta_abierta_2 = self.colaborador_dos.cuenta_abierta
        self.assertEqual(cuenta_abierta_1.id, cuenta_abierta_2.id)

    def test_propiedad_cuenta_abierta_crea_nueva_cuando_se_ha_cerrado(self):
        cuenta_abierta_1 = self.colaborador_dos.cuenta_abierta
        cuenta_abierta_1.liquidada = True
        cuenta_abierta_1.save()
        cuenta_abierta_2 = self.colaborador_dos.cuenta_abierta
        self.assertNotEqual(cuenta_abierta_1.id, cuenta_abierta_2.id)

    def test_propiedad_cuenta_abierta_solo_una(self):
        cuenta_abierta = self.colaborador_dos.cuenta_abierta
        CuentaColaboradorFactory(propietario=self.colaborador_dos.usuario, tipo=1, liquidada=False)
        with self.assertRaisesMessage(
                ValidationError,
                'Sólo debe de haber 1 o 0 cuentas de tipo 1 no liquidada. Hay'
        ):
            cuenta_fallo = self.colaborador_dos.cuenta_abierta

    def test_propiedad_ultima_cuenta_liquidada_tipo_1_liquidada(self):
        cuenta_abierta = self.colaborador_dos.cuenta_abierta
        cuenta_abierta.liquidada = True
        cuenta_abierta.save()
        ultima_cuenta = self.colaborador_dos.ultima_cuenta_liquidada
        self.assertTrue(ultima_cuenta.tipo == 1)
        self.assertTrue(ultima_cuenta.liquidada)

    def test_propiedad_ultima_cuenta_liquidada_trae_la_ultima(self):
        cuenta_abierta = self.colaborador_dos.cuenta_abierta
        cuenta_abierta.liquidada = True
        cuenta_abierta.save()
        cuenta_abierta2 = self.colaborador_dos.cuenta_abierta
        cuenta_abierta2.liquidada = True
        cuenta_abierta2.save()
        cuenta_abierta3 = self.colaborador_dos.cuenta_abierta
        cuenta_abierta3.liquidada = True
        cuenta_abierta3.save()
        ultima_cuenta = self.colaborador_dos.ultima_cuenta_liquidada
        self.assertEqual(cuenta_abierta3.id, ultima_cuenta.id)

    def test_propiedad_cuenta_abierta_mesero_solo_colaboradores(self):
        with self.assertRaisesMessage(
                ValidationError,
                'Las cuentas abiertas de mesero solo pueden ser para colaboradores'
        ):
            self.acompanante.cuenta_abierta_mesero

    def test_propiedad_cuenta_abierta_mesero_tipo_1_no_liquidada(self):
        cuenta_abierta_1 = self.colaborador_dos.cuenta_abierta_mesero
        self.assertFalse(cuenta_abierta_1.liquidada)
        self.assertTrue(cuenta_abierta_1.tipo == 2)

    def test_propiedad_cuenta_abierta_mesero_solo_una_cuando_se_vuelve_a_llamar(self):
        cuenta_abierta_1 = self.colaborador_dos.cuenta_abierta_mesero
        cuenta_abierta_2 = self.colaborador_dos.cuenta_abierta_mesero
        self.assertEqual(cuenta_abierta_1.id, cuenta_abierta_2.id)

    def test_propiedad_cuenta_abierta_mesero_crea_nueva_cuando_se_ha_cerrado(self):
        cuenta_abierta_1 = self.colaborador_dos.cuenta_abierta_mesero
        cuenta_abierta_1.liquidada = True
        cuenta_abierta_1.save()
        cuenta_abierta_2 = self.colaborador_dos.cuenta_abierta_mesero
        self.assertNotEqual(cuenta_abierta_1.id, cuenta_abierta_2.id)

    def test_propiedad_cuenta_abierta_mesero_solo_una(self):
        cuenta_abierta = self.colaborador_dos.cuenta_abierta_mesero
        CuentaColaboradorFactory(propietario=self.colaborador_dos.usuario, tipo=2, liquidada=False)
        with self.assertRaisesMessage(
                ValidationError,
                'Sólo debe de haber 1 o 0 cuentas mesero de tipo 2 no liquidada. Hay'
        ):
            cuenta_fallo = self.colaborador_dos.cuenta_abierta_mesero

    def test_propiedad_ultima_cuenta_mesero_liquidada_tipo_2_solo_colaborador(self):
        with self.assertRaisesMessage(
                ValidationError,
                'Las cuentas liquidadas de mesero solo pueden ser para colaboradores'
        ):
            cuenta_abierta = self.acompanante.ultima_cuenta_mesero_liquidada

    def test_propiedad_ultima_cuenta_mesero_liquidada_tipo_2_liquidada(self):
        cuenta_abierta = self.colaborador_dos.cuenta_abierta_mesero
        cuenta_abierta.liquidada = True
        cuenta_abierta.save()
        ultima_cuenta = self.colaborador_dos.ultima_cuenta_mesero_liquidada
        self.assertTrue(ultima_cuenta.tipo == 2)
        self.assertTrue(ultima_cuenta.liquidada)

    def test_propiedad_ultima_cuenta_mesero_liquidada_trae_la_ultima(self):
        cuenta_abierta = self.colaborador_dos.cuenta_abierta_mesero
        cuenta_abierta.liquidada = True
        cuenta_abierta.save()
        cuenta_abierta2 = self.colaborador_dos.cuenta_abierta_mesero
        cuenta_abierta2.liquidada = True
        cuenta_abierta2.save()
        cuenta_abierta3 = self.colaborador_dos.cuenta_abierta_mesero
        cuenta_abierta3.liquidada = True
        cuenta_abierta3.save()
        ultima_cuenta = self.colaborador_dos.ultima_cuenta_mesero_liquidada
        self.assertEqual(cuenta_abierta3.id, ultima_cuenta.id)

    def test_propiedad_turno_punto_venta_abierto_sin_fecha_final(self):
        turno_punto_venta = self.colaborador_cajero.turno_punto_venta_abierto
        self.assertIsNone(turno_punto_venta.finish)

    def test_propiedad_turno_punto_venta_abierto_solo_colaboradores(self):
        with self.assertRaisesMessage(
                ValidationError,
                'Los turnos de punto de venta solo pueden existir para colaboradores'
        ):
            turno_punto_venta = self.acompanante.turno_punto_venta_abierto

    def test_propiedad_turno_punto_venta_abierto_solo_una(self):
        from puntos_venta.factories import PuntoVentaTurnoFactory
        PuntoVentaTurnoFactory(usuario=self.colaborador_cajero.usuario, finish=None)
        with self.assertRaisesMessage(
                ValidationError,
                'Sólo debe de haber 1 o 0 turnos abiertos en punto de venta. Hay'
        ):
            turno_punto_venta = self.colaborador_cajero.turno_punto_venta_abierto

    def test_propiedad_turno_punto_venta_abierto_none_si_no_hay(self):
        turno_punto_venta = self.colaborador_dos.turno_punto_venta_abierto
        self.assertIsNone(turno_punto_venta)
