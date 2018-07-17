from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel
from puntos_venta.models import PuntoVenta
from terceros.models import Cuenta


class LiquidacionCuenta(TimeStampedModel):
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, related_name='liquidaciones_efectuadas')
    punto_venta = models.ForeignKey(PuntoVenta, on_delete=models.PROTECT, related_name='liquidaciones')
    cuenta = models.OneToOneField(Cuenta, null=True, blank=True, on_delete=models.PROTECT, related_name='liquidacion')
    pagado = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
