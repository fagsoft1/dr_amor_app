from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel
from servicios.models import Servicio
from puntos_venta.models import PuntoVenta
from productos.models import Producto
from liquidaciones.models import LiquidacionCuenta
from terceros.models import Cuenta, Tercero


class BilleteMoneda(models.Model):
    TIPO_CHOICES = (
        (0, 'BILLETES'),
        (1, 'MONEDAS'),
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
    usuario = models.ForeignKey(User, on_delete=models.PROTECT, related_name='bases_disponibles_entregadas')
    punto_venta = models.ForeignKey(PuntoVenta, on_delete=models.PROTECT, related_name='bases_disponibles')
    dolares = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    dolares_tasa = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valor_tarjeta = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    nro_voucher = models.PositiveIntegerField(default=0)


class BaseDisponibleDenominacion(models.Model):
    tipo = models.IntegerField()
    arqueo_caja = models.ForeignKey(ArqueoCaja, on_delete=models.PROTECT,
                                    related_name='base_dia_siguiente')
    cantidad = models.PositiveIntegerField()
    valor = models.DecimalField(max_digits=10, decimal_places=0)


class EfectivoEntregaDenominacion(models.Model):
    tipo = models.IntegerField()
    arqueo_caja = models.ForeignKey(ArqueoCaja, on_delete=models.PROTECT,
                                    related_name='entrega_efectivo')
    cantidad = models.PositiveIntegerField()
    valor = models.DecimalField(max_digits=10, decimal_places=0)


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
    tipo = models.CharField(max_length=3, null=True, blank=True, choices=TIPO_CHOICES)
    tipo_dos = models.CharField(max_length=30, null=True, blank=True, choices=TIPO_DOS_CHOICES)
    valor_efectivo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valor_tarjeta = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    franquicia = models.CharField(max_length=30, null=True)
    nro_autorizacion = models.CharField(max_length=30, null=True)


class OperacionCaja(models.Model):
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
    valor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    transacciones_caja = models.ManyToManyField(TransaccionCaja, related_name='operaciones_caja')

    class Meta:
        permissions = [
            ['list_operacioncaja', 'Puede listar Operaciones Caja'],
        ]
