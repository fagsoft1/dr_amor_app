from django.db import models
from model_utils.models import TimeStampedModel
from contabilidad_cuentas.models import CuentaContable
from contabilidad_movimientos.managers import AsientoContableManager
from empresas.models import Empresa
from terceros.models import Tercero
from contabilidad_diario.models import DiarioContable


# Create your models here.
class AsientoContable(TimeStampedModel):
    diario_contable = models.ForeignKey(DiarioContable, on_delete=models.PROTECT, related_name='asientos_contables')
    empresa = models.ForeignKey(Empresa, on_delete=models.PROTECT, related_name='asientos_contables', null=True)
    tercero = models.ForeignKey(Tercero, on_delete=models.PROTECT, related_name='asientos_contables', null=True)
    concepto = models.CharField(max_length=300)
    fecha = models.DateTimeField()
    consolidada = models.BooleanField(default=False)
    nota = models.CharField(max_length=1000, null=True)
    objects = AsientoContableManager()

    class Meta:
        permissions = [
            ['list_asientocontable', 'Puede listar Asientos Contables'],
        ]


class ApunteContable(TimeStampedModel):
    asiento_contable = models.ForeignKey(AsientoContable, on_delete=models.PROTECT, related_name='apuntes_contables')
    cuenta_contable = models.ForeignKey(CuentaContable, on_delete=models.PROTECT, related_name='apuntes_contables')
    apunte_contable_cierre = models.ForeignKey('self', on_delete=models.PROTECT, null=True,
                                               related_name='asientos_contables_cerrados')
    tercero = models.ForeignKey(Tercero, on_delete=models.PROTECT, related_name='apuntes_contables', null=True)
    debito = models.DecimalField(default=0, max_digits=12, decimal_places=2)
    credito = models.DecimalField(default=0, max_digits=12, decimal_places=2)

    class Meta:
        permissions = [
            ['list_apuntecontable', 'Puede listar Apuntes Contables'],
        ]
