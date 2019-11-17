from django.db import models
from empresas.models import Empresa


class TipoComprobanteContable(models.Model):
    codigo_comprobante = models.CharField(max_length=4)
    descripcion = models.CharField(max_length=200)
    titulo_comprobante = models.CharField(max_length=200)
    texto_uno = models.TextField(null=True)
    texto_dos = models.TextField(null=True)
    texto_tres = models.TextField(null=True)
    comprobantes_empresas = models.ManyToManyField(
        Empresa,
        through='TipoComprobanteContableEmpresa',
        through_fields=('tipo_comprobante', 'empresa'),
        related_name='tipos_comprobantes'
    )

    class Meta:
        permissions = [
            ['list_tipocomprobantecontable', 'Puede listar Tipos Comprobantes Contables'],
        ]


class TipoComprobanteContableEmpresa(models.Model):
    tipo_comprobante = models.ForeignKey(
        TipoComprobanteContable,
        on_delete=models.PROTECT,
        related_name='tipos_comprobantes_empresas'
    )
    empresa = models.ForeignKey(Empresa, on_delete=models.PROTECT, related_name='tipos_comprobantes_empresas')
    consecutivo_actual = models.BigIntegerField(default=0)
    numero_autorizacion = models.CharField(max_length=100, null=True)
    fecha_autorizacion = models.DateField(null=True)
    rango_inferior_numeracion = models.BigIntegerField(default=0)
    rango_superior_numeracion = models.BigIntegerField(default=0)
    tiene_vigencia = models.BooleanField(default=False)
    fecha_inicial_vigencia = models.DateField(null=True)
    fecha_final_vigencia = models.DateField(null=True)
    pais_emision = models.CharField(max_length=100, null=True, blank=True)
    ciudad_emision = models.CharField(max_length=100, null=True, blank=True)
    direccion_emision = models.CharField(max_length=100, null=True, blank=True)
    telefono_emision = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        permissions = [
            ['list_tipocomprobantecontableempresa', 'Puede listar Tipos Comprobantes Contables Empresas'],
        ]
