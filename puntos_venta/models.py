from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel

from inventarios.models import Bodega
from puntos_venta.managers import PuntoVentaTurnoManager


class PuntoVenta(models.Model):
    TIPO_CHOICES = [
        (1, 'Servicios'),
        (2, 'Tienda'),
        (3, 'Parqueadero'),
    ]
    bodega = models.OneToOneField(Bodega, related_name='punto_venta', on_delete=models.PROTECT, null=True)
    nombre = models.CharField(max_length=120)
    tipo = models.PositiveIntegerField(choices=TIPO_CHOICES)
    usuarios = models.ManyToManyField(User, related_name='mis_puntos_venta')
    usuario_actual = models.OneToOneField(User, null=True, blank=True, related_name='punto_venta_actual',
                                          on_delete=models.PROTECT)
    abierto = models.BooleanField(default=0)

    @property
    def turno_anterior(self):
        return self.turnos.filter(finish__isnull=False).last()

    @property
    def turno_actual(self):
        return self.turnos.filter(finish__isnull=True).last()

    class Meta:
        permissions = [
            ['list_puntoventa', 'Puede listar puntos ventas'],
        ]


class PuntoVentaTurno(TimeStampedModel):
    usuario = models.ForeignKey(User, related_name='turnos_punto_venta', on_delete=models.PROTECT)
    punto_venta = models.ForeignKey(PuntoVenta, related_name='turnos', on_delete=models.PROTECT)
    turno_anterior = models.ForeignKey('self', related_name='siguiente_turno', on_delete=models.PROTECT, null=True)
    diferencia_cierre_caja_anterior = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    base_inicial_efectivo = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    diferencia_cierre_caja = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    finish = models.DateTimeField(null=True)

    objects = PuntoVentaTurnoManager()
