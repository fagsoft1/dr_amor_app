import factory
from .models import VentaProducto
from faker import Faker

faker = Faker()

from terceros.factories import CuentaColaboradorFactory
from puntos_venta.factories import PuntoVentaTurnoFactory


class VentaProductoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = VentaProducto

    cuenta = factory.SubFactory(CuentaColaboradorFactory)
    punto_venta_turno = factory.SubFactory(PuntoVentaTurnoFactory)
