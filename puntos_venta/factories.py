import random

import factory
from .models import PuntoVenta, PuntoVentaTurno
from inventarios.factories import BodegaFactory
from usuarios.factories import UserFactory
from faker import Faker

faker = Faker()


class PuntoVentaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PuntoVenta

    bodega = factory.SubFactory(BodegaFactory)
    nombre = factory.Sequence(lambda n: 'nombre pdv %d' % n)
    tipo = random.choice([1, 2])
    usuario_actual = factory.SubFactory(UserFactory)
    abierto = True


class PuntoVentaTurnoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PuntoVentaTurno

    punto_venta = factory.SubFactory(PuntoVentaFactory)
    usuario = factory.SubFactory(UserFactory)
    finish = None
