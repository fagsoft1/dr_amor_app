from ..models import Habitacion, TipoHabitacion
from dr_amor_app.utilities_tests.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class TipoHabitacionTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import TipoHabitacionFactory
        super().setUp()
        self.Factory = TipoHabitacionFactory
        self.url = '/api/habitaciones_tipos/'
        self.permiso = 'tipohabitacion'
        self.modelo = TipoHabitacion
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_update_test = {'nombre': 'probando', 'valor': 1000}

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


class HabitacionTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import HabitacionFactory
        from ..factories import TipoHabitacionFactory
        from empresas.factories import EmpresaFactory
        super().setUp()
        self.Factory = HabitacionFactory
        self.url = '/api/habitaciones/'
        self.permiso = 'habitacion'
        tipo_habitacion = TipoHabitacionFactory()
        empresa = EmpresaFactory()
        self.modelo = Habitacion
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['tipo'] = tipo_habitacion.id
        self.data_for_create_test['empresa'] = empresa.id
        self.data_for_update_test = {'numero': 33}

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

    def test_cambiar_estado(self):
        self.crear()
        habitacion = Habitacion.objects.first()
        habitacion.estado = 2
        habitacion.save()
        response = self.detail_route_post(
            'cambiar_estado',
            {'estado': 0, 'cosa': 'fabio'},
            habitacion.id
        )
        result = response.data.get('result')
        self.assertTrue('Se han cambiado el estado para la habitacion' in result)
