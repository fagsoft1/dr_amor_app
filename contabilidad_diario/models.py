from django.db import models
from contabilidad_cuentas.models import CuentaContable
from contabilidad_bancos.models import Banco, CuentaBancariaBanco


class DiarioContable(models.Model):
    TIPO_CHOICES = (
        ('Venta', 'Venta'),
        ('Compra', 'Compra'),
        ('Efectivo', 'Efectivo'),
        ('Banco', 'Banco'),
        ('General', 'General'),
    )
    nombre = models.CharField(max_length=300)
    codigo = models.CharField(max_length=4)
    tipo = models.CharField(choices=TIPO_CHOICES, default='General', max_length=120)
    cuenta_debito_defecto = models.ForeignKey(
        CuentaContable,
        on_delete=models.PROTECT,
        related_name='diarios_contables_debito',
        null=True
    )
    cuenta_credito_defecto = models.ForeignKey(
        CuentaContable,
        on_delete=models.PROTECT,
        related_name='diarios_contables_credito',
        null=True
    )
    banco = models.ForeignKey(
        Banco,
        on_delete=models.PROTECT,
        related_name='diarios_contables',
        null=True
    )
    cuenta_bancaria = models.ForeignKey(
        CuentaBancariaBanco,
        on_delete=models.PROTECT,
        related_name='diarios_contables',
        null=True
    )

    class Meta:
        permissions = [
            ['list_diariocontable', 'Puede listar Diarios Contables'],
        ]
