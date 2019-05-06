from dr_amor_app.utilities_tests.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class PuntoVentaTestApi(BaseTestsApi):
    def setUp(self):
        super().setUp()
        self.acompanantesSetUp()
        self.url = '/api/categorias_fracciones_tiempo_acompanante/'

    def test_listar_x_categoria(self):
        response = self.list_route_get('listar_x_categoria/?categoria_id=%s' % self.categoria_modelo.id)
        for i in response.data:
            for x in i.items():
                if x[0] == 'categoria':
                    self.assertEqual(x[1], self.categoria_modelo.id)
