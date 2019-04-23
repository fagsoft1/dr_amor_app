from decimal import Decimal

from django.db.models import Sum
from django.template.loader import get_template
from rest_framework import serializers
from weasyprint import CSS, HTML

from ventas.models import VentaProducto


def venta_producto_crear(
        punto_venta_turno_id: int,
        cuenta_id: int = None
) -> VentaProducto:
    from terceros.models import Cuenta
    from puntos_venta.models import PuntoVentaTurno
    punto_venta_turno = PuntoVentaTurno.objects.get(pk=punto_venta_turno_id)
    if punto_venta_turno.finish:
        raise serializers.ValidationError(
            {'_error': 'El turno del punto de venta que crea la venta debe estar abierto'})

    if cuenta_id:
        cuenta = Cuenta.objects.get(pk=cuenta_id)
        if not cuenta.propietario.tercero.presente:
            raise serializers.ValidationError(
                {'_error': 'El usuario al que se le crea la venta debe de estar presente'})
        return VentaProducto.objects.create(
            punto_venta_turno_id=punto_venta_turno_id,
            cuenta_id=cuenta_id
        )
    else:
        return VentaProducto.objects.create(
            punto_venta_turno_id=punto_venta_turno_id
        )


def venta_producto_generar_comprobante_venta(venta_producto_id):
    venta_producto = VentaProducto.objects.get(pk=venta_producto_id)
    context = {
        "venta_producto": venta_producto
    }
    html_get_template = get_template('recibos/ventas/ventas_productos_comprobante.html').render(context)
    html = HTML(
        string=html_get_template
    )
    width = '80mm'
    height = '10cm'
    size = 'size: %s %s' % (width, height)
    margin = 'margin: 0.8cm 0.8cm 0.8cm 0.8cm'

    css_string = '@page {text-align: justify; font-family: Arial;font-size: 0.6rem;%s;%s}' % (size, margin)
    main_doc = html.render(stylesheets=[CSS(string=css_string)])
    return main_doc


def venta_producto_efectuar_venta(
        punto_venta_id: int,
        usuario_pdv_id: int,
        tipo_venta: int,
        pedidos: list,
        cliente_usuario_id: int = None,
        cliente_qr_codigo: str = None,
        pago_efectivo: float = 0

) -> VentaProducto:
    from puntos_venta.models import PuntoVenta
    from terceros.models import Tercero
    from inventarios.models import MovimientoInventarioDetalle
    from ventas.models import VentaProductoDetalle
    from inventarios.services import (
        movimiento_inventario_venta_crear,
        movimiento_inventario_detalle_salida_add_item,
        movimiento_inventario_aplicar_movimiento
    )

    punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    punto_venta_turno = punto_venta.usuario_actual.tercero.turno_punto_venta_abierto
    bodega = punto_venta.bodega

    if tipo_venta == 3 or tipo_venta == 2:
        tercero = Tercero.objects.get(usuario_id=cliente_usuario_id, qr_acceso=cliente_qr_codigo)
        if tipo_venta == 2:  # Venta en mesero
            if tercero.es_acompanante:
                raise serializers.ValidationError({'_error': 'No se puede crear una venta mesero a una acompañante'})
            venta = venta_producto_crear(
                punto_venta_turno_id=punto_venta_turno.id,
                cuenta_id=tercero.cuenta_abierta_mesero.id
            )
        else:  # Venta colaborador o acompañante
            venta = venta_producto_crear(
                punto_venta_turno_id=punto_venta_turno.id,
                cuenta_id=tercero.cuenta_abierta.id
            )
    elif tipo_venta == 1:  # Venta en efectivo
        venta = venta_producto_crear(
            punto_venta_turno_id=punto_venta_turno.id
        )
    else:
        venta = None

    if not venta:
        raise serializers.ValidationError({'_error': 'No hay ninguna venta de este tipo'})

    movimiento_venta = movimiento_inventario_venta_crear(
        bodega_origen_id=bodega.id,
        usuario_id=usuario_pdv_id
    )

    for item in pedidos:
        producto_id = item.get('producto_id')
        cantidad = item.get('cantidad')

        saldo_producto = MovimientoInventarioDetalle.objects.filter(
            producto_id=producto_id,
            es_ultimo_saldo=True,
            movimiento__bodega=bodega
        )
        if not saldo_producto.exists():
            raise serializers.ValidationError(
                {'_error': 'No existe en el inventario el item de código %s' % producto_id}
            )
        saldo_producto = saldo_producto.first()

        if saldo_producto.saldo_cantidad < cantidad:
            raise serializers.ValidationError(
                {'_error': 'No hay suficientes existencias del producto %s. Usted solicita %s y solo hay %s' % (
                    saldo_producto.producto.nombre, cantidad, saldo_producto.saldo_cantidad)})

        movimiento_inventario_detalle_salida_add_item(
            movimiento_id=movimiento_venta.id,
            producto_id=producto_id,
            cantidad=cantidad
        )

    movimiento_venta = movimiento_inventario_aplicar_movimiento(movimiento_venta.id)
    venta.movimientos.add(movimiento_venta)
    detalles_movimiento = movimiento_venta.detalles.all()

    for item in pedidos:
        producto_id = item.get('producto_id')
        item_movimiento_detalle = detalles_movimiento.get(producto_id=producto_id)
        precio_total = item.get('precio_total')
        VentaProductoDetalle.objects.create(
            venta_id=venta.id,
            producto_id=producto_id,
            cantidad=item_movimiento_detalle.sale_cantidad,
            precio_total=precio_total,
            precio_unitario=(precio_total / item_movimiento_detalle.sale_cantidad),
            costo_total=item_movimiento_detalle.sale_costo,
            costo_unitario=item_movimiento_detalle.costo_unitario_promedio
        )

    if tipo_venta == 1:
        valor_venta = venta.productos.aggregate(
            precio_total=Sum('precio_total')
        )['precio_total']
        if int(Decimal(pago_efectivo)) != int(Decimal(valor_venta)):
            raise serializers.ValidationError({
                '_error': 'El valor del pago no coincide con el valor de la compra. El valor de la compra es %s y el del efectivo fue %s' % (
                    valor_venta, pago_efectivo)})
        from cajas.services import transaccion_caja_registrar_venta_product_efectivo_ingreso
        transaccion_caja_registrar_venta_product_efectivo_ingreso(
            punto_venta_turno_id=punto_venta_turno.id,
            valor_efectivo=Decimal(pago_efectivo),
            venta_id=venta.id
        )
    return venta
