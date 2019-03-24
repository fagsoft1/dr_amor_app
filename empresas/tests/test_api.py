from empresas.models import Empresa
from dr_amor_app.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class EmpresaTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import EmpresaFactory
        super().setUp()
        self.Factory = EmpresaFactory
        self.url = '/api/empresas/'
        self.permiso = 'empresa'
        self.modelo = Empresa
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_update_test = {'nombre': 'jaajja', 'nit': 'fasdf'}

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
