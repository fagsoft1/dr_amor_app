import random

import factory
from .models import ConceptoOperacionCaja, OperacionCaja, BilleteMoneda
from faker import Faker
from puntos_venta.factories import PuntoVentaTurnoFactory

faker = Faker()


class ConceptoOperacionCajaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ConceptoOperacionCaja

    tipo = random.choice(['I', 'E'])
    tipo_cuenta = random.choice(['CXC', 'CXP', 'NA'])
    grupo = random.choice(['A', 'C', 'P', 'T', 'O'])
    descripcion = factory.Sequence(lambda n: 'descripcion %d' % n)


class OperacionCajaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OperacionCaja

    concepto = factory.SubFactory(ConceptoOperacionCajaFactory)
    punto_venta_turno = factory.SubFactory(PuntoVentaTurnoFactory)
    cuenta = None
    tercero = None
    grupo_operaciones = 'hola'
    descripcion = 'hola'
    observacion = 'hola'
    valor = 1000


class BilleteMonedaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = BilleteMoneda

    tipo = random.choice([1, 2])
    valor = 10000
    activo = True
