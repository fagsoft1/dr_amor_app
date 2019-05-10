from django.db import models
from contabilidad_cuentas.models import CuentaContable


# Create your models here.
class ImpuestoGrupo(models.Model):
    nombre = models.CharField(unique=True, max_length=120)


class Impuesto(models.Model):
    AMBITO_CHOICES = (
        ('Compras', 'Compras'),
        ('Ventas', 'Ventas'),
        ('Ajustes', 'Ajustes'),
        ('Ninguno', 'Ninguno'),
    )
    TIPO_CALCULO_CHOICES = (
        ('Fijo', 'Fijo'),
        ('Porcentaje sobre precio', 'Porcentaje sobre el precio'),
        ('Porcentaje sobre precio impuestos incluidos', 'Porcentaje sobre el precio con impuestos incluidos'),
    )
    nombre = models.CharField(unique=True, max_length=120)
    ambito = models.CharField(choices=AMBITO_CHOICES, max_length=120)
    tipo_calculo_impuesto = models.CharField(choices=TIPO_CALCULO_CHOICES, max_length=150)
    cuenta_impuesto = models.ForeignKey(CuentaContable, on_delete=models.PROTECT, related_name='impuestos')
    cuenta_impuesto_notas_credito = models.ForeignKey(
        CuentaContable,
        on_delete=models.PROTECT,
        related_name='impuestos_notas_credito'
    )
    importe = models.DecimalField(decimal_places=3, max_digits=12, default=0)
