from typing import Optional

from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Habitacion


def habitacion_terminar_servicios(
        habitacion_id: int,
        usuario_pdv_id: int
) -> Habitacion:
    from servicios.services import servicio_terminar
    habitacion = Habitacion.objects.get(pk=habitacion_id)
    if habitacion.estado == 1:
        servicios = habitacion.servicios.filter(estado=1)
        [
            servicio_terminar(
                servicio_id=servicio.id,
                usuario_pdv_id=usuario_pdv_id
            ) for
            servicio in servicios.all().order_by('-id')
        ]
        habitacion = habitacion_cambiar_estado(habitacion_id, 2)
        return habitacion
    else:
        mensaje_error = {'_error': 'No hay servicios para terminar en la habitación número %s.' % (habitacion.numero)}
        raise serializers.ValidationError(mensaje_error)


def habitacion_cambiar_estado(
        habitacion_id: int,
        nuevo_estado: int
) -> Habitacion:
    habitacion = Habitacion.objects.get(pk=habitacion_id)
    estado_actual = habitacion.estado

    if habitacion.estado != nuevo_estado:
        temp_estado = None
        if estado_actual == 0:
            if nuevo_estado in [1, 2, 3]:
                temp_estado = nuevo_estado
        elif estado_actual == 1:
            tiene_servicios_en_proceso = habitacion.servicios.filter(estado=1).exists()
            if nuevo_estado == 2 and not tiene_servicios_en_proceso:
                temp_estado = nuevo_estado
        elif estado_actual == 2:
            if nuevo_estado in [0, 3]:
                temp_estado = nuevo_estado
            else:
                raise serializers.ValidationError({'_error': 'No se puede cambiar de un estado sucia a uno ocupado'})
        elif estado_actual == 3:
            if nuevo_estado in [0, 2]:
                temp_estado = nuevo_estado
            else:
                raise serializers.ValidationError(
                    {'_error': 'No se puede cambiar de un estado de mantenimiento a uno ocupado'}
                )

        if temp_estado in [0, 1, 2, 3]:
            habitacion.estado = temp_estado
            habitacion.fecha_ultimo_estado = timezone.now()
            habitacion.save()
    return habitacion


def habitacion_cambiar_servicios_de_habitacion(
        habitacion_nueva_id: int,
        habitacion_anterior_id: int,
        servicios_array_id: list,
        punto_venta_id: int,
        usuario_id: int,
        valor_efectivo: float,
        valor_tarjeta: float,
        observacion_devolucion: Optional[str] = None,
        nro_autorizacion: Optional[str] = None,
        franquicia: Optional[str] = None,

) -> [Habitacion, Habitacion]:
    from servicios.models import Servicio
    from servicios.services import bitacora_registrar_cambiar_habitacion_servicio
    from puntos_venta.models import PuntoVenta
    punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    if not punto_venta.abierto:
        raise serializers.ValidationError(
            {'_error': 'No se puede cambiar servicios de habitación desde un punto de venta cerrado'}
        )

    habitacion_nueva = Habitacion.objects.get(pk=habitacion_nueva_id)
    habitacion_anterior = Habitacion.objects.get(pk=habitacion_anterior_id)

    habitacion_anterior_valor = habitacion_anterior.tipo.valor
    habitacion_nueva_valor = habitacion_nueva.tipo.valor
    diferencia = habitacion_nueva_valor - habitacion_anterior_valor

    servicios = Servicio.objects.filter(id__in=servicios_array_id)

    if diferencia == 0:
        for servicio in servicios.all():
            bitacora_registrar_cambiar_habitacion_servicio(
                servicio_id=servicio.id,
                habitacion_nueva_id=habitacion_nueva.id,
                habitacion_anterior_id=habitacion_anterior.id,
                punto_venta_id=punto_venta_id,
                usuario_id=usuario_id
            )
            servicio.habitacion = habitacion_nueva
            servicio.save()
    else:
        array_servicios_id = []
        for servicio in servicios.all():
            bitacora_registrar_cambiar_habitacion_servicio(
                servicio_id=servicio.id,
                habitacion_nueva_id=habitacion_nueva.id,
                habitacion_anterior_id=habitacion_anterior.id,
                punto_venta_id=punto_venta_id,
                usuario_id=usuario_id,
                observacion_devolucion=observacion_devolucion
            )
            valor_habitacion = habitacion_nueva.tipo.valor_antes_impuestos
            valor_habitacion_con_iva = habitacion_nueva.tipo.valor
            valor_iva_habitacion = valor_habitacion_con_iva - valor_habitacion

            servicio.valor_habitacion = valor_habitacion
            servicio.valor_iva_habitacion = valor_iva_habitacion
            servicio.habitacion = habitacion_nueva
            servicio.save()
            array_servicios_id.append(servicio.id)

        if diferencia > 0:
            from cajas.services import transaccion_caja_registrar_cambio_habitacion_mayor_valor
            transaccion_caja_registrar_cambio_habitacion_mayor_valor(
                array_servicios_id=array_servicios_id,
                habitacion_nueva_id=habitacion_nueva_id,
                habitacion_anterior_id=habitacion_anterior_id,
                usuario_pdv_id=usuario_id,
                valor_tarjeta=valor_tarjeta,
                valor_efectivo=valor_efectivo,
                nro_autorizacion=nro_autorizacion,
                franquicia=franquicia
            )
        if diferencia < 0:
            from cajas.services import transaccion_caja_registrar_cambio_habitacion_menor_valor
            transaccion_caja_registrar_cambio_habitacion_menor_valor(
                array_servicios_id=array_servicios_id,
                habitacion_nueva_id=habitacion_nueva_id,
                habitacion_anterior_id=habitacion_anterior_id,
                usuario_pdv_id=usuario_id,
                valor_efectivo=valor_efectivo,
            )

    habitacion_anterior = habitacion_cambiar_estado(habitacion_anterior.id, 2)
    habitacion_nueva = habitacion_cambiar_estado(habitacion_nueva.id, 1)
    return habitacion_nueva, habitacion_anterior


def habitacion_iniciar_servicios(
        habitacion_id: int,
        usuario_pdv_id: int,
        servicios: list,
        valor_efectivo: float,
        valor_tarjeta: float,
        nro_autorizacion: str,
        franquicia: str
) -> Habitacion:
    from servicios.services import servicio_crear_nuevo, servicio_iniciar
    from cajas.services import transaccion_caja_registrar_pago_nuevos_servicios_habitacion
    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    punto_venta = turno_punto_venta.punto_venta
    if not punto_venta.abierto:
        raise serializers.ValidationError(
            {'_error': 'No se puede inciar servicios de habitación desde un punto de venta cerrado'}
        )

    habitacion = Habitacion.objects.get(pk=habitacion_id)
    habitacion_cambiar_estado(habitacion_id, 1)

    servicios_a_iniciar_id = []
    for servicio in servicios:
        # servicio.pop('id')
        tercero_id = servicio.pop('tercero_id')
        categoria_fraccion_tiempo_id = servicio.pop('categoria_fraccion_tiempo_id')

        servicio_adicionado = servicio_crear_nuevo(
            habitacion_id=habitacion_id,
            acompanante_id=tercero_id,
            categoria_fraccion_tiempo_id=categoria_fraccion_tiempo_id,
            usuario_pdv_id=usuario_pdv_id
        )

        servicios_a_iniciar_id.append(servicio_adicionado.id)
    servicios_a_iniciar = habitacion.servicios.filter(id__in=servicios_a_iniciar_id).order_by('id')
    [
        servicio_iniciar(servicio_id=servicio.id, usuario_pdv_id=usuario_pdv_id) for
        servicio
        in servicios_a_iniciar.all()
    ]

    transaccion_caja_registrar_pago_nuevos_servicios_habitacion(
        array_servicios_id=servicios_a_iniciar,
        habitacion_id=habitacion_id,
        usuario_pdv_id=usuario_pdv_id,
        valor_tarjeta=valor_tarjeta,
        valor_efectivo=valor_efectivo,
        nro_autorizacion=nro_autorizacion,
        franquicia=franquicia
    )

    return habitacion
