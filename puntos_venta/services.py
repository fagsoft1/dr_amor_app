from django.contrib.auth.models import User
from rest_framework import serializers

from puntos_venta.models import PuntoVenta, PuntoVentaTurno


def punto_venta_abrir(
        usuario_pv_id: int,
        punto_venta_id: int
) -> [PuntoVenta, PuntoVentaTurno]:
    punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    usuario = User.objects.get(pk=usuario_pv_id)
    if punto_venta.abierto:
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
    if punto_venta_turno:
        raise serializers.ValidationError(
            {
                '_error': 'Este usuario ya tiene un turno abierto y debe cerrarlo primero antes de abrir otro turno. El turno esta abierto en el punto de venta %s' % punto_venta_turno.punto_venta.nombre}
        )
    punto_venta_turno = PuntoVentaTurno.objects.create(usuario=usuario, punto_venta=punto_venta)

    punto_venta.abierto = True
    punto_venta.usuario_actual = User.objects.get(pk=usuario_pv_id)
    punto_venta.save()
    return punto_venta, punto_venta_turno


def punto_venta_cerrar(
        usuario_pv_id: int,
        punto_venta_id: int
) -> PuntoVenta:
    punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    if punto_venta.usuario_actual.id != usuario_pv_id:
        usuario = User.objects.get(pk=usuario_pv_id)
        raise serializers.ValidationError(
            {
                '_error': 'El usuario que intenta cerrar este punto de venta no es el mismo que lo tiene actualmente abierto. Quien lo tiene abierto es %s' % usuario.username}
        )
    if not punto_venta.abierto:
        raise serializers.ValidationError({'_error': 'Este punto de venta ya esta cerrado'})
    # TODO: Validar si esta en la lista de los colaboradores validos para este punto venta
    punto_venta.abierto = False
    punto_venta.usuario_actual = None
    punto_venta.save()
    return punto_venta
