from ..models import Producto, CategoriaProducto, UnidadProducto, CategoriaDosProducto
from dr_amor_app.utilities_tests.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class UnidadProductoTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import UnidadProductoFactory
        super().setUp()
        self.Factory = UnidadProductoFactory
        self.url = '/api/productos_unidades/'
        self.permiso = 'unidadproducto'
        self.modelo = UnidadProducto
        self.data_for_create_test = self.Factory.stub().__dict__
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


class CategoriaTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import CategoriaFactory
        super().setUp()
        self.Factory = CategoriaFactory
        self.url = '/api/productos_categorias/'
        self.permiso = 'categoriaproducto'
        self.modelo = CategoriaProducto
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_update_test = {'codigo': 'JJ'}

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


class CategoriaDosTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import CategoriaDosFactory, CategoriaFactory
        super().setUp()
        self.Factory = CategoriaDosFactory
        categoria = CategoriaFactory()
        self.url = '/api/productos_categorias_dos/'
        self.permiso = 'categoriadosproducto'
        self.modelo = CategoriaDosProducto
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['categoria'] = categoria.id
        self.data_for_update_test = {'codigo': 'NN'}

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


class ProductosTestsApi(BaseTestsApi):
    def setUp(self):
        from empresas.factories import EmpresaFactory
        from ..factories import UnidadProductoFactory, ProductoFactory, CategoriaDosFactory
        super().setUp()
        self.Factory = ProductoFactory
        self.url = '/api/productos/'
        self.permiso = 'producto'
        self.modelo = Producto
        categoria_dos = CategoriaDosFactory()
        unidad_producto = UnidadProductoFactory()
        empresa = EmpresaFactory()
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['categoria_dos'] = categoria_dos.id
        self.data_for_create_test['unidad_producto'] = unidad_producto.id
        self.data_for_create_test['empresa'] = empresa.id
        self.data_for_update_test = {'nombre': 'cosita'}

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
