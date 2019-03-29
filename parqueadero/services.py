from typing import Optional
from django.db.models import Max
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework import serializers

from habitaciones.models import Habitacion
from terceros.models import Tercero
from terceros.services import tercero_cambiar_estado
from terceros_acompanantes.models import CategoriaFraccionTiempo
from .models import ModalidadFraccionTiempoDetalle, ModalidadFraccionTiempo


def validar_tiempos_valores_por_modalidad_fraccion_tiempo(
        qs,
        minutos: int,
        valor: int
) -> bool:
    if qs.filter(minutos=minutos).exists():
        raise serializers.ValidationError(
            {'_error': 'Ya existe un valor de tarifa definido para %s minutos.' % minutos})

    if qs.filter(valor__gt=valor, minutos__lt=minutos).exists():
        raise serializers.ValidationError(
            {
                '_error': 'Existe un valor mayor a %s para una tarifa con minutos inferiores a %s. Revisar y asignar correctamente' % (
                    valor, minutos)})

    if qs.filter(valor__lt=valor, minutos__gt=minutos).exists():
        raise serializers.ValidationError(
            {
                '_error': 'Existe un valor menor a %s para una tarifa con minutos mayores a %s. Revisar y asignar correctamente' % (
                    valor, minutos)})
    return True


def modalida_fraccion_tiempo_detalle_crear_actualizar(
        modalidad_fraccion_tiempo_id: int,
        minutos: int,
        valor: int,
        modalidad_fraccion_tiempo_detalle_id: int = None
) -> ModalidadFraccionTiempoDetalle:
    if valor < 0:
        raise serializers.ValidationError({'_error': 'El valor digitado debe ser positivo'})

    modalidad_fraccion_tiempo = ModalidadFraccionTiempo.objects.get(pk=modalidad_fraccion_tiempo_id)
    detalles = modalidad_fraccion_tiempo.fracciones.filter()
    if modalidad_fraccion_tiempo_detalle_id:
        detalles = detalles.exclude(pk=modalidad_fraccion_tiempo_detalle_id)

    validar_tiempos_valores_por_modalidad_fraccion_tiempo(
        qs=detalles,
        minutos=minutos,
        valor=valor
    )
    if modalidad_fraccion_tiempo_detalle_id:
        modalidad_fraccion_tiempo_detalle = ModalidadFraccionTiempoDetalle.objects.get(
            pk=modalidad_fraccion_tiempo_detalle_id
        )
        modalidad_fraccion_tiempo_detalle.valor = valor
        modalidad_fraccion_tiempo_detalle.minutos = minutos
        modalidad_fraccion_tiempo.save()
        return modalidad_fraccion_tiempo_detalle
    else:
        return ModalidadFraccionTiempoDetalle.objects.create(
            modalidad_fraccion_tiempo_id=modalidad_fraccion_tiempo_id,
            minutos=minutos,
            valor=valor
        )
