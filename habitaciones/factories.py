import random

import factory
from django.utils import timezone

from .models import TipoHabitacion, Habitacion
from empresas.factories import EmpresaFactory
from faker import Faker

faker = Faker()


class TipoHabitacionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TipoHabitacion

    nombre = factory.Sequence(lambda n: 'nombre%d' % n)
    valor = 40000
    valor_adicional_servicio = 1000


class HabitacionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Habitacion

    numero = random.randint(1, 20)
    estado = 0
    activa = True
    tipo = factory.SubFactory(TipoHabitacionFactory)
    fecha_ultimo_estado = timezone.now()
    empresa = factory.SubFactory(EmpresaFactory)
