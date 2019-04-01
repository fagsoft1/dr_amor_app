from decimal import Decimal

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import serializers

from productos.models import Producto
from .models import MovimientoInventario, MovimientoInventarioDetalle, TrasladoInventarioDetalle, TrasladoInventario, \
    Bodega


def movimiento_inventario_saldo_inicial_crear(
        fecha: timezone.datetime,
        bodega_destino_id: int,
        usuario_id
) -> MovimientoInventario:
    return MovimientoInventario.objects.create(
        fecha=fecha,
        bodega_id=bodega_destino_id,
        creado_por_id=usuario_id,
        detalle='Saldo Inicial',
        motivo='saldo_inicial',
        tipo='E',
        cargado=False
    )


def movimiento_inventario_compra_crear(
        fecha: timezone.datetime,
        proveedor_id: int,
        bodega_destino_id: int,
        usuario_id
) -> MovimientoInventario:
    return MovimientoInventario.objects.create(
        fecha=fecha,
        proveedor_id=proveedor_id,
        bodega_id=bodega_destino_id,
        creado_por_id=usuario_id,
        detalle='Entrada Mercancía x Compra',
        motivo='compra',
        tipo='E',
        cargado=False
    )


def movimiento_inventario_traslado_entrada_crear(
        bodega_destino_id: int,
        usuario_id: int,
        detalle: str
) -> MovimientoInventario:
    return MovimientoInventario.objects.create(
        fecha=timezone.datetime.now().date(),
        bodega_id=bodega_destino_id,
        creado_por_id=usuario_id,
        detalle=detalle,
        motivo='traslado',
        tipo='E',
        cargado=False
    )


def movimiento_inventario_traslado_salida_crear(
        bodega_origen_id: int,
        usuario_id: int,
        detalle: str
) -> MovimientoInventario:
    return MovimientoInventario.objects.create(
        fecha=timezone.datetime.now().date(),
        bodega_id=bodega_origen_id,
        creado_por_id=usuario_id,
        detalle=detalle,
        motivo='traslado',
        tipo='S',
        cargado=False
    )


def movimiento_inventario_entrada_ajuste_crear(
        bodega_destino_id: int,
        usuario_id,
        detalle
) -> MovimientoInventario:
    return MovimientoInventario.objects.create(
        fecha=timezone.datetime.now().date(),
        bodega_id=bodega_destino_id,
        creado_por_id=usuario_id,
        detalle='Entrada de Mercancia Ajuste x %s' % detalle,
        motivo='entrada_ajuste',
        tipo='E',
        cargado=False
    )


def movimiento_inventario_devolucion_crear(
        bodega_destino_id: int,
        usuario_id
) -> MovimientoInventario:
    return MovimientoInventario.objects.create(
        fecha=timezone.datetime.now().date(),
        bodega_id=bodega_destino_id,
        creado_por_id=usuario_id,
        detalle='Devolución de Producto',
        motivo='devolucion',
        tipo='E',
        cargado=False
    )


def movimiento_inventario_detalle_entrada_add_item(
        movimiento_id: int,
        producto_id: int,
        cantidad: float,
        costo_total: float
) -> MovimientoInventarioDetalle:
    movimiento = MovimientoInventario.objects.get(pk=movimiento_id)
    if movimiento.motivo == 'saldo_inicial':
        qs = MovimientoInventarioDetalle.objects.filter(
            producto_id=producto_id,
            movimiento__bodega_id=movimiento.bodega
        )
        if qs.exists():
            raise serializers.ValidationError(
                {'_error': 'Este producto ya tiene existencias, no puede crear saldo inicial de nuevo'}
            )
    if movimiento.tipo != 'E':
        raise serializers.ValidationError(
            {'_error': 'No se puede agregar un detalle tipo entrada en un movimiento tipo salida'}
        )
    return MovimientoInventarioDetalle.objects.create(
        movimiento_id=movimiento_id,
        producto_id=producto_id,
        entra_cantidad=cantidad,
        entra_costo=costo_total,
        costo_unitario=costo_total / cantidad
    )


def movimiento_inventario_venta_crear(
        bodega_origen_id: int,
        usuario_id
) -> MovimientoInventario:
    return MovimientoInventario.objects.create(
        fecha=timezone.datetime.now().date(),
        bodega_id=bodega_origen_id,
        creado_por_id=usuario_id,
        detalle='Salida de Mercancia x Venta',
        motivo='venta',
        tipo='S',
        cargado=False
    )


def movimiento_inventario_salida_ajuste_crear(
        bodega_origen_id: int,
        usuario_id: int,
        detalle: str
) -> MovimientoInventario:
    return MovimientoInventario.objects.create(
        fecha=timezone.datetime.now().date(),
        bodega_id=bodega_origen_id,
        creado_por_id=usuario_id,
        detalle='Salida de Mercancia x Ajuste x %s' % detalle,
        motivo='salida_ajuste',
        tipo='S',
        cargado=False
    )


def movimiento_inventario_detalle_salida_add_item(
        movimiento_id: int,
        producto_id: int,
        cantidad: float

) -> MovimientoInventarioDetalle:
    movimiento = MovimientoInventario.objects.get(pk=movimiento_id)
    if movimiento.tipo != 'S':
        raise serializers.ValidationError(
            {'_error': 'No se puede agregar un detalle tipo salida en un movimiento tipo entrada'}
        )
    return MovimientoInventarioDetalle.objects.create(
        movimiento_id=movimiento_id,
        producto_id=producto_id,
        sale_cantidad=cantidad
    )


def movimiento_inventario_aplicar_movimiento(movimiento_inventario_id: int) -> MovimientoInventario:
    movimiento_inventario = MovimientoInventario.objects.get(pk=movimiento_inventario_id)
    if movimiento_inventario.cargado:
        content = {'_error': 'Revisar, el movimiento ya ha sido cargado'}
        raise serializers.ValidationError(content)

    items = movimiento_inventario.detalles.all()
    [movimiento_inventario_detalle_calcular_costo_promedio(item.id) for item in items]
    movimiento_inventario.cargado = True
    movimiento_inventario.save()
    return movimiento_inventario


def movimiento_inventario_detalle_calcular_costo_promedio(
        movimiento_inventario_detalle_id: int
) -> MovimientoInventarioDetalle:
    movimiento_inventario_detalle = MovimientoInventarioDetalle.objects.get(pk=movimiento_inventario_detalle_id)
    qs = MovimientoInventarioDetalle.objects.exclude(
        id=movimiento_inventario_detalle_id
    ).filter(
        es_ultimo_saldo=True,
        producto=movimiento_inventario_detalle.producto,
        movimiento__bodega=movimiento_inventario_detalle.movimiento.bodega
    )
    ultimo_movimiento = qs.last()
    saldo_cantidad_nuevo = 0
    saldo_costo_nuevo = 0
    costo_unitario_nuevo = 0

    if movimiento_inventario_detalle.movimiento.tipo == 'E':
        cantidad_entra = movimiento_inventario_detalle.entra_cantidad
        costo_entra = movimiento_inventario_detalle.entra_costo
        costo_unitario_nuevo = costo_entra / cantidad_entra
        if ultimo_movimiento:
            saldo_cantidad_nuevo = cantidad_entra + ultimo_movimiento.saldo_cantidad
            saldo_costo_nuevo = costo_entra + ultimo_movimiento.saldo_costo
        else:
            saldo_cantidad_nuevo = movimiento_inventario_detalle.entra_cantidad
            saldo_costo_nuevo = movimiento_inventario_detalle.entra_costo

    if movimiento_inventario_detalle.movimiento.tipo == 'S':
        if not ultimo_movimiento:
            raise serializers.ValidationError(
                {'_error': 'No hay existencias de %s' % movimiento_inventario_detalle.producto.nombre})
        else:
            if movimiento_inventario_detalle.sale_cantidad > ultimo_movimiento.saldo_cantidad:
                raise serializers.ValidationError(
                    {'_error': 'No hay suficientes existencias de %s' % movimiento_inventario_detalle.producto.nombre})

        saldo_cantidad_nuevo = ultimo_movimiento.saldo_cantidad - movimiento_inventario_detalle.sale_cantidad
        saldo_costo_nuevo = ultimo_movimiento.saldo_costo - (
                movimiento_inventario_detalle.sale_cantidad * ultimo_movimiento.costo_unitario_promedio)
        movimiento_inventario_detalle.sale_costo = movimiento_inventario_detalle.sale_cantidad * ultimo_movimiento.costo_unitario_promedio
        costo_unitario_nuevo = ultimo_movimiento.costo_unitario_promedio

    for x in qs.all():
        x.es_ultimo_saldo = False
        x.save()

    movimiento_inventario_detalle.es_ultimo_saldo = True
    movimiento_inventario_detalle.saldo_cantidad = saldo_cantidad_nuevo
    movimiento_inventario_detalle.saldo_costo = saldo_costo_nuevo
    movimiento_inventario_detalle.costo_unitario = costo_unitario_nuevo
    movimiento_inventario_detalle.costo_unitario_promedio = saldo_costo_nuevo / saldo_cantidad_nuevo if saldo_cantidad_nuevo else 0
    movimiento_inventario_detalle.save()
    return movimiento_inventario_detalle


def traslado_inventario_set_estado_esperando_traslado(
        traslado_inventario_id: int,
        usuario_id: int
) -> TrasladoInventario:
    traslado = TrasladoInventario.objects.get(pk=traslado_inventario_id)
    if traslado.creado_por.id != usuario_id:
        raise serializers.ValidationError(
            {
                '_error': 'Sólo el usuario que creo el traslado puede solicitar que se realice traslado'}
        )
    traslado.estado = 2
    traslado.save()
    return traslado


def traslado_inventario_set_estado_Iniciado(
        traslado_inventario_id: int,
        usuario_id: int
) -> TrasladoInventario:
    traslado = TrasladoInventario.objects.get(pk=traslado_inventario_id)
    if traslado.estado == 3:
        raise serializers.ValidationError(
            {
                '_error': 'Un traslado ya verificado no se puede editar'}
        )
    if traslado.creado_por.id != usuario_id:
        raise serializers.ValidationError(
            {
                '_error': 'Sólo el usuario que creo el traslado puede editar el traslado'}
        )
    traslado.estado = 1
    traslado.save()
    return traslado


def traslado_inventario_crear(
        usuario_crea_id: int,
        bodega_origen_id: int,
        bodega_destino_id: int
) -> TrasladoInventario:
    bodega_origen = Bodega.objects.get(pk=bodega_origen_id)
    if not bodega_origen.es_principal:
        pdv_origen = bodega_origen.punto_venta
        if not pdv_origen.usuario_actual or not pdv_origen.abierto:
            raise serializers.ValidationError(
                {
                    '_error': 'Para realizar traslado desde una bodega que no es principal, debe de haber alguien en el punto de venta para crearlo. Actualmente no hay nadie'}
            )
        usuario_origen = pdv_origen.usuario_actual
        if usuario_origen and (not usuario_origen.tercero.presente or usuario_origen.id != usuario_crea_id):
            raise serializers.ValidationError(
                {
                    '_error': 'Sólo el usuario de la bodega origen puede crear un traslado desde su lugar'}
            )

    bodega_destino = Bodega.objects.get(pk=bodega_destino_id)
    if not bodega_destino.es_principal:
        pdv_destino = bodega_destino.punto_venta
        if not pdv_destino.usuario_actual or not pdv_destino.abierto:
            raise serializers.ValidationError(
                {
                    '_error': 'Para realizar traslado a una bodega que no es principal, debe de haber alguien en el para recibirlo. Actualmente no hay nadie'}
            )
    return TrasladoInventario.objects.create(
        creado_por_id=usuario_crea_id,
        bodega_destino_id=bodega_destino_id,
        bodega_origen_id=bodega_origen_id,
        estado=1,
        trasladado=False
    )


def traslado_inventario_adicionar_item(
        traslado_inventario_id: int,
        producto_id: int,
        cantidad: float,
        traslado_item_id: int = None
) -> TrasladoInventarioDetalle:
    traslado_inventario = TrasladoInventario.objects.get(pk=traslado_inventario_id)
    bodega_origen = traslado_inventario.bodega_origen

    if not MovimientoInventarioDetalle.objects.filter(
            producto_id=producto_id,
            movimiento__bodega_id=bodega_origen,
            es_ultimo_saldo=True
    ).exists():
        producto = Producto.objects.get(pk=producto_id)
        raise serializers.ValidationError({'_error': 'No hay existencias de producto %s' % producto.nombre})

    inventario_producto = MovimientoInventarioDetalle.objects.get(
        producto_id=producto_id,
        movimiento__bodega_id=bodega_origen,
        es_ultimo_saldo=True
    )
    if inventario_producto.saldo_cantidad < cantidad:
        raise serializers.ValidationError({
            '_error': 'No hay existencias suficientes del producto seleccionado. Solo hay %s de %s y usted pide trasladar %s' % (
                inventario_producto.saldo_cantidad, inventario_producto.producto.nombre,
                cantidad)
        })

    if not traslado_item_id:
        return TrasladoInventarioDetalle.objects.create(
            traslado_id=traslado_inventario_id,
            producto_id=producto_id,
            cantidad=cantidad
        )
    else:
        traslado_item = TrasladoInventarioDetalle.objects.get(pk=traslado_item_id)
        traslado_item.cantidad = cantidad
        traslado_item.save()
        return traslado_item


def traslado_inventario_realizar_traslado(
        traslado_inventario_id: int,
        usuario_id: int
) -> TrasladoInventario:
    traslado_inventario = TrasladoInventario.objects.get(pk=traslado_inventario_id)
    if traslado_inventario.trasladado:
        raise serializers.ValidationError({'_error': 'El traslado ya se ha efectuado, revisar'})
    else:
        usuario = User.objects.get(pk=usuario_id)
        bodega_destino = traslado_inventario.bodega_destino
        if hasattr(bodega_destino, 'punto_venta'):
            if bodega_destino.punto_venta.usuario_actual.id != usuario_id:
                raise serializers.ValidationError(
                    {
                        '_error': 'El traslado a esta bodega sólamente puede realizarlo %s' % bodega_destino.punto_venta.usuario_actual.username
                    }
                )
        movimiento_origen = movimiento_inventario_traslado_salida_crear(
            bodega_origen_id=traslado_inventario.bodega_origen.id,
            usuario_id=traslado_inventario.creado_por.id,
            detalle='Salida de Mercancia x Traslado a bodega %s' % traslado_inventario.bodega_destino.nombre
        )
        movimiento_destino = movimiento_inventario_traslado_entrada_crear(
            bodega_destino_id=traslado_inventario.bodega_destino.id,
            usuario_id=traslado_inventario.creado_por.id,
            detalle='Entrada de Mercancia x Traslado desde bodega %s' % traslado_inventario.bodega_origen.nombre,
        )
        traslado_inventario.movimiento_origen = movimiento_origen
        traslado_inventario.movimiento_destino = movimiento_destino
        traslado_inventario.trasladado = True
        traslado_inventario.estado = 3
        traslado_inventario.save()
        [traslado_inventario_detalle_retirar_de_origen(x.id) for x in traslado_inventario.detalles.all()]
        movimiento_inventario_aplicar_movimiento(movimiento_origen.id)

        [traslado_inventario_detalle_ingresa_al_destino(traslado_inventario_id, x.id) for x in
         movimiento_origen.detalles.all()]

        movimiento_inventario_aplicar_movimiento(movimiento_destino.id)

        traslado_inventario.recibido_por = usuario
        traslado_inventario.save()
        return traslado_inventario


def traslado_inventario_detalle_retirar_de_origen(
        traslado_inventario_detalle_id: int
) -> TrasladoInventarioDetalle:
    item_inventario = TrasladoInventarioDetalle.objects.get(pk=traslado_inventario_detalle_id)
    if item_inventario.cantidad > 0:
        saldo_origen = MovimientoInventarioDetalle.objects.filter(
            es_ultimo_saldo=True,
            movimiento__bodega=item_inventario.traslado.bodega_origen,
            producto=item_inventario.producto
        ).first()
        cantidad_a_trasladar = Decimal(
            min(item_inventario.cantidad, saldo_origen.saldo_cantidad))

        movimiento_inventario_detalle_salida_add_item(
            movimiento_id=item_inventario.traslado.movimiento_origen.id,
            cantidad=cantidad_a_trasladar,
            producto_id=item_inventario.producto.id
        )
        item_inventario.cantidad_realmente_trasladada = cantidad_a_trasladar
        item_inventario.save()
    else:
        item_inventario.delete()
    return item_inventario


def traslado_inventario_detalle_ingresa_al_destino(
        traslado_inventario_id: int,
        movimiento_origen_detalle_id: int
):
    traslado_inventario = TrasladoInventario.objects.get(pk=traslado_inventario_id)
    movimiento_origen_detalle = MovimientoInventarioDetalle.objects.get(pk=movimiento_origen_detalle_id)

    traslado_inventario_detalle = movimiento_inventario_detalle_entrada_add_item(
        movimiento_id=traslado_inventario.movimiento_destino.id,
        producto_id=movimiento_origen_detalle.producto.id,
        cantidad=movimiento_origen_detalle.sale_cantidad,
        costo_total=movimiento_origen_detalle.sale_costo
    )
    return traslado_inventario_detalle
