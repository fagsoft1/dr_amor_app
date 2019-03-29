from django.db import models
from empresas.models import Empresa
from model_utils.models import TimeStampedModel


class TipoVehiculo(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.PROTECT)
    nombre = models.CharField(max_length=120, unique=True)
    porcentaje_iva = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_impuesto_unico = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        permissions = [
            ['list_tipovehiculo', 'Puede listar tipos vehiculos'],
        ]


class ModalidadFraccionTiempo(models.Model):
    nombre = models.CharField(max_length=120)
    tipo_vehiculo = models.ForeignKey(TipoVehiculo, on_delete=models.PROTECT)

    class Meta:
        permissions = [
            ['list_modalidadfracciontiempo', 'Puede listar modalidades fracciones tiempos'],
        ]


class ModalidadFraccionTiempoDetalle(models.Model):
    modalidad_fraccion_tiempo = models.ForeignKey(
        ModalidadFraccionTiempo, on_delete=models.PROTECT,
        related_name='fracciones'
    )
    minutos = models.PositiveIntegerField()
    valor = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        unique_together = [('modalidad_fraccion_tiempo', 'minutos')]
        permissions = [
            ['list_modalidadfracciontiempodetalle', 'Puede listar modalidades fracciones tiempos detalles'],
        ]

    @property
    def valor_antes_impuestos(self):
        return self.valor / (1 + (
                self.modalidad_fraccion_tiempo.tipo_vehiculo.porcentaje_iva / 100)) - self.modalidad_fraccion_tiempo.tipo_vehiculo.valor_impuesto_unico


class Vehiculo(TimeStampedModel):
    tipo_vehiculo = models.ForeignKey(TipoVehiculo, on_delete=models.PROTECT)
    placa = models.CharField(max_length=10, null=True)

    class Meta:
        permissions = [
            ['list_vehiculo', 'Puede listar vehiculos'],
        ]
