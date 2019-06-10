from django.db import models
from contabilidad_bancos.models import CuentaBancariaBanco


class MetodoPago(models.Model):
    TIPO_CHOICE = (
        (1, 'Efectivo'),
        (2, 'Bancario'),
        (3, 'Credito Mesero'),
        (4, 'Credito Tercero'),
    )
    nombre = models.CharField(max_length=200)
    tipo = models.IntegerField(choices=TIPO_CHOICE)
    cuenta_bancaria = models.ForeignKey(
        CuentaBancariaBanco,
        null=True,
        on_delete=models.PROTECT,
        related_name='metodos_de_pago'
    )
