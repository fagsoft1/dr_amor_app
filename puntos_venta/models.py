from django.contrib.auth.models import User
from django.db import models

from inventarios.models import Bodega


class PuntoVenta(models.Model):
    TIPO_CHOICES = [
        (1, 'Servicios'),
        (0, 'Tienda'),
    ]
    bodega = models.OneToOneField(Bodega, related_name='punto_venta', on_delete=models.PROTECT)
    nombre = models.CharField(max_length=120)
    tipo = models.PositiveIntegerField(choices=TIPO_CHOICES)
    usuarios = models.ManyToManyField(User, related_name='mis_puntos_venta')
    abierto = models.BooleanField(default=0)

    class Meta:
        permissions = [
            ['list_puntoventa', 'Puede listar puntos ventas'],
            ['detail_puntoventa', 'Puede ver detalle punto venta'],
        ]
