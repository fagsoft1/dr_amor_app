import random

import factory
from .models import CategoriaAcompanante, FraccionTiempo, CategoriaFraccionTiempo
from faker import Faker

faker = Faker()


class CategoriaAcompananteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CategoriaAcompanante

    nombre = factory.Sequence(lambda n: f'CategoriaAcompanante{n}')
    orden = factory.Sequence(lambda n: n)


class FraccionTiempoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = FraccionTiempo

    nombre = factory.Sequence(lambda n: f'Fraccion Tiempo {n}')
    minutos = random.choice([30, 45, 60])


class CategoriaFraccionTiempoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CategoriaFraccionTiempo

    categoria = factory.SubFactory(CategoriaAcompananteFactory)
    fraccion_tiempo = factory.SubFactory(FraccionTiempoFactory)
    valor = random.randint(29000, 119000)