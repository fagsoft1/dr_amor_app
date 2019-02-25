import datetime

from decimal import Decimal
from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel

from terceros.models import Tercero, Cuenta
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
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    proveedor = models.ForeignKey(Tercero, related_name='movimientos_inventarios', on_delete=models.PROTECT, null=True)
    bodega = models.ForeignKey(Bodega, on_delete=models.PROTECT, related_name='movimientos')
    motivo = models.TextField(null=True)
    detalle = models.TextField(null=True)
    tipo = models.CharField(max_length=2, null=True)
    cargado = models.BooleanField(default=False)
    observacion = models.TextField(null=True)
    cuenta = models.ForeignKey(Cuenta, on_delete=models.PROTECT, related_name='compra_tienda', null=True)

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
    precio_venta_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        unique_together = [('movimiento', 'producto')]

    def calcular_costo_promedio(self):
        qs = MovimientoInventarioDetalle.objects.exclude(
            id=self.id
        ).filter(
            es_ultimo_saldo=True,
            producto=self.producto,
            movimiento__bodega=self.movimiento.bodega
        )
        ultimo_movimiento = qs.last()
        saldo_cantidad_nuevo = 0
        saldo_costo_nuevo = 0
        costo_unitario_nuevo = 0

        if self.movimiento.tipo == 'EA':
            if ultimo_movimiento:
                saldo_cantidad_nuevo = ultimo_movimiento.saldo_cantidad + self.entra_cantidad
                saldo_costo_nuevo = ultimo_movimiento.saldo_costo + (
                        ultimo_movimiento.costo_unitario * self.entra_cantidad)
                costo_unitario_nuevo = ultimo_movimiento.costo_unitario

        if self.movimiento.tipo == 'E':
            cantidad_entra = self.entra_cantidad
            costo_entra = self.entra_costo
            if ultimo_movimiento:
                saldo_cantidad_nuevo = cantidad_entra + ultimo_movimiento.saldo_cantidad
                saldo_costo_nuevo = costo_entra + ultimo_movimiento.saldo_costo
                costo_unitario_nuevo = saldo_costo_nuevo / saldo_cantidad_nuevo
            else:
                saldo_cantidad_nuevo = self.entra_cantidad
                saldo_costo_nuevo = self.entra_costo
                costo_unitario_nuevo = costo_entra / cantidad_entra

        if self.movimiento.tipo == 'S' or self.movimiento.tipo == 'SA':
            saldo_cantidad_nuevo = ultimo_movimiento.saldo_cantidad - self.sale_cantidad
            saldo_costo_nuevo = ultimo_movimiento.saldo_costo - (self.sale_cantidad * ultimo_movimiento.costo_unitario)
            costo_unitario_nuevo = ultimo_movimiento.costo_unitario
            self.sale_costo = self.sale_cantidad * ultimo_movimiento.costo_unitario

        for x in qs.all():
            x.es_ultimo_saldo = False
            x.save()

        self.es_ultimo_saldo = True
        self.saldo_cantidad = saldo_cantidad_nuevo
        self.saldo_costo = saldo_costo_nuevo
        self.costo_unitario = costo_unitario_nuevo
        self.save()


class TrasladoInventario(models.Model):
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True)
    bodega_origen = models.ForeignKey(Bodega, related_name='salidas_mercancia_traslado', on_delete=models.PROTECT)
    bodega_destino = models.ForeignKey(Bodega, related_name='entradas_mercancia_traslado', on_delete=models.PROTECT)
    movimiento_origen = models.OneToOneField(MovimientoInventario, related_name='traslado_entrega',
                                             on_delete=models.PROTECT, null=True, blank=True)
    movimiento_destino = models.OneToOneField(MovimientoInventario, related_name='traslado_recibe',
                                              on_delete=models.PROTECT, null=True, blank=True)
    trasladado = models.BooleanField(default=False)

    def realizar_traslado(self):
        if not self.trasladado:
            movimiento_origen = MovimientoInventario(
                bodega=self.bodega_origen,
                creado_por=self.creado_por,
                fecha=datetime.datetime.now(),
                tipo='S',
                detalle='Traslado a bodega %s' % self.bodega_destino.nombre,
                motivo='traslado_salida'
            )
            movimiento_origen.save()
            movimiento_destino = MovimientoInventario(
                bodega=self.bodega_destino,
                creado_por=self.creado_por,
                fecha=datetime.datetime.now(),
                tipo='E',
                detalle='Traslado desde bodega %s' % self.bodega_origen.nombre,
                motivo='traslado_entrada'
            )
            movimiento_destino.save()
            self.movimiento_origen = movimiento_origen
            self.movimiento_destino = movimiento_destino
            self.trasladado = True
            self.save()
            [x.retirar_de_origen() for x in self.detalles.all()]
            movimiento_destino.cargado = True
            movimiento_destino.save()
            movimiento_origen.cargado = True
            movimiento_origen.save()

    class Meta:
        permissions = [
            ['list_trasladoinventario', 'Puede listar traslados inventario'],
            ['detail_trasladoinventario', 'Puede ver detalle traslados inventario'],
        ]


class TrasladoInventarioDetalle(models.Model):
    traslado = models.ForeignKey(TrasladoInventario, on_delete=models.PROTECT, related_name='detalles')
    producto = models.ForeignKey(Producto, related_name='mis_traslados', on_delete=models.PROTECT)
    cantidad = models.DecimalField(max_digits=12, decimal_places=2)
    cantidad_realmente_trasladada = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        unique_together = [('traslado', 'producto')]

    def retirar_de_origen(self):
        if self.cantidad > 0:
            movimiento_saldo_origen = MovimientoInventarioDetalle.objects.filter(
                es_ultimo_saldo=True,
                movimiento__bodega=self.traslado.bodega_origen,
                producto=self.producto
            ).first()
            cantidad_a_trasladar = Decimal(min(self.cantidad, movimiento_saldo_origen.saldo_cantidad))

            costo_total = Decimal(movimiento_saldo_origen.costo_unitario * cantidad_a_trasladar)

            movimiento_origen_detalle = MovimientoInventarioDetalle(
                movimiento=self.traslado.movimiento_origen,
                producto=self.producto,
                sale_cantidad=cantidad_a_trasladar,
                sale_costo=costo_total,
                entra_cantidad=0,
                entra_costo=0,
                costo_unitario=0,
                saldo_costo=0,
                saldo_cantidad=0,
                es_ultimo_saldo=False
            )
            movimiento_origen_detalle.save()
            movimiento_origen_detalle.calcular_costo_promedio()
            self.cantidad_realmente_trasladada = cantidad_a_trasladar
            self.save()
            self.ingresa_al_destino(movimiento_origen_detalle)
        else:
            self.delete()

    def ingresa_al_destino(self, movimiento_origen_detalle):
        movimiento_destino_detalle = MovimientoInventarioDetalle(
            movimiento=self.traslado.movimiento_destino,
            producto=movimiento_origen_detalle.producto,
            sale_cantidad=0,
            sale_costo=0,
            entra_cantidad=movimiento_origen_detalle.sale_cantidad,
            entra_costo=movimiento_origen_detalle.sale_costo,
            costo_unitario=0,
            saldo_costo=0,
            saldo_cantidad=0,
            es_ultimo_saldo=False
        )
        movimiento_destino_detalle.save()
        movimiento_destino_detalle.calcular_costo_promedio()
