from django.contrib.auth.models import User
from django.db import models

# Create your models here.
from model_utils.models import TimeStampedModel

from productos.models import Producto
from puntos_venta.models import PuntoVenta


class SesionTrabajoPV(TimeStampedModel):
    usuario = models.ForeignKey(User, related_name='sesiones_trabajo', on_delete=models.PROTECT)
    punto_venta = models.ForeignKey(PuntoVenta, related_name='sesiones_trabajo', on_delete=models.PROTECT)
    finish = models.DateTimeField(null=True)


class SesionTrabajoPVInventario(TimeStampedModel):
    TIPO_CHOICES = (
        (1, 'De Apertura'),
        (2, 'De Cierre'),
    )
    sesion = models.ForeignKey(SesionTrabajoPV, related_name='Inventarios', on_delete=models.PROTECT)
    tipo = models.PositiveIntegerField(choices=TIPO_CHOICES)

    class Meta:
        unique_together = (('sesion', 'tipo'))


class SesionTrabajoPVInventarioDetalle(TimeStampedModel):
    sesion_trabajo_pv_inventario = models.ForeignKey(
        SesionTrabajoPVInventario,
        related_name='items',
        on_delete=models.PROTECT
    )
    producto = models.ForeignKey(Producto, related_name='ventas_por_sesiones', on_delete=models.PROTECT)
    cantidad_inicio = models.DecimalField(max_digits=12, decimal_places=12)
    cantidad_traslado = models.DecimalField(max_digits=12, decimal_places=12)
    cantidad_venta = models.DecimalField(max_digits=12, decimal_places=12)
