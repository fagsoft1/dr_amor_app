from django.contrib.auth.models import User
from django.db import models

from model_utils.models import TimeStampedModel

from empresas.models import Empresa
from habitaciones.models import Habitacion
from terceros.models import Cuenta
from puntos_venta.models import PuntoVenta, PuntoVentaTurno


class Servicio(TimeStampedModel):
    ESTADO_CHOICES = (
        (1, 'En Servicio'),
        (2, 'Terminado'),
        (3, 'Anulado'),
        (4, 'Solicitud Anulación'),
    )
    habitacion = models.ForeignKey(Habitacion, on_delete=models.PROTECT, related_name='servicios', null=True)
    cuenta = models.ForeignKey(Cuenta, on_delete=models.PROTECT, related_name='servicios')
    punto_venta_turno = models.ForeignKey(PuntoVentaTurno, on_delete=models.PROTECT, related_name='ventas_servicios')
    estado = models.IntegerField(choices=ESTADO_CHOICES, default=0)
    hora_inicio = models.DateTimeField(null=True)
    hora_final = models.DateTimeField(null=True)
    hora_final_real = models.DateTimeField(null=True)
    hora_anulacion = models.DateTimeField(null=True)
    tiempo_minutos = models.PositiveIntegerField(default=0)
    categoria = models.CharField(max_length=120, null=True)
    comision = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_servicio = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    valor_habitacion = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    valor_iva_habitacion = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    servicio_anterior = models.OneToOneField('self', on_delete=models.PROTECT, related_name='servicio_siguiente',
                                             null=True)
    observacion_anulacion = models.TextField(null=True)
    transacciones_caja = models.ManyToManyField('cajas.TransaccionCaja', related_name='servicios')

    @property
    def valor_total(self):
        valor_total = self.valor_habitacion + self.valor_iva_habitacion + self.valor_servicio + self.comision
        return valor_total


class BitacoraServicio(TimeStampedModel):
    punto_venta_turno = models.ForeignKey(PuntoVentaTurno, on_delete=models.PROTECT, related_name='bitacoras_servicios')
    servicio = models.ForeignKey(
        Servicio,
        on_delete=models.CASCADE,
        related_name='bitacoras_servicio',
        null=True,
        blank=True
    )
    habitacion_nombre = models.CharField(max_length=300, null=True, blank=True)
    habitacion_anterior_nombre = models.CharField(max_length=300, null=True, blank=True)
    habitacion_nueva_nombre = models.CharField(max_length=300, null=True, blank=True)
    tiempo_contratado_anterior = models.PositiveIntegerField(null=True, blank=True)
    tiempo_contratado_nuevo = models.PositiveIntegerField(null=True, blank=True)
    tiempo_contratado = models.PositiveIntegerField(null=True, blank=True)
    hora_evento = models.DateTimeField(null=True, blank=True)
    tiempo_minutos_recorridos = models.PositiveIntegerField(null=True, blank=True)
    concepto = models.CharField(max_length=200)
    observacion = models.TextField(null=True)
