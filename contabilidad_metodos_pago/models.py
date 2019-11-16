from django.db import models
from contabilidad_bancos.models import CuentaBancariaBanco
from contabilidad_cuentas.models import CuentaContable
from contabilidad_movimientos.models import DiarioContable


class MetodoPago(models.Model):
    TIPO_CHOICE = (
        (1, 'Efectivo'),
        (2, 'Bancario'),
        (3, 'Credito Mesero'),
        (4, 'Credito Tercero'),
    )
    diario_contable = models.ForeignKey(DiarioContable, on_delete=models.PROTECT)
    activo = models.BooleanField(default=False)
    nombre = models.CharField(max_length=200)
    tipo = models.IntegerField(choices=TIPO_CHOICE)
    cuenta_bancaria = models.ForeignKey(
        CuentaBancariaBanco,
        null=True,
        on_delete=models.PROTECT,
        related_name='metodos_de_pago'
    )
    cuenta_metodo_pago = models.ForeignKey(CuentaContable, on_delete=models.PROTECT, related_name='metodos_pagos')
    cuenta_metodo_pago_devolucion = models.ForeignKey(
        CuentaContable,
        on_delete=models.PROTECT,
        related_name='metodos_pagos_devolucion'
    )

    class Meta:
        permissions = [
            ['list_metodopago', 'Puede listar Métodos de Pagos'],
        ]
