from django.db import models
from django.contrib.auth.models import User
from model_utils.models import TimeStampedModel

from habitaciones.models import Habitacion
from puntos_venta.models import PuntoVenta, PuntoVentaTurno
from productos.models import Producto
from terceros.models import Cuenta


class VentaProducto(TimeStampedModel):
    punto_venta_turno = models.ForeignKey(PuntoVentaTurno, on_delete=models.PROTECT, related_name='ventas_productos')
    cuenta = models.ForeignKey(Cuenta, on_delete=models.PROTECT, related_name='compras_productos', null=True)


class VentaProductoDetalle(TimeStampedModel):
    venta = models.ForeignKey(VentaProducto, on_delete=models.PROTECT, related_name='productos')
    cantidad = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    costo_unitario = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    costo_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    precio_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
