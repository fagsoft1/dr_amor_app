from django.db.utils import IntegrityError
from django.test import TestCase

from ..factories import (
    CategoriaAcompananteFactory,
    FraccionTiempoFactory,
    CategoriaFraccionTiempoFactory
)
from ..models import (
    CategoriaAcompanante,
    FraccionTiempo,
    CategoriaFraccionTiempo
)

from faker import Faker

faker = Faker()


class CategoriaAcompananteTests(TestCase):
    def test_categoria_acompanante_crear_serializer(self):
        count = CategoriaAcompanante.objects.count()
        categoria = CategoriaAcompananteFactory()
        self.assertEqual(count + 1, CategoriaAcompanante.objects.count())
        with self.assertRaisesMessage(
                IntegrityError,
                'duplicate key value violates unique constraint "terceros_acompanantes_categoriaacompanante_nombre_key'):
            CategoriaAcompananteFactory(nombre=categoria.nombre)


class FraccionTiempoTests(TestCase):
    def test_franccion_tiempo_crear(self):
        count = FraccionTiempo.objects.count()
        fraccion = FraccionTiempoFactory()
        self.assertEqual(count + 1, FraccionTiempo.objects.count())
        with self.assertRaisesMessage(
                IntegrityError,
                'duplicate key value violates unique constraint "terceros_acompanantes_fracciontiempo_minutos_key'
        ):
            FraccionTiempoFactory(minutos=fraccion.minutos)


class CategoriaFraccionTiempoTests(TestCase):
    def test_categoria_fraccion_tiempo_crear(self):
        count = CategoriaFraccionTiempo.objects.count()
        categoria_fraccion = CategoriaFraccionTiempoFactory()
        self.assertEqual(count + 1, CategoriaFraccionTiempo.objects.count())
        with self.assertRaisesMessage(
                IntegrityError,
                'duplicate key value violates unique constraint "terceros_acompanantes_ca_categoria_id_fraccion'
        ):
            CategoriaFraccionTiempoFactory(categoria=categoria_fraccion.categoria,
                                           fraccion_tiempo=categoria_fraccion.fraccion_tiempo)
