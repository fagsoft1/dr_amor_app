from decimal import Decimal

from django.db import models

from empresas.models import Empresa
from model_utils.models import TimeStampedModel
from puntos_venta.models import PuntoVentaTurno
from contabilidad_impuestos.models import Impuesto


class TipoVehiculo(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.PROTECT)
    nombre = models.CharField(max_length=120, unique=True)
    impuestos = models.ManyToManyField(Impuesto, related_name='tipos_vehiculos')
    porcentaje_iva = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_impuesto_unico = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tiene_placa = models.BooleanField(default=False)

    class Meta:
        permissions = [
            ['list_tipovehiculo', 'Puede listar tipos vehiculos'],
        ]


class ModalidadFraccionTiempo(models.Model):
    nombre = models.CharField(max_length=120)
    tipo_vehiculo = models.ForeignKey(TipoVehiculo, on_delete=models.PROTECT)
    hora_inicio = models.TimeField(null=True)
    numero_horas = models.IntegerField(default=0)
    lunes = models.BooleanField(default=True)
    martes = models.BooleanField(default=True)
    miercoles = models.BooleanField(default=True)
    jueves = models.BooleanField(default=True)
    viernes = models.BooleanField(default=True)
    sabado = models.BooleanField(default=True)
    domingo = models.BooleanField(default=True)

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
    def valor_antes_impuestos(self) -> Decimal:
        return self.valor / (1 + (
                self.modalidad_fraccion_tiempo.tipo_vehiculo.porcentaje_iva / 100)) - self.modalidad_fraccion_tiempo.tipo_vehiculo.valor_impuesto_unico

    @property
    def valor_unico_impuesto(self) -> Decimal:
        return self.modalidad_fraccion_tiempo.tipo_vehiculo.valor_impuesto_unico

    @property
    def impuesto_iva(self) -> Decimal:
        return self.valor - self.valor_antes_impuestos - self.valor_unico_impuesto

    @property
    def tipo_vehiculo_nombre(self) -> str:
        return self.modalidad_fraccion_tiempo.tipo_vehiculo.nombre


class Vehiculo(TimeStampedModel):
    tipo_vehiculo = models.ForeignKey(TipoVehiculo, on_delete=models.PROTECT)
    placa = models.CharField(max_length=10, null=True)

    class Meta:
        permissions = [
            ['list_vehiculo', 'Puede listar vehiculos'],
        ]


class RegistroEntradaParqueo(TimeStampedModel):
    punto_venta_turno = models.ForeignKey(PuntoVentaTurno, on_delete=models.PROTECT)
    codigo_qr = models.CharField(max_length=300, null=True)
    modalidad_fraccion_tiempo = models.ForeignKey(
        ModalidadFraccionTiempo,
        related_name='registros_de_parqueo',
        on_delete=models.PROTECT
    )
    vehiculo = models.ForeignKey(Vehiculo, related_name='registros_de_parqueo', on_delete=models.PROTECT, null=True)
    hora_ingreso = models.DateTimeField(null=True)
    hora_pago = models.DateTimeField(null=True)
    hora_salida = models.DateTimeField(null=True)
    valor_parqueadero = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    valor_iva_parqueadero = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    valor_impuesto_unico = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    detalle = models.CharField(max_length=500, null=True)
    transacciones_caja = models.ManyToManyField('cajas.TransaccionCaja', related_name='parqueaderos')

    @property
    def valor_total(self):
        valor_total = self.valor_parqueadero + self.valor_iva_parqueadero + self.valor_impuesto_unico
        return valor_total

    class Meta:
        permissions = [
            ['list_registroentradaparqueo', 'Puede listar registros de parqueo'],
        ]
