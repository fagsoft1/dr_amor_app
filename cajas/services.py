from django.db.models import Sum, F
from rest_framework import serializers

from cajas.models import TransaccionCaja


def transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo(
        usuario_pdv_id: int,
        servicio_id: int,
        categoria_fraccion_tiempo_nueva_id: int,
        valor_efectivo: float,
) -> TransaccionCaja:
    from django.contrib.auth.models import User
    from servicios.models import Servicio
    from terceros_acompanantes.models import CategoriaFraccionTiempo

    if valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es %s' % (
                    valor_efectivo)}
        )

    servicio = Servicio.objects.get(pk=servicio_id)
    categoria_fraccion_tiempo = CategoriaFraccionTiempo.objects.get(id=categoria_fraccion_tiempo_nueva_id)
    minutos = categoria_fraccion_tiempo.fraccion_tiempo.minutos
    valor_nuevo = categoria_fraccion_tiempo.valor
    diferencia = valor_nuevo - servicio.valor_servicio

    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno=turno_punto_venta,
        tipo='E',
        tipo_dos='SERVICIO',
        concepto='Devolucion por disminución de tiempo de %s a %s minutos' % (servicio.tiempo_minutos, minutos),
        valor_efectivo=-valor_efectivo
    )
    transaccion.servicios.add(servicio)

    if valor_efectivo != -diferencia:
        raise serializers.ValidationError(
            {
                '_error': 'El valor ingresado de forma de pago es diferente a la devolución por el servicio. El Valor de la devolucion es %s, pero el pago en Efectivo= %s no coincide' % (
                    -diferencia, valor_efectivo)}
        )

    return transaccion


def transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo(
        usuario_pdv_id: int,
        servicio_id: int,
        categoria_fraccion_tiempo_nueva_id: int,
        valor_efectivo: float,
        valor_tarjeta: float,
        nro_autorizacion: str,
        franquicia: str
) -> TransaccionCaja:
    from django.contrib.auth.models import User
    from servicios.models import Servicio
    from terceros_acompanantes.models import CategoriaFraccionTiempo

    if valor_tarjeta < 0 or valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es %s y de la tarjeta es %s' % (
                    valor_efectivo, valor_tarjeta)}
        )

    servicio = Servicio.objects.get(pk=servicio_id)
    categoria_fraccion_tiempo = CategoriaFraccionTiempo.objects.get(id=categoria_fraccion_tiempo_nueva_id)
    minutos = categoria_fraccion_tiempo.fraccion_tiempo.minutos
    valor_nuevo = categoria_fraccion_tiempo.valor
    diferencia = valor_nuevo - servicio.valor_servicio

    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno=turno_punto_venta,
        tipo='I',
        tipo_dos='SERVICIO',
        concepto='Ingreso por extención de tiempo de %s a %s minutos' % (servicio.tiempo_minutos, minutos),
        valor_tarjeta=valor_tarjeta,
        valor_efectivo=valor_efectivo,
        nro_autorizacion=nro_autorizacion,
        franquicia=franquicia
    )
    transaccion.servicios.add(servicio)

    if valor_efectivo + valor_tarjeta != diferencia:
        raise serializers.ValidationError(
            {
                '_error': 'El valor ingresado de forma de pago es diferente al excedente pagado por el servicio. El Valor del excedente es %s, pero el pago en Efectivo= %s + Tarjeta= %s no coincide' % (
                    diferencia, valor_efectivo, valor_tarjeta)}
        )

    return transaccion


def transaccion_caja_registrar_pago_nuevos_servicios_habitacion(
        usuario_pdv_id: int,
        habitacion_id: int,
        array_servicios_id: list,
        valor_efectivo: float,
        valor_tarjeta: float,
        nro_autorizacion: str,
        franquicia: str
) -> TransaccionCaja:
    from django.contrib.auth.models import User
    from habitaciones.models import Habitacion
    from servicios.models import Servicio

    if valor_tarjeta < 0 or valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es %s y de la tarjeta es %s' % (
                    valor_efectivo, valor_tarjeta)}
        )

    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    habitacion = Habitacion.objects.get(pk=habitacion_id)
    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno=turno_punto_venta,
        tipo='I',
        tipo_dos='SERVICIO',
        concepto='Pago de servicios habitación %s' % habitacion.nombre,
        valor_tarjeta=valor_tarjeta,
        valor_efectivo=valor_efectivo,
        nro_autorizacion=nro_autorizacion,
        franquicia=franquicia
    )

    servicios = Servicio.objects.filter(id__in=array_servicios_id)
    transaccion.servicios.set(servicios)
    valor_total = transaccion.servicios.aggregate(
        valor=Sum(F('valor_habitacion') + F('valor_servicio') + F('valor_iva_habitacion'))
    )['valor']

    if valor_tarjeta + valor_efectivo != valor_total:
        raise serializers.ValidationError(
            {
                '_error': 'El valor ingresado de forma de pago es diferente al valor total de los servicios. El Valor de los servicios es %s, pero el pago en Efectivo= %s + Tarjeta= %s no coincide' % (
                    valor_total, valor_efectivo, valor_tarjeta)}
        )

    return transaccion


def transaccion_caja_registrar_anulacion_servicio(
        usuario_pdv_id: int,
        servicio_id: int,
        valor_efectivo: float,
        concepto: str
) -> TransaccionCaja:
    from django.contrib.auth.models import User
    from servicios.models import Servicio

    if valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo debe ser igual o mayor a 0. El valor del efectivo es %s' % (
                    valor_efectivo)}
        )

    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno=turno_punto_venta,
        tipo='E',
        tipo_dos='SERVICIO',
        concepto='Anulación de servicio por: "%s"' % concepto,
        valor_tarjeta=0,
        valor_efectivo=-valor_efectivo,
        nro_autorizacion='',
        franquicia=''
    )
    servicio = Servicio.objects.get(pk=servicio_id)
    transaccion.servicios.add(servicio)

    if valor_efectivo != servicio.valor_total:
        raise serializers.ValidationError(
            {
                '_error': 'El valor ingresado de la devolucion es diferente al valor del servicio. El de la devolución es %s, pero el pago en Efectivo= %s' % (
                    servicio.valor_total, valor_efectivo)}
        )

    return transaccion


def transaccion_caja_registrar_cambio_habitacion_mayor_valor(
        usuario_pdv_id: int,
        habitacion_nueva_id: int,
        habitacion_anterior_id: int,
        array_servicios_id: list,
        valor_efectivo: float,
        valor_tarjeta: float,
        nro_autorizacion: str,
        franquicia: str
) -> TransaccionCaja:
    from django.contrib.auth.models import User
    from servicios.models import Servicio
    from habitaciones.models import Habitacion

    if valor_tarjeta < 0 or valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es %s y de la tarjeta es %s' % (
                    valor_efectivo, valor_tarjeta)}
        )

    habitacion_anterior = Habitacion.objects.get(pk=habitacion_anterior_id)
    habitacion_nueva = Habitacion.objects.get(pk=habitacion_nueva_id)

    habitacion_anterior_valor = habitacion_anterior.tipo.valor
    habitacion_nueva_valor = habitacion_nueva.tipo.valor

    diferencia = habitacion_nueva_valor - habitacion_anterior_valor
    total_diferencia = diferencia * len(array_servicios_id)

    if total_diferencia != valor_efectivo + valor_tarjeta:
        raise serializers.ValidationError(
            {
                '_error': 'El valor ingresado del pago del faltante, entre efectivo y tarjetas es diferente al requerido para cambiar de habitación. Valor requerido: %s. Valor ingresado: %s' % (
                    total_diferencia,
                    valor_efectivo + valor_tarjeta
                )
            }
        )

    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno=turno_punto_venta,
        tipo='I',
        tipo_dos='SERVICIO',
        concepto='Ingreso por cambio de la habitación %s a la habitación %s' % (
            habitacion_anterior.nombre, habitacion_nueva.nombre),
        valor_tarjeta=valor_tarjeta,
        valor_efectivo=valor_efectivo,
        nro_autorizacion=nro_autorizacion,
        franquicia=franquicia
    )
    servicios = Servicio.objects.filter(id__in=array_servicios_id)
    transaccion.servicios.set(servicios)
    return transaccion


def transaccion_caja_registrar_cambio_habitacion_menor_valor(
        usuario_pdv_id: int,
        habitacion_nueva_id: int,
        habitacion_anterior_id: int,
        array_servicios_id: list,
        valor_efectivo: float,
) -> TransaccionCaja:
    from django.contrib.auth.models import User
    from servicios.models import Servicio
    from habitaciones.models import Habitacion

    if valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo debe ser igual o mayor a 0. El valor del efectivo es %s' % (
                    valor_efectivo)}
        )

    habitacion_anterior = Habitacion.objects.get(pk=habitacion_anterior_id)
    habitacion_nueva = Habitacion.objects.get(pk=habitacion_nueva_id)

    habitacion_anterior_valor = habitacion_anterior.tipo.valor
    habitacion_nueva_valor = habitacion_nueva.tipo.valor

    diferencia = habitacion_nueva_valor - habitacion_anterior_valor
    total_diferencia = diferencia * len(array_servicios_id)

    if valor_efectivo != -total_diferencia:
        raise serializers.ValidationError(
            {
                '_error': 'El valor ingresado para la devolucion debe ser todo en efectivo. Valor devolucion: %s. Valor efectivo: %s' % (
                    -total_diferencia,
                    valor_efectivo
                )
            }
        )

    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno=turno_punto_venta,
        tipo='E',
        tipo_dos='SERVICIO',
        concepto='Devolución por cambio de la habitación %s a la habitación %s' % (
            habitacion_anterior.nombre, habitacion_nueva.nombre),
        valor_efectivo=-valor_efectivo
    )
    servicios = Servicio.objects.filter(id__in=array_servicios_id)
    transaccion.servicios.set(servicios)
    return transaccion
