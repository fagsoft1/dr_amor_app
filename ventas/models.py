from django.db import models
from django.contrib.auth.models import User
from model_utils.models import TimeStampedModel
from puntos_venta.models import PuntoVenta
from productos.models import Producto


class Venta(TimeStampedModel):
    mesero = models.ForeignKey(User, on_delete=models.PROTECT, related_name='mis_ventas', null=True, blank=True)
    cliente = models.ForeignKey(User, on_delete=models.PROTECT, related_name='mis_compras', null=True, blank=True)
    cajero = models.ForeignKey(User, on_delete=models.PROTECT, related_name='mis_ventas_cajero', null=True, blank=True)
    punto_venta = models.ForeignKey(PuntoVenta, on_delete=models.PROTECT, related_name='mis_ventas')


class VentaProducto(TimeStampedModel):
    venta = models.ForeignKey(Venta, on_delete=models.PROTECT, related_name='mis_produtos')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, related_name='mis_ventas')
    cantidad = models.PositiveIntegerField(default=0)
    precio_venta_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    precio_venta_total = models.DecimalField(max_digits=10, decimal_places=2)
    costo_unitario = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    costo_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
