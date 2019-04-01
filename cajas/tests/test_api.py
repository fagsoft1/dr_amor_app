from ..models import OperacionCaja
from dr_amor_app.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class OperacionCajaTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import OperacionCajaFactory, ConceptoOperacionCajaFactory
        from terceros.factories import ColaboradorFactory
        from puntos_venta.factories import PuntoVentaFactory
        from terceros.services import tercero_registra_entrada, tercero_set_new_pin
        from puntos_venta.services import punto_venta_abrir
        super().setUp()
        self.Factory = OperacionCajaFactory
        self.url = '/api/operaciones_caja/'
        self.permiso = 'operacioncaja'
        self.modelo = OperacionCaja
        self.data_for_create_test = self.Factory.stub().__dict__
        self.colaborador = ColaboradorFactory(usuario=self.user)
        tercero_set_new_pin(self.colaborador.id, '0000')
        tercero_registra_entrada(self.colaborador.id, '0000')
        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)
        punto_venta_abrir(self.colaborador.usuario.id, self.punto_venta.id)

        concepto = ConceptoOperacionCajaFactory(
            tipo='I',
            grupo='C'
        )
        self.data_for_create_test['tercero'] = self.colaborador.id
        self.data_for_create_test['concepto'] = concepto.id
        self.data_for_create_test['cuenta'] = self.colaborador.cuenta_abierta.id
        self.data_for_update_test = {'observacion': 'probando'}

    def test_ingreso_no_autorizado(self):
        self.ingreso_no_autorizado()

    def test_crear(self):
        self.crear()

    def test_delete(self):
        self.delete()

    def test_list(self):
        self.list()
