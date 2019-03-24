from django.db import transaction
from django.db.utils import IntegrityError
from django.test import TestCase

from empresas.factories import EmpresaFactory
from ..factories import CategoriaDosFactory, CategoriaFactory, UnidadProductoFactory, ProductoFactory
from ..models import CategoriaProducto, CategoriaDosProducto, UnidadProducto, Producto

from faker import Faker

faker = Faker()


class ProductoTests(TestCase):
    def setUp(self):
        self.categoria_dos = CategoriaDosFactory()
        self.unidad_producto = UnidadProductoFactory()
        self.empresa = EmpresaFactory()

    def test_crear_producto(self):
        count = Producto.objects.count()
        producto = ProductoFactory()
        self.assertEqual(count + 1, Producto.objects.count())
        with self.assertRaisesMessage(
                IntegrityError,
                'duplicate key value violates unique constraint "productos_producto_nombre_key'
        ):
            ProductoFactory(nombre=producto.nombre)


class CategoriaTests(TestCase):
    def setUp(self):
        self.categoria = CategoriaFactory()

    def test_crear_categoria(self):
        count = CategoriaProducto.objects.count()
        with self.assertRaisesMessage(
                IntegrityError,
                'duplicate key value violates unique constraint "productos_categoriaproducto_nombre_key'
        ):
            with transaction.atomic():
                CategoriaFactory(nombre=self.categoria.nombre)
        with self.assertRaisesMessage(
                IntegrityError,
                'duplicate key value violates unique constraint "productos_categoriaproducto_codigo_key'
        ):
            with transaction.atomic():
                CategoriaFactory(codigo=self.categoria.codigo)
        CategoriaFactory()
        self.assertEqual(count + 1, CategoriaProducto.objects.count())


class CategoriaDosTests(TestCase):
    def setUp(self):
        self.categoria = CategoriaFactory()
        self.categoria_dos = CategoriaDosFactory()

    def test_crear_categoria_dos(self):
        count = CategoriaDosProducto.objects.count()
        with self.assertRaisesMessage(
                IntegrityError,
                'duplicate key value violates unique constraint "productos_categoriadosproducto_nombre_key'
        ):
            with transaction.atomic():
                CategoriaDosFactory(nombre=self.categoria_dos.nombre)
        with self.assertRaisesMessage(
                IntegrityError,
                'duplicate key value violates unique constraint "productos_categoriadosproducto_codigo_key'
        ):
            with transaction.atomic():
                CategoriaDosFactory(codigo=self.categoria_dos.codigo)
        CategoriaDosFactory()
        self.assertEqual(count + 1, CategoriaDosProducto.objects.count())


class UnidadProductoTests(TestCase):
    def setUp(self):
        self.unidad_producto = UnidadProductoFactory()

    def test_crear_unidad_producto(self):
        count = UnidadProducto.objects.count()
        with self.assertRaisesMessage(
                IntegrityError,
                'duplicate key value violates unique constraint "productos_unidadproducto_nombre_key'
        ):
            with transaction.atomic():
                UnidadProductoFactory(nombre=self.unidad_producto.nombre)
        UnidadProductoFactory()
        self.assertEqual(count + 1, UnidadProducto.objects.count())
