from django.contrib.auth.models import User
from django.db.models import Sum, F
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import serializers

from puntos_venta.models import PuntoVenta, PuntoVentaTurno


def punto_venta_abrir(
        usuario_pv_id: int,
        saldo_cierre_caja_anterior: float,
        base_inicial_efectivo: float,
        punto_venta_id: int,
) -> [PuntoVenta, PuntoVentaTurno]:
    punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    usuario = User.objects.get(pk=usuario_pv_id)
    if punto_venta.abierto and usuario != punto_venta.usuario_actual:
        raise serializers.ValidationError({'_error': 'Este punto de venta ya esta abierto'})
    if punto_venta.usuario_actual and punto_venta.usuario_actual.id != usuario_pv_id:
        raise serializers.ValidationError(
            {'_error': 'Este punto de venta ya esta abierto por %s' % punto_venta.usuario_actual.username})
    if not hasattr(usuario, 'tercero'):
        raise serializers.ValidationError({'_error': 'No se puede abrir un punto de venta a un usuario sin tercero'})
    if not usuario.tercero.es_colaborador:
        raise serializers.ValidationError(
            {'_error': 'No se puede abrir un punto de venta a alguien que no sea colaborador'}
        )
    if not usuario.tercero.presente:
        raise serializers.ValidationError(
            {'_error': 'No se puede abrir un punto de venta a un colaborador que no este presente'}
        )
    # TODO: Validar si esta en la lista de los colaboradores validos para este punto venta

    punto_venta_turno = usuario.tercero.turno_punto_venta_abierto
    if punto_venta_turno and punto_venta_turno.punto_venta != punto_venta:
        raise serializers.ValidationError(
            {
                '_error': 'Este usuario ya tiene un turno abierto y debe cerrarlo primero antes de abrir otro turno. El turno esta abierto en el punto de venta %s' % punto_venta_turno.punto_venta.nombre}
        )
    if not punto_venta_turno:
        if hasattr(usuario, 'tercero'):
            punto_venta_turno = PuntoVentaTurno.objects.create(
                usuario=usuario,
                punto_venta=punto_venta,
                saldo_cierre_caja_anterior=saldo_cierre_caja_anterior,
                base_inicial_efectivo=base_inicial_efectivo
            )
            if base_inicial_efectivo > 0:
                from cajas.services import transaccion_caja_registrar_ingreso_base_inicial_apertura_caja
                transaccion_caja_registrar_ingreso_base_inicial_apertura_caja(
                    punto_venta_turno_id=punto_venta_turno.id,
                    valor_efectivo=base_inicial_efectivo
                )
            if saldo_cierre_caja_anterior > 0:
                from cajas.services import transaccion_caja_registrar_ingreso_saldo_cierre_anterior_apertura_caja
                transaccion_caja_registrar_ingreso_saldo_cierre_anterior_apertura_caja(
                    punto_venta_turno_id=punto_venta_turno.id,
                    valor_efectivo=saldo_cierre_caja_anterior
                )

    punto_venta.abierto = True
    punto_venta.usuario_actual = User.objects.get(pk=usuario_pv_id)
    punto_venta.save()
    return punto_venta, punto_venta_turno


def punto_venta_cerrar(
        usuario_pv_id: int,
        valor_dinero_efectivo: float,
        valor_tarjeta: float,
        nro_vauchers: int
) -> PuntoVenta:
    total_entregado = valor_dinero_efectivo + valor_tarjeta
    usuario = User.objects.get(pk=usuario_pv_id)
    if hasattr(usuario, 'tercero'):
        tercero = usuario.tercero
        punto_venta_turno = tercero.turno_punto_venta_abierto
        if punto_venta_turno:
            transacciones_egresos = punto_venta_turno.transacciones_caja.filter(
                punto_venta_turno_id=punto_venta_turno.id,
                tipo='E'
            )
            transacciones_ingresos = punto_venta_turno.transacciones_caja.filter(
                punto_venta_turno_id=punto_venta_turno.id,
                tipo='I'
            )
            total_egreso = transacciones_egresos.aggregate(
                total=Coalesce(Sum(F('valor_efectivo') + F('valor_tarjeta')), 0)
            )['total']

            total_ingreso = transacciones_ingresos.aggregate(
                total=Coalesce(Sum(F('valor_efectivo') + F('valor_tarjeta')), 0)
            )['total']

            print('Total ingreso efectivo %s' % total_ingreso)
            print('Total egreso efectivo %s' % total_egreso)

            punto_venta = punto_venta_turno.punto_venta
            punto_venta.abierto = False
            punto_venta.usuario_actual = None
            punto_venta.save()
            punto_venta_turno.finish = timezone.now()
            punto_venta_turno.saldo_cierre_caja = total_ingreso - total_egreso - total_entregado
            punto_venta_turno.save()
        else:
            raise serializers.ValidationError(
                {'_error': 'Este tercero no posee ningún punto de venta abierto actualmente'}
            )
    else:
        raise serializers.ValidationError(
            {
                '_error': 'El usuario no tiene un tercero relacionado, por ende, no tiene ningún punto de venta que cerrar'}
        )
    return punto_venta
