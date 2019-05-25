from django.db import models
from contabilidad_cuentas.models import CuentaContable


# Create your models here.

class Impuesto(models.Model):
    TIPO_CALCULO_CHOICES = (
        (1, 'Porcentaje sobre el precio con impuestos incluidos'),
        (2, 'Porcentaje sobre el precio'),
        (3, 'Fijo'),
    )
    nombre = models.CharField(unique=True, max_length=120)
    tipo_calculo_impuesto = models.IntegerField(choices=TIPO_CALCULO_CHOICES)
    cuenta_impuesto = models.ForeignKey(CuentaContable, on_delete=models.PROTECT, related_name='impuestos')
    cuenta_impuesto_notas_credito = models.ForeignKey(
        CuentaContable,
        on_delete=models.PROTECT,
        related_name='impuestos_notas_credito'
    )
    tasa_importe_venta = models.DecimalField(decimal_places=3, max_digits=12, default=0)
    tasa_importe_compra = models.DecimalField(decimal_places=3, max_digits=12, default=0)

    class Meta:
        permissions = [
            ['list_impuesto', 'Puede listar Impuestos'],
        ]
