from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel

from terceros.models import Tercero
from productos.models import Producto


class Bodega(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    es_principal = models.BooleanField(default=False)

    class Meta:
        permissions = [
            ['list_bodega', 'Puede listar bodegas'],
            ['detail_bodega', 'Puede ver detalle bodega'],
        ]


class MovimientoInventario(TimeStampedModel):
    fecha = models.DateField()
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT)
    proveedor = models.ForeignKey(Tercero, related_name='movimientos_inventarios', on_delete=models.PROTECT, null=True,
                                  blank=True)
    bodega = models.ForeignKey(Bodega, on_delete=models.PROTECT, related_name='movimientos')
    motivo = models.TextField()
    detalle = models.TextField(null=True, blank=True)
    tipo = models.CharField(max_length=2, null=True, blank=True)
    cargado = models.BooleanField(default=False)

    def cargar_inventario(self):
        if not self.cargado:
            items = self.detalles.all()
            [item.calcular_costo_promedio() for item in items]
            self.cargado = True
            self.save()

    class Meta:
        permissions = [
            ['list_movimientoinventario', 'Puede listar movimientos inventario'],
            ['detail_movimientoinventario', 'Puede ver detalle movimientos inventario'],
        ]


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
    es_ultimo_saldo = models.BooleanField(default=False)

    def calcular_costo_promedio(self):
        qs = MovimientoInventarioDetalle.objects.exclude(
            id=self.id
        ).filter(
            es_ultimo_saldo=True,
            producto=self.producto,
            movimiento__bodega=self.movimiento.bodega
        )
        movimiento = qs.last()
        saldo_cantidad = 0
        saldo_costo = 0
        costo_unitario = 0
        if self.movimiento.tipo == 'E':
            saldo_cantidad = self.entra_cantidad
            saldo_costo = self.entra_costo
            costo_unitario = saldo_costo / saldo_cantidad
            if movimiento:
                saldo_cantidad += movimiento.saldo_cantidad
                saldo_costo += movimiento.saldo_costo
                costo_unitario = saldo_costo / saldo_cantidad

        if self.movimiento.tipo == 'S':
            saldo_cantidad = movimiento.saldo_cantidad - self.saldo_cantidad
            saldo_costo = movimiento.saldo_costo - (self.saldo_cantidad * movimiento.costo_unitario)
            costo_unitario = movimiento.costo_unitario

        qs.update(es_ultimo_saldo=False)
        self.es_ultimo_saldo = True
        self.saldo_cantidad = saldo_cantidad
        self.saldo_costo = saldo_costo
        self.costo_unitario = costo_unitario
        self.save()


class TrasladoInventario(models.Model):
    bodega_origen = models.ForeignKey(Bodega, related_name='salidas_mercancia_traslado', on_delete=models.PROTECT)
    bodega_destino = models.ForeignKey(Bodega, related_name='entradas_mercancia_traslado', on_delete=models.PROTECT)
    movimiento_origen = models.OneToOneField(MovimientoInventario, related_name='traslado_entrega',
                                             on_delete=models.PROTECT, null=True, blank=True)
    movimiento_destino = models.OneToOneField(MovimientoInventario, related_name='traslado_recibe',
                                              on_delete=models.PROTECT, null=True, blank=True)

    class Meta:
        permissions = [
            ['list_trasladoinventario', 'Puede listar traslados inventario'],
            ['detail_trasladoinventario', 'Puede ver detalle traslados inventario'],
        ]


class TrasladoInventarioDetalle(models.Model):
    traslado = models.ForeignKey(TrasladoInventario, on_delete=models.PROTECT, related_name='detalles')
    producto = models.ForeignKey(Producto, related_name='mis_traslados', on_delete=models.PROTECT)
    cantidad = models.DecimalField(max_digits=12, decimal_places=2)
