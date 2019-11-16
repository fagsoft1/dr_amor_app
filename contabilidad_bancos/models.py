from django.db import models
from model_utils.models import TimeStampedModel


class Banco(TimeStampedModel):
    nombre = models.CharField(max_length=200, unique=True)

    class Meta:
        permissions = [
            ['list_banco', 'Puede listar Bancos'],
        ]


class CuentaBancariaBanco(TimeStampedModel):
    banco = models.ForeignKey(Banco, on_delete=models.PROTECT, null=True)
    nro_cuenta = models.CharField(max_length=200)
    titular_cuenta = models.CharField(max_length=200)

    class Meta:
        unique_together = [('banco', 'nro_cuenta')]
        permissions = [
            ['list_cuentabancariabanco', 'Puede listar Cuentas Bancarias'],
        ]
