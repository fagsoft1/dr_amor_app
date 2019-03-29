from productos.api_views import UnidadProductoViewSet
from ..models import TipoVehiculo, Vehiculo
from dr_amor_app.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class TipoVehiculoTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import TipoVehiculoFactory
        from empresas.factories import EmpresaFactory
        super().setUp()
        self.empresa = EmpresaFactory()
        self.Factory = TipoVehiculoFactory
        self.url = '/api/parqueadero_tipos_vehiculos/'
        self.permiso = 'tipovehiculo'
        self.modelo = TipoVehiculo
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['empresa'] = self.empresa.id
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


class VehiculoTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import TipoVehiculoFactory
        from empresas.factories import EmpresaFactory
        super().setUp()
        self.empresa = EmpresaFactory()
        self.Factory = TipoVehiculoFactory
        self.url = '/api/parqueadero_vehiculos/'
        self.permiso = 'vehiculo'
        self.modelo = TipoVehiculo
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['empresa'] = self.empresa.id
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
