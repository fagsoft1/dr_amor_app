from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel
from puntos_venta.models import PuntoVenta, PuntoVentaTurno
from terceros.models import Cuenta


class LiquidacionCuenta(TimeStampedModel):
    TIPO_CUENTA_CHOICES = (
        ('ACOMPANANTE', 'Acompañante'),
        ('COLABORADOR', 'Colaborador'),
        ('MESERO', 'Mesero'),
    )
    creado_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='liquidaciones',
        null=True
    )
    punto_venta_turno = models.ForeignKey(
        PuntoVentaTurno,
        on_delete=models.PROTECT,
        related_name='liquidaciones',
        null=True
    )
    tipo_cuenta = models.CharField(choices=TIPO_CUENTA_CHOICES, max_length=30)
    cuenta = models.OneToOneField(Cuenta, null=True, blank=True, on_delete=models.PROTECT, related_name='liquidacion')
    saldo_anterior = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    a_pagar_a_tercero = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    a_cobrar_a_tercero = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    efectivo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tarjeta_o_transferencia = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    pagado = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transacciones_caja = models.ManyToManyField('cajas.TransaccionCaja', related_name='liquidaciones')
