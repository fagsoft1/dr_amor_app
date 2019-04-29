from django.contrib.auth.models import User
from django.db import models
from django.db.models import Sum
from django.db.models.functions import Coalesce
from model_utils.models import TimeStampedModel
from servicios.models import Servicio
from puntos_venta.models import PuntoVenta
from productos.models import Producto
from liquidaciones.models import LiquidacionCuenta
from terceros.models import Cuenta, Tercero


class BilleteMoneda(models.Model):
    TIPO_CHOICES = (
        (1, 'BILLETES'),
        (2, 'MONEDAS'),
    )
    tipo = models.IntegerField(choices=TIPO_CHOICES)
    valor = models.DecimalField(max_digits=10, decimal_places=0)
    activo = models.BooleanField(default=False)

    class Meta:
        unique_together = (('valor', 'tipo'))
        permissions = [
            ['list_billetemoneda', 'Puede listar Billetes Monedas'],
        ]


class ArqueoCaja(TimeStampedModel):
    from puntos_venta.models import PuntoVentaTurno
    punto_venta_turno = models.OneToOneField(PuntoVentaTurno, on_delete=models.PROTECT, related_name='arqueo_caja')
    valor_pago_efectivo_a_entregar = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_pago_tarjeta_a_entregar = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nro_voucher_a_entregar = models.PositiveIntegerField(default=0)
    dolares_tasa = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_dolares_entregados = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_tarjeta_entregados = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nro_voucher_entregados = models.PositiveIntegerField(default=0)
    observacion = models.TextField(null=True)

    @property
    def valor_entrega_efectivo(self):
        return self.entrega_efectivo.aggregate(
            valor=Coalesce(Sum('valor_total'), 0)
        )['valor']

    @property
    def valor_base_dia_siguiente(self):
        return self.base_dia_siguiente.aggregate(
            valor=Coalesce(Sum('valor_total'), 0)
        )['valor']

    @property
    def valor_dolares_en_pesos(self):
        return self.valor_dolares_entregados * self.dolares_tasa

    @property
    def valor_entrega_efectivo_total(self):
        return self.valor_entrega_efectivo + self.valor_base_dia_siguiente + self.valor_dolares_en_pesos

    @property
    def total(self):
        return self.valor_entrega_efectivo_total + self.valor_tarjeta_entregados

    @property
    def total_esperado(self):
        return self.valor_pago_efectivo_a_entregar + self.valor_pago_tarjeta_a_entregar

    @property
    def diferencia(self):
        return self.total - self.total_esperado


class BaseDisponibleDenominacion(models.Model):
    tipo = models.IntegerField()
    arqueo_caja = models.ForeignKey(
        ArqueoCaja,
        on_delete=models.PROTECT,
        related_name='base_dia_siguiente'
    )
    cantidad = models.PositiveIntegerField(default=0)
    cantidad_recibida = models.PositiveIntegerField(default=0)
    valor = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    valor_total = models.DecimalField(max_digits=10, decimal_places=0, default=0)


class EfectivoEntregaDenominacion(models.Model):
    tipo = models.IntegerField()
    arqueo_caja = models.ForeignKey(
        ArqueoCaja,
        on_delete=models.PROTECT,
        related_name='entrega_efectivo'
    )
    cantidad = models.PositiveIntegerField(default=0)
    valor = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    valor_total = models.DecimalField(max_digits=10, decimal_places=0, default=0)


class ConceptoOperacionCaja(models.Model):
    TIPO_CHOICES = (
        ('I', 'Ingreso'),
        ('E', 'Egreso'),
    )
    GRUPO_CHOICES = (
        ('A', 'Acompañantes'),
        ('C', 'Colaboradores'),
        ('P', 'Proveedores'),
        ('T', 'Taxis'),
        ('O', 'Otros'),
    )
    tipo = models.CharField(choices=TIPO_CHOICES, max_length=3)
    grupo = models.CharField(choices=GRUPO_CHOICES, max_length=3)
    descripcion = models.CharField(max_length=300)
    puntos_de_venta = models.ManyToManyField(PuntoVenta, related_name='conceptos_operaciones_caja_cierre')

    class Meta:
        permissions = [
            ['list_conceptooperacioncaja', 'Puede listar Conceptos Operaciones Caja'],
        ]


class TransaccionCaja(TimeStampedModel):
    from puntos_venta.models import PuntoVentaTurno
    TIPO_CHOICES = (
        ("I", "Ingreso"),
        ("E", "Egreso"),
    )
    TIPO_DOS_CHOICES = (
        ("SER_ACOM", "Venta Servicios"),
        ("CAM_TIE_SER_ACOM", "Cambio Tiempo Servicio Acompañanate"),
        ("CAM_HABITACION", "Cambio de Habitacion Servicio"),
        ("LIQ_ACOM", "Liquidacion Acompañante"),
        ("ANU_SER_ACOM", "Anulacion Servicio Acompañante"),
        ("BASE_INI", "Base Inicial"),
        ("OPE_CAJ_EGR", "Operación Caja Egreso"),
        ("OPE_CAJ_ING", "Operación Caja Ingreso"),
    )

    punto_venta_turno = models.ForeignKey(PuntoVentaTurno, on_delete=models.PROTECT, related_name='transacciones_caja')
    concepto = models.TextField()
    nro_vauchers = models.PositiveIntegerField(default=0)
    tipo = models.CharField(max_length=3, null=True, choices=TIPO_CHOICES)
    tipo_dos = models.CharField(max_length=30, null=True, choices=TIPO_DOS_CHOICES)
    valor_efectivo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valor_tarjeta = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    franquicia = models.CharField(max_length=30, null=True)
    nro_autorizacion = models.CharField(max_length=30, null=True)


class OperacionCaja(TimeStampedModel):
    from puntos_venta.models import PuntoVentaTurno
    concepto = models.ForeignKey(
        ConceptoOperacionCaja,
        on_delete=models.PROTECT,
        related_name='operaciones_caja',
        null=True
    )
    cuenta = models.ForeignKey(
        Cuenta,
        on_delete=models.PROTECT,
        related_name='operaciones_caja',
        null=True
    )
    punto_venta_turno = models.ForeignKey(
        PuntoVentaTurno,
        on_delete=models.PROTECT,
        related_name='operaciones_caja'
    )
    tercero = models.ForeignKey(
        Tercero,
        on_delete=models.PROTECT,
        related_name='operaciones_caja',
        null=True
    )
    grupo_operaciones = models.CharField(max_length=300)
    descripcion = models.CharField(max_length=100)
    observacion = models.TextField(null=True)
    valor = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transacciones_caja = models.ManyToManyField(TransaccionCaja, related_name='operaciones_caja')

    class Meta:
        permissions = [
            ['list_operacioncaja', 'Puede listar Operaciones Caja'],
        ]
