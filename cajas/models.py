from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel
from servicios.models import Servicio, VentaServicio


class MovimientoDineroServicio(TimeStampedModel):
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT)
    servicio = models.ForeignKey(Servicio, null=True, blank=True, on_delete=models.PROTECT)
    venta_servicios = models.ForeignKey(VentaServicio, null=True, blank=True, on_delete=models.PROTECT)
    concepto = models.TextField()
    valor_efectivo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valor_tarjeta = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    franquicia = models.CharField(max_length=30, null=True)
    nro_autorizacion = models.CharField(max_length=30, null=True)
