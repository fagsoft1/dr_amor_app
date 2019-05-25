from typing import Optional
from django.db.models import Max
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework import serializers

from habitaciones.models import Habitacion
from terceros.models import Tercero
from terceros.services import tercero_cambiar_estado
from terceros_acompanantes.models import CategoriaFraccionTiempo
from .models import Servicio, BitacoraServicio


# TODO: Hacer test
def bitacora_registrar_inicio_servicio(
        punto_venta_turno_id: int,
        servicio_id: int
):
    servicio = Servicio.objects.get(pk=servicio_id)
    BitacoraServicio.objects.create(
        servicio=servicio,
        habitacion_nombre=servicio.habitacion.nombre,
        concepto='Inicia Servicio',
        tiempo_contratado=servicio.tiempo_minutos,
        punto_venta_turno_id=punto_venta_turno_id,
        hora_evento=timezone.now(),
    )


# TODO: Hacer test
def bitacora_registrar_terminar_servicio(
        servicio_id: int,
        punto_venta_turno_id: int
):
    servicio = Servicio.objects.get(pk=servicio_id)
    now = timezone.now()
    tiempo_inicio_servicio = servicio.hora_inicio
    tiempo_minutos_recorridos = ((now - tiempo_inicio_servicio).seconds / 60) if tiempo_inicio_servicio < now else 0

    BitacoraServicio.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        servicio=servicio,
        concepto='Termina Servicio',
        tiempo_contratado=servicio.tiempo_minutos,
        hora_evento=timezone.now(),
        habitacion_nombre=servicio.habitacion.nombre,
        tiempo_minutos_recorridos=tiempo_minutos_recorridos
    )


def bitacora_registrar_solicitar_anular_servicio(
        servicio_id: int,
        observacion_anulacion: str,
        punto_venta_turno_id: int
):
    servicio = Servicio.objects.get(pk=servicio_id)
    now = timezone.now()
    tiempo_inicio_servicio = servicio.hora_inicio
    tiempo_minutos_recorridos = ((now - tiempo_inicio_servicio).seconds / 60) if tiempo_inicio_servicio < now else 0
    BitacoraServicio.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        servicio=servicio,
        concepto='Solicita Anular Servicio',
        observacion=observacion_anulacion,
        tiempo_contratado=servicio.tiempo_minutos,
        hora_evento=timezone.now(),
        habitacion_nombre=servicio.habitacion.nombre,
        tiempo_minutos_recorridos=tiempo_minutos_recorridos
    )


# TODO: Hacer test
def bitacora_registrar_cambiar_tiempo_servicio(
        punto_venta_turno_id: int,
        servicio_id: int,
        tiempo_contratado_nuevo: int,
):
    servicio = Servicio.objects.get(pk=servicio_id)
    now = timezone.now()
    tiempo_inicio_servicio = servicio.hora_inicio
    concepto = 'Extención de tiempo' if tiempo_contratado_nuevo > servicio.tiempo_minutos else 'Disminución de tiempo'
    tiempo_minutos_recorridos = ((now - tiempo_inicio_servicio).seconds / 60) if tiempo_inicio_servicio < now else 0

    BitacoraServicio.objects.create(
        servicio=servicio,
        concepto=concepto,
        punto_venta_turno_id=punto_venta_turno_id,
        tiempo_contratado_anterior=servicio.tiempo_minutos,
        tiempo_contratado_nuevo=tiempo_contratado_nuevo,
        hora_evento=timezone.now(),
        habitacion_nombre=servicio.habitacion.nombre,
        tiempo_minutos_recorridos=tiempo_minutos_recorridos
    )


# TODO: Hacer test
def bitacora_registrar_cambiar_habitacion_servicio(
        servicio_id: int,
        habitacion_anterior_id: int,
        habitacion_nueva_id: int,
        punto_venta_turno_id: int,
        observacion_devolucion: Optional[str] = None

):
    servicio = Servicio.objects.get(pk=servicio_id)
    habitacion_anterior = Habitacion.objects.get(pk=habitacion_anterior_id)
    habitacion_nueva = Habitacion.objects.get(pk=habitacion_nueva_id)
    now = timezone.now()
    tiempo_inicio_servicio = servicio.hora_inicio
    tiempo_minutos_recorridos = ((now - tiempo_inicio_servicio).seconds / 60) if tiempo_inicio_servicio < now else 0
    BitacoraServicio.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        servicio=servicio,
        concepto='Cambio de habitación',
        hora_evento=timezone.now(),
        habitacion_anterior_nombre=habitacion_anterior.nombre,
        tiempo_contratado=servicio.tiempo_minutos,
        habitacion_nueva_nombre=habitacion_nueva.nombre,
        tiempo_minutos_recorridos=tiempo_minutos_recorridos,
        observacion=observacion_devolucion
    )


def servicio_recursivo_asignacion_horas(
        servicio_anterior_id: Optional[int],
        servicio_id: int
):
    servicio_anterior = Servicio.objects.get(pk=servicio_anterior_id) if servicio_anterior_id else None
    servicio = Servicio.objects.get(pk=servicio_id)
    if servicio_anterior:
        hora_inicio = servicio_anterior.hora_final
        servicio.hora_inicio = hora_inicio
        servicio.hora_final = servicio_calcular_hora_final(servicio.id, hora_inicio)
        servicio.save()
    if hasattr(servicio, 'servicio_siguiente'):
        servicio_recursivo_asignacion_horas(servicio.id, servicio.servicio_siguiente.id)


def servicio_terminar(
        servicio_id: int,
        usuario_pdv_id: int
) -> Servicio:
    from habitaciones.services import habitacion_cambiar_estado
    servicio = Servicio.objects.get(pk=servicio_id)

    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    punto_venta = turno_punto_venta.punto_venta
    if not punto_venta.abierto:
        raise serializers.ValidationError(
            {'_error': 'No se pueden terminar servicios desde un punto de venta cerrado'}
        )

    if hasattr(servicio, 'servicio_siguiente') and servicio.servicio_siguiente.estado == 1:
        raise serializers.ValidationError(
            {'_error': 'No se pueden terminar el servicio sin terminar los siguiente primero'})

    if servicio.estado != 1:
        raise serializers.ValidationError(
            {'_error': 'No se pueden terminar el servicio en estado diferente a en servicio'})

    hora_final_real = timezone.now()
    servicio.estado = 2
    servicio.servicio_anterior = None
    servicio.servicio_siguiente = None
    servicio.hora_final_real = hora_final_real
    servicio.save()
    habitacion = servicio.habitacion
    habitacion_cambiar_estado(habitacion.id, 2)

    tercero = servicio.cuenta.propietario.tercero
    servicio.cuenta.servicios.filter(estado=0).delete()
    tercero_cambiar_estado(tercero.id, 0)
    bitacora_registrar_terminar_servicio(
        servicio_id=servicio_id,
        punto_venta_turno_id=turno_punto_venta.id
    )
    return servicio


def servicio_iniciar(
        servicio_id: int,
        usuario_pdv_id: int
) -> Servicio:
    servicio = Servicio.objects.get(id=servicio_id)

    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    punto_venta = turno_punto_venta.punto_venta
    if not punto_venta.abierto:
        raise serializers.ValidationError(
            {'_error': 'No se pueden iniciar servicios desde un punto de venta cerrado'}
        )

    habitacion = servicio.habitacion
    if habitacion.estado not in [0, 1]:
        raise serializers.ValidationError(
            {'_error': 'No se pueden iniciar servicios en una habitacion en estados diferentes a ocupado y disponible'}
        )

    hora_inicio = timezone.now()
    tercero = servicio.cuenta.propietario.tercero
    tercero = tercero_cambiar_estado(tercero.id, 1)
    servicio_en_proceso_tercero = tercero.cuenta_abierta.servicios.filter(estado=1)
    if servicio_en_proceso_tercero.exists():
        qsHoraServicio = servicio_en_proceso_tercero.aggregate(Max('hora_final'))
        hora_inicio = qsHoraServicio['hora_final__max']
        servicio.servicio_anterior = servicio_en_proceso_tercero.order_by('id').last()
    servicio.estado = 1
    servicio.hora_inicio = hora_inicio
    servicio.hora_final = servicio_calcular_hora_final(servicio_id, hora_inicio)
    servicio.save()

    bitacora_registrar_inicio_servicio(
        servicio_id=servicio_id,
        punto_venta_turno_id=turno_punto_venta.id
    )
    return servicio


def servicio_crear_nuevo(
        habitacion_id: int,
        acompanante_id: int,
        categoria_fraccion_tiempo_id: int,
        usuario_pdv_id: int
) -> Servicio:
    from habitaciones.services import habitacion_cambiar_estado
    from terceros_acompanantes.models import CategoriaFraccionTiempo
    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    punto_venta = turno_punto_venta.punto_venta

    if not punto_venta.abierto:
        raise serializers.ValidationError(
            {'_error': 'No se pueden crear servicios desde un punto de venta cerrado'}
        )

    habitacion = Habitacion.objects.get(pk=habitacion_id)

    if habitacion.estado not in [0, 1]:
        raise serializers.ValidationError(
            {'_error': 'No se pueden crear servicios para habitaciones con estados diferentes a ocupado y disponible'}
        )

    tercero = Tercero.objects.get(pk=acompanante_id)

    if not tercero.es_acompanante:
        raise serializers.ValidationError(
            {'_error': 'No se puede crear un servicio para un tercero que no sea acompanante'}
        )

    categoria_fraccion_tiempo = CategoriaFraccionTiempo.objects.get(pk=categoria_fraccion_tiempo_id)

    categorias_fracciones_tiempo_tercero = CategoriaFraccionTiempo.objects.filter(
        categoria=tercero.categoria_modelo,
        pk=categoria_fraccion_tiempo_id
    )
    if not categorias_fracciones_tiempo_tercero.exists():
        raise serializers.ValidationError(
            {'_error': 'La categoria de la tarifa seleccionada no coincide con la categoria de la modelo seleccionada'}
        )

    now = timezone.localtime(timezone.now())
    ultimo_registro_acceso = tercero.usuario.regitros_ingresos.filter(
        created__date=now.date(),
        fecha_fin__isnull=True
    )

    if not (ultimo_registro_acceso.exists() and tercero.presente):
        raise serializers.ValidationError(
            {'_error': 'No se pueden crear servicios para acompanantes que no esten presentes'}
        )

    servicios_otra_habitacion = tercero.cuenta_abierta.servicios.filter(estado=1).exclude(habitacion_id=habitacion_id)

    if servicios_otra_habitacion.exists():
        raise serializers.ValidationError(
            {'_error': 'No se pueden crear servicios para una habitacion diferente a la que esta actualmente'}
        )

    habitacion_cambiar_estado(habitacion.id, 1)

    estado = 0
    tiempo_minutos = categoria_fraccion_tiempo.fraccion_tiempo.minutos
    categoria = tercero.categoria_modelo.nombre
    valor_servicio = categoria_fraccion_tiempo.valor + habitacion.tipo.valor_adicional_servicio
    valor_habitacion = habitacion.tipo.valor_antes_impuestos
    cuenta = tercero.cuenta_abierta
    impuestos = habitacion.tipo.impuesto
    servicio_nuevo = Servicio.objects.create(
        empresa=habitacion.empresa,
        habitacion=habitacion,
        cuenta=cuenta,
        estado=estado,
        tiempo_minutos=tiempo_minutos,
        categoria=categoria,
        valor_servicio=valor_servicio,
        valor_habitacion=valor_habitacion,
        impuestos=impuestos,
        punto_venta_turno=turno_punto_venta
    )
    return servicio_nuevo


def servicio_solicitar_anular(
        servicio_id: int,
        observacion_anulacion: str,
        usuario_pdv_id: int
) -> Servicio:
    from habitaciones.services import habitacion_cambiar_estado
    from cajas.services import transaccion_caja_registrar_anulacion_servicio

    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    punto_venta = turno_punto_venta.punto_venta

    if not punto_venta.abierto:
        raise serializers.ValidationError(
            {'_error': 'No se pueden solicitar anular un servicios desde un punto de venta cerrado'}
        )

    servicio = Servicio.objects.get(pk=servicio_id)
    if servicio.estado != 1:
        raise serializers.ValidationError({'_error': 'Sólo se pueden anular servicios en estado en servicio'})

    servicio.estado = 4
    servicio.hora_anulacion = timezone.now()
    servicio.observacion_anulacion = observacion_anulacion
    servicio.valor_servicio = 0
    servicio.valor_habitacion = 0
    servicio.impuestos = 0

    servicio_anterior = servicio.servicio_anterior
    servicio_siguiente = None

    if hasattr(servicio, 'servicio_siguiente'):
        servicio_siguiente = servicio.servicio_siguiente

    servicio.servicio_anterior = None
    servicio.save()

    if servicio_siguiente and servicio_anterior:
        servicio_siguiente.servicio_anterior = servicio_anterior
        servicio_siguiente.save()
        servicio_recursivo_asignacion_horas(servicio_anterior.id, servicio_siguiente.id)
    elif not servicio_anterior and servicio_siguiente:
        servicio_siguiente.servicio_anterior = None
        servicio_siguiente.hora_inicio = servicio.hora_inicio
        servicio_siguiente.hora_final = servicio_calcular_hora_final(servicio_siguiente.id, servicio.hora_inicio)
        servicio_siguiente.save()
        servicio_recursivo_asignacion_horas(None, servicio_siguiente.id)

    habitacion_cambiar_estado(servicio.habitacion.id, 2)
    tercero = servicio.cuenta.propietario.tercero
    tercero_cambiar_estado(tercero.id, 0)

    bitacora_registrar_solicitar_anular_servicio(
        servicio_id=servicio_id,
        observacion_anulacion=observacion_anulacion,
        punto_venta_turno_id=turno_punto_venta.id
    )

    transaccion_caja_registrar_anulacion_servicio(
        servicio_id=servicio_id,
        valor_efectivo=servicio.valor_total,
        concepto=observacion_anulacion,
        usuario_pdv_id=usuario_pdv_id
    )
    return servicio


def servicio_cambiar_tiempo(
        servicio_id: int,
        usuario_pdv_id: int,
        categoria_fraccion_tiempo_id: int,
        valor_efectivo: float,
        valor_tarjeta: float,
        nro_autorizacion: str,
        franquicia: str
) -> Servicio:
    turno_punto_venta = User.objects.get(pk=usuario_pdv_id).tercero.turno_punto_venta_abierto
    punto_venta = turno_punto_venta.punto_venta

    if not punto_venta.abierto:
        raise serializers.ValidationError(
            {'_error': 'No se pueden cambiar tiempo en un servicios desde un punto de venta cerrado'}
        )

    servicio = Servicio.objects.get(pk=servicio_id)
    categoria_fraccion_tiempo = CategoriaFraccionTiempo.objects.get(id=categoria_fraccion_tiempo_id)
    minutos = categoria_fraccion_tiempo.fraccion_tiempo.minutos

    if servicio.tiempo_minutos == minutos:
        raise serializers.ValidationError(
            {'_error': 'El tiempo solicitado y el actual del servicio es el mismo'}
        )

    bitacora_registrar_cambiar_tiempo_servicio(
        punto_venta_turno_id=turno_punto_venta.id,
        servicio_id=servicio_id,
        tiempo_contratado_nuevo=minutos
    )

    servicio.tiempo_minutos = minutos
    servicio.save()
    servicio.hora_final = servicio_calcular_hora_final(servicio_id, servicio.hora_inicio)
    servicio.save()
    tiene_siguiente = hasattr(servicio, 'servicio_siguiente')
    if tiene_siguiente:
        servicio_recursivo_asignacion_horas(None, servicio.id)

    valor_servicio_actual = servicio.valor_servicio
    valor_servicio_nuevo = categoria_fraccion_tiempo.valor + servicio.habitacion.tipo.valor_adicional_servicio
    diferencia = valor_servicio_nuevo - valor_servicio_actual

    if diferencia > 0:
        from cajas.services import transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo
        transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo(
            usuario_pdv_id=usuario_pdv_id,
            servicio_id=servicio_id,
            categoria_fraccion_tiempo_nueva_id=categoria_fraccion_tiempo_id,
            valor_tarjeta=abs(valor_tarjeta),
            valor_efectivo=abs(valor_efectivo),
            nro_autorizacion=nro_autorizacion,
            franquicia=franquicia
        )

    if diferencia < 0:
        from cajas.services import transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo
        transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo(
            usuario_pdv_id=usuario_pdv_id,
            servicio_id=servicio_id,
            categoria_fraccion_tiempo_nueva_id=categoria_fraccion_tiempo_id,
            valor_efectivo=abs(valor_efectivo)
        )
    servicio.valor_servicio = valor_servicio_nuevo
    servicio.save()

    return servicio


def servicio_calcular_hora_final(
        servicio_id: int,
        hora_inicio: timezone
) -> timezone:
    servicio = Servicio.objects.get(id=servicio_id)
    hora_final = (hora_inicio + timezone.timedelta(minutes=servicio.tiempo_minutos))
    return hora_final
