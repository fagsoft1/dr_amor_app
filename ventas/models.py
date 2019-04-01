from django.db import models
from django.contrib.auth.models import User
from model_utils.models import TimeStampedModel

from habitaciones.models import Habitacion
from puntos_venta.models import PuntoVenta, PuntoVentaTurno
from productos.models import Producto
from terceros.models import Cuenta
from inventarios.models import MovimientoInventario
from ventas.managers import VentasProductosManager
from parqueadero.models import Vehiculo, RegistroEntradaParqueo


class VentaProducto(TimeStampedModel):
    punto_venta_turno = models.ForeignKey(PuntoVentaTurno, on_delete=models.PROTECT, related_name='ventas_productos')
    cuenta = models.ForeignKey(Cuenta, on_delete=models.PROTECT, related_name='compras_productos', null=True)
    movimientos = models.ManyToManyField(MovimientoInventario, related_name='ventas_productos')
    transacciones_caja = models.ManyToManyField('cajas.TransaccionCaja', related_name='ventas_productos')

    objects = VentasProductosManager()

    class Meta:
        permissions = [
            ['list_ventaproducto', 'Puede listar ventas productos'],
        ]


class VentaProductoDetalle(TimeStampedModel):
    venta = models.ForeignKey(VentaProducto, on_delete=models.PROTECT, related_name='productos')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, related_name='ventas')
    cantidad = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    costo_unitario = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    costo_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    precio_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    comision = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cuenta_comision = models.ForeignKey(Cuenta, on_delete=models.PROTECT, related_name='comisiones_x_productos',
                                        null=True)

    class Meta:
        permissions = [
            ['list_ventaproductodetalle', 'Puede listar ventas productos detalles'],
        ]
