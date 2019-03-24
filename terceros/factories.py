import random

import factory

from terceros_acompanantes.factories import CategoriaAcompananteFactory
from usuarios.factories import UserFactory
from .models import Tercero, Cuenta
from faker import Faker

faker = Faker()


class AcompananteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tercero

    usuario = factory.SubFactory(UserFactory)
    categoria_modelo = factory.SubFactory(CategoriaAcompananteFactory)
    tipo_documento = random.choice(['CC', 'CE', 'PS', 'TI', 'NI'])
    nro_identificacion = factory.Sequence(lambda n: f'{n}nro_iden')
    nombre = factory.Sequence(lambda n: f'{n}nombre')
    nombre_segundo = factory.Sequence(lambda n: f'{n}2nombre')
    apellido = factory.Sequence(lambda n: f'{n}apellido')
    apellido_segundo = factory.Sequence(lambda n: f'{n}2apellido')
    fecha_nacimiento = faker.date_of_birth(tzinfo=None, minimum_age=18, maximum_age=60)
    genero = 'F'
    grupo_sanguineo = 'OPOSITIVO'
    es_acompanante = True
    es_colaborador = False
    es_proveedor = False
    presente = False
    alias_modelo = factory.Sequence(lambda n: f'Alias{n}')
    estado = 0
    pin: '0000'

    @classmethod
    def _build(cls, model_class, *args, **kwargs):
        return kwargs


class ColaboradorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tercero

    usuario = factory.SubFactory(UserFactory)
    tipo_documento = random.choice(['CC', 'CE', 'PS', 'TI', 'NI'])
    nro_identificacion = factory.Sequence(lambda n: f'{n}col nro_iden')
    nombre = factory.Sequence(lambda n: f'{n}col nombre')
    nombre_segundo = factory.Sequence(lambda n: f'{n}col 2nombre')
    apellido = factory.Sequence(lambda n: f'{n}col apellido')
    apellido_segundo = factory.Sequence(lambda n: f'{n}col 2apellido')
    fecha_nacimiento = faker.date_of_birth(tzinfo=None, minimum_age=18, maximum_age=60)
    genero = 'M'
    grupo_sanguineo = 'OPOSITIVO'
    es_acompanante = False
    es_colaborador = True
    es_proveedor = False
    presente = False
    estado = 0
    pin: '0000'

    @classmethod
    def _build(cls, model_class, *args, **kwargs):
        return kwargs


class ProveedorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tercero

    tipo_documento = 'NT'
    nro_identificacion = factory.Sequence(lambda n: f'{n}pro nro_iden')
    nombre = factory.Sequence(lambda n: f'{n}col nombre')
    es_acompanante = False
    es_colaborador = False
    es_proveedor = True


class CuentaAcompananteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Cuenta

    liquidada = False
    tipo = 1
    propietario = factory.SubFactory(UserFactory)


class CuentaColaboradorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Cuenta

    liquidada = False
    tipo = 1
    propietario = factory.SubFactory(UserFactory)
