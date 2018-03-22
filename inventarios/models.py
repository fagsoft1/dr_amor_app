from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel

from terceros.models import Tercero
from productos.models import Producto


class Bodega(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    es_principal = models.BooleanField(default=False)

    class Meta:
        permissions = [
            ['list_bodega', 'Puede listar bodegas'],
        ]


class MovimientoInventario(TimeStampedModel):
    fecha = models.DateField()
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT)
    proveedor = models.ForeignKey(Tercero, related_name='movimientos_inventarios', on_delete=models.PROTECT, null=True,
                                  blank=True)
    bodega = models.ForeignKey(Bodega, on_delete=models.PROTECT, related_name='movimientos')
    motivo = models.TextField()
    detalle = models.TextField(null=True, blank=True)
    tipo = models.CharField(max_length=2, null=True, blank=True)

    class Meta:
        permissions = [
            ['list_movimientoinventario', 'Puede listar movimientos inventario'],
            ['detail_movimientoinventario', 'Puede ver detalle movimientos inventario'],
        ]


class MovimientoInventarioDetalle(TimeStampedModel):
    movimiento = models.ForeignKey(MovimientoInventario, on_delete=models.PROTECT, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, related_name='movimientos_inventarios')
    costo_unitario = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    entra_cantidad = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    entra_costo = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sale_cantidad = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sale_costo = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    saldo_cantidad = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    saldo_costo = models.DecimalField(max_digits=12, decimal_places=2, default=0)
