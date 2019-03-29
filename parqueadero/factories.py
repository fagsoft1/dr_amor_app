import factory

from .models import (
    TipoVehiculo,
    ModalidadFraccionTiempo,
    ModalidadFraccionTiempoDetalle,
    Vehiculo,
    RegistroEntradaParqueo
)
from empresas.factories import EmpresaFactory
from puntos_venta.factories import PuntoVentaTurnoFactory
from faker import Faker

faker = Faker()


class TipoVehiculoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TipoVehiculo

    empresa = factory.SubFactory(EmpresaFactory)
    nombre = factory.Sequence(lambda n: f'{n}{faker.word()}')
    porcentaje_iva = 19
    valor_impuesto_unico = 500
    tiene_placa = True


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


class RegistroEntradaParqueoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = RegistroEntradaParqueo

    punto_venta_turno = factory.SubFactory(PuntoVentaTurnoFactory)
    modalidad_fraccion_tiempo = factory.SubFactory(ModalidadFraccionTiempoFactory)
    vehiculo = factory.SubFactory(VehiculoFactory)
    hora_salida = None
    codigo_qr = None
