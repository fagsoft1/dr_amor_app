from django.contrib.auth.models import User
from django.db import models
from django.db.models import Sum
from model_utils.models import TimeStampedModel
from contabilidad_cuentas.models import CuentaContable
from contabilidad_movimientos.managers import AsientoContableManager
from empresas.models import Empresa
from terceros.models import Tercero
from contabilidad_diario.models import DiarioContable
from contabilidad_comprobantes.models import TipoComprobanteContableEmpresa


# Create your models here.
class AsientoContable(TimeStampedModel):
    usuario = models.ForeignKey(User, on_delete=models.PROTECT, related_name='asientos_contables')
    tipo_comprobante_bancario_empresa = models.ForeignKey(
        TipoComprobanteContableEmpresa,
        on_delete=models.PROTECT,
        related_name='apuntes_contables'
    )
    nro_comprobante = models.BigIntegerField(null=True)
    diario_contable = models.ForeignKey(DiarioContable, on_delete=models.PROTECT, related_name='asientos_contables')
    empresa = models.ForeignKey(Empresa, on_delete=models.PROTECT, related_name='asientos_contables', null=True)
    tercero = models.ForeignKey(Tercero, on_delete=models.PROTECT, related_name='asientos_contables', null=True)
    concepto = models.CharField(max_length=300)
    fecha = models.DateTimeField()
    consolidada = models.BooleanField(default=False)
    nota = models.CharField(max_length=1000, null=True)
    objects = AsientoContableManager()

    @property
    def total_debito(self) -> float:
        return self.apuntes_contables.aggregate(total=Sum('debito'))['total']

    @property
    def total_credito(self) -> float:
        return self.apuntes_contables.aggregate(total=Sum('credito'))['total']

    class Meta:
        permissions = [
            ['list_asientocontable', 'Puede listar Asientos Contables'],
        ]


class ApunteContable(TimeStampedModel):
    asiento_contable = models.ForeignKey(
        AsientoContable,
        on_delete=models.PROTECT,
        related_name='apuntes_contables'
    )
    cuenta_contable = models.ForeignKey(CuentaContable, on_delete=models.PROTECT, related_name='apuntes_contables')
    apunte_contable_cierre = models.ForeignKey(
        'self',
        on_delete=models.PROTECT, null=True,
        related_name='asientos_contables_cerrados'
    )
    tercero = models.ForeignKey(
        Tercero,
        on_delete=models.PROTECT,
        related_name='apuntes_contables',
        null=True
    )
    debito = models.DecimalField(default=0, max_digits=12, decimal_places=2)
    credito = models.DecimalField(default=0, max_digits=12, decimal_places=2)

    class Meta:
        permissions = [
            ['list_apuntecontable', 'Puede listar Apuntes Contables'],
        ]
