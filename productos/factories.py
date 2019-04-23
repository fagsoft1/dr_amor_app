import random

import factory
from .models import Producto, CategoriaProducto, CategoriaDosProducto, UnidadProducto
from empresas.factories import EmpresaFactory
from faker import Faker

faker = Faker()


class UnidadProductoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UnidadProducto

    nombre = factory.Sequence(lambda n: 'nombre unidad %d' % n)


class CategoriaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CategoriaProducto

    nombre = factory.Sequence(lambda n: 'nombre categoria%d' % n)
    codigo = factory.Sequence(lambda n: 'C%d' % n)


class CategoriaDosFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CategoriaDosProducto

    categoria = factory.SubFactory(CategoriaFactory)
    nombre = factory.Sequence(lambda n: 'nombre categoria%d' % n)
    codigo = factory.Sequence(lambda n: 'C%d' % n)


class ProductoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Producto

    nombre = factory.Sequence(lambda n: 'nombre producto%d' % n)
    categoria_dos = factory.SubFactory(CategoriaDosFactory)
    unidad_producto = factory.SubFactory(UnidadProductoFactory)
    empresa = factory.SubFactory(EmpresaFactory)
    precio_venta = faker.pyfloat(left_digits=4, right_digits=0, positive=True)
    activo = True
