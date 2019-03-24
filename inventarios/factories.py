import random

import factory
from .models import (
    Bodega,
    MovimientoInventario,
    MovimientoInventarioDetalle,
    TrasladoInventario,
    TrasladoInventarioDetalle
)
from faker import Faker
from django.utils import timezone
from usuarios.factories import UserFactory
from terceros.factories import ProveedorFactory
from productos.factories import ProductoFactory

faker = Faker()


class BodegaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Bodega

    nombre = factory.Sequence(lambda n: 'nombre bodega %d' % n)
    es_principal = False


class MovimientoInventarioFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MovimientoInventario

    fecha = timezone.now()
    creado_por = factory.SubFactory(UserFactory)
    proveedor = factory.SubFactory(ProveedorFactory)
    bodega = factory.SubFactory(BodegaFactory)
    motivo = random.choice(['compra', 'saldo_inicial', 'ajuste_ingreso', 'ajuste_salida'])
    cargado = False


class MovimientoInventarioDetalleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MovimientoInventarioDetalle

    movimiento = factory.SubFactory(MovimientoInventarioFactory)
    producto = factory.SubFactory(ProductoFactory)
    costo_unitario = 1000
    entra_cantidad = 10
    entra_costo = 10000
    sale_cantidad = 0
    sale_costo = 0
    saldo_cantidad = 0
    saldo_costo = 0
    es_ultimo_saldo = False


class TrasladoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TrasladoInventario

    estado = 1
    trasladado = False
    bodega_origen = factory.SubFactory(BodegaFactory)
    bodega_destino = factory.SubFactory(BodegaFactory)


class TrasladoInventarioDetalleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TrasladoInventarioDetalle

    traslado = factory.SubFactory(TrasladoFactory)
    producto = factory.SubFactory(ProductoFactory)
    cantidad = 10
    cantidad_realmente_trasladada = 9
