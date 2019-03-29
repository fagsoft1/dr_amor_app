import random

import factory
from django.utils import timezone

from .models import TipoVehiculo, ModalidadFraccionTiempo, ModalidadFraccionTiempoDetalle, Vehiculo
from empresas.factories import EmpresaFactory
from faker import Faker

faker = Faker()


class TipoVehiculoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TipoVehiculo

    empresa = factory.SubFactory(EmpresaFactory)
    nombre = factory.Sequence(lambda n: f'{n}{faker.word()}')
    porcentaje_iva = 19
    valor_impuesto_unico = 500


class ModalidadFraccionTiempoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ModalidadFraccionTiempo

    nombre = factory.Sequence(lambda n: f'{n}{faker.word()}')
    tipo_vehiculo = factory.SubFactory(TipoVehiculoFactory)


class ModalidadFraccionTiempoDetalleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ModalidadFraccionTiempoDetalle

    modalidad_fraccion_tiempo = factory.SubFactory(ModalidadFraccionTiempoFactory)
    minutos = 60
    valor = 2000


class VehiculoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Vehiculo

    tipo_vehiculo = factory.SubFactory(TipoVehiculoFactory)
    placa = factory.Sequence(lambda n: f'{n}LLL')
