import random

from django.contrib.auth.models import User
from django.db import models
from imagekit.models import ProcessedImageField, ImageSpecField
from imagekit.processors import ResizeToFit
from model_utils.models import TimeStampedModel

from inventarios.managers import (
    MovimientoInventarioComprasManager,
    MovimientoInventarioSaldosInicialesManager,
    MovimientoInventarioAjustesManager,
    MovimientoInventarioManager,
    TrasladoInventarioDetalleManager)
from terceros.models import Tercero
from productos.models import Producto


class Bodega(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    es_principal = models.BooleanField(default=False)

    class Meta:
        permissions = [
            ['list_bodega', 'Puede listar bodegas'],
        ]


class MovimientoInventario(TimeStampedModel):
    MOTIVO_CHOICES = (
        ('compra', 'COMPRA'),
        ('saldo_inicial', 'SALDO INICIAL'),
        ('ajuste_ingreso', 'INGRESO AJUSTE'),
        ('ajuste_salida', 'SALIDA AJUSTE'),
    )
    fecha = models.DateField()
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    proveedor = models.ForeignKey(Tercero, related_name='movimientos_inventarios', on_delete=models.PROTECT, null=True)
    bodega = models.ForeignKey(Bodega, on_delete=models.PROTECT, related_name='movimientos')
    motivo = models.TextField(null=True)
    detalle = models.TextField(null=True)
    tipo = models.CharField(max_length=2, null=True)
    cargado = models.BooleanField(default=False)
    observacion = models.TextField(null=True)

    objects = MovimientoInventarioManager()
    compras = MovimientoInventarioComprasManager()
    saldos_iniciales = MovimientoInventarioSaldosInicialesManager()
    ajustes = MovimientoInventarioAjustesManager()

    class Meta:
        permissions = [
            ['list_movimientoinventario', 'Puede listar movimientos inventario'],
        ]


class MovimientoInventarioDocumento(TimeStampedModel):
    def imagen_documento_upload_to(instance, filename):
        nro_random = random.randint(1111, 9999)
        return "img/inventarios/movimiento_inventarios/%sj10%s.%s" % (
            nro_random, instance.movimiento.id, filename.split('.')[-1])

    movimiento = models.ForeignKey(MovimientoInventario, on_delete=models.PROTECT, related_name='documentos')
    imagen_documento = ProcessedImageField(
        processors=[ResizeToFit(1200, 1200)],
        format='JPEG',
        options={'quality': 70},
        upload_to=imagen_documento_upload_to
    )

    imagen_documento_thumbnail = ImageSpecField(
        source='imagen_documento',
        processors=[ResizeToFit(300, 200)],
        format='JPEG',
        options={'quality': 50}
    )


class MovimientoInventarioDetalle(TimeStampedModel):
    movimiento = models.ForeignKey(MovimientoInventario, on_delete=models.PROTECT, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, related_name='movimientos_inventarios')
    costo_unitario = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    entra_cantidad = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    entra_costo = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sale_cantidad = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sale_costo = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    saldo_cantidad = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    saldo_costo = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    costo_unitario_promedio = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    es_ultimo_saldo = models.BooleanField(default=False)

    class Meta:
        unique_together = [('movimiento', 'producto')]
        permissions = [
            ['list_movimientoinventariodetalle', 'Puede listar movimiento inventario detalle'],
        ]


class TrasladoInventario(TimeStampedModel):
    ESTADO_CHOICES = (
        (1, 'Iniciado'),
        (2, 'Esperando Traslado'),
        (3, 'Verificado'),
    )
    creado_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=True,
        related_name='traslado_inventario_creado'
    )
    recibido_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=True,
        related_name='traslado_inventario_recibido'
    )
    bodega_origen = models.ForeignKey(
        Bodega,
        related_name='salidas_mercancia_traslado',
        on_delete=models.PROTECT
    )
    bodega_destino = models.ForeignKey(
        Bodega,
        related_name='entradas_mercancia_traslado',
        on_delete=models.PROTECT
    )
    movimiento_origen = models.OneToOneField(
        MovimientoInventario,
        related_name='traslado_entrega',
        on_delete=models.PROTECT,
        null=True
    )
    movimiento_destino = models.OneToOneField(
        MovimientoInventario,
        related_name='traslado_recibe',
        on_delete=models.PROTECT,
        null=True
    )
    trasladado = models.BooleanField(default=False)
    estado = models.PositiveIntegerField(choices=ESTADO_CHOICES, default=1)

    class Meta:
        permissions = [
            ['list_trasladoinventario', 'Puede listar traslados inventario'],
        ]


class TrasladoInventarioDetalle(models.Model):
    traslado = models.ForeignKey(TrasladoInventario, on_delete=models.PROTECT, related_name='detalles')
    producto = models.ForeignKey(Producto, related_name='mis_traslados', on_delete=models.PROTECT)
    cantidad = models.DecimalField(max_digits=12, decimal_places=2)
    cantidad_realmente_trasladada = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    objects = TrasladoInventarioDetalleManager()

    class Meta:
        unique_together = [('traslado', 'producto')]
        permissions = [
            ['list_trasladoinventariodetalle', 'Puede listar traslados inventario detalle'],
        ]
