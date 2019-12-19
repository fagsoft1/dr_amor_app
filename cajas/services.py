from io import BytesIO

from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.db.models import Sum, F
from django.db.models.functions import Coalesce
from django.template.loader import get_template, render_to_string
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from weasyprint import HTML, CSS

from cajas.models import TransaccionCaja, OperacionCaja, ConceptoOperacionCaja, ArqueoCaja
from contabilidad_cuentas.models import CuentaContable


def concepto_operacion_caja_crear_actualizar(
        diario_contable_id: int,
        grupo: str,
        tipo: str,
        descripcion: str,
        tipo_comprobante_contable_empresa_id: int,
        cuenta_contable_contrapartida_id: int,
        reporte_independiente: bool = False,
        concepto_operacion_caja_id: int = None,
        tercero_cuenta_contrapartida_id: int = None,
) -> ConceptoOperacionCaja:
    if grupo in ['O', 'T'] and tercero_cuenta_contrapartida_id is None:
        raise ValidationError(
            {'_error': 'Los conceptos para otros o taxis deben tener un tercero para la cuenta contrapartida'})
    cuenta_contable = CuentaContable.objects.get(pk=cuenta_contable_contrapartida_id)
    naturaleza_cuenta = cuenta_contable.naturaleza
    if tipo == 'DEBITO' and naturaleza_cuenta == 'D':
        raise ValidationError(
            {'_error': 'Para un concepto de ingreso la cuenta de contrapartida no puede ser de naturaleza Débito'})
    if tipo == 'CREDITO' and naturaleza_cuenta == 'C':
        raise ValidationError(
            {'_error': 'Para un concepto de egreso la cuenta de contrapartida no puede ser de naturaleza Crédito'})

    if concepto_operacion_caja_id is not None:
        concepto = ConceptoOperacionCaja.objects.get(pk=concepto_operacion_caja_id)
    else:
        concepto = ConceptoOperacionCaja()
    concepto.tercero_cuenta_contrapartida_id = tercero_cuenta_contrapartida_id
    concepto.diario_contable_id = diario_contable_id
    concepto.tipo = tipo
    concepto.cuenta_contable_contrapartida = cuenta_contable
    concepto.tipo_comprobante_contable_empresa_id = tipo_comprobante_contable_empresa_id
    concepto.reporte_independiente = reporte_independiente
    concepto.descripcion = descripcion
    concepto.grupo = grupo
    concepto.save()
    return concepto


# region Transacciones Caja
def transaccion_caja_registrar_ingreso_base_inicial_apertura_caja(
        punto_venta_turno_id: int,
        valor_efectivo: float
) -> TransaccionCaja:
    if valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es %s' % (
                    valor_efectivo)}
        )

    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        tipo='I',
        tipo_dos='BASE_INI_CAJA',
        concepto='Ingreso de base inicial apertura de caja',
        valor_efectivo=valor_efectivo
    )
    return transaccion


def transaccion_caja_registrar_egreso_entrega_base_cierre_caja(
        punto_venta_turno_id: int,
        valor_efectivo: float
) -> TransaccionCaja:
    if valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es %s' % (
                    valor_efectivo)}
        )

    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        tipo='E',
        tipo_dos='BASE_CIE_CAJA',
        concepto='Egreso por entrega de base cierre de caja',
        valor_efectivo=-valor_efectivo
    )
    return transaccion


def transaccion_caja_registrar_egreso_entrega_efectivo_cierre_caja(
        punto_venta_turno_id: int,
        valor_efectivo: float
) -> TransaccionCaja:
    if valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es %s' % (
                    valor_efectivo)}
        )

    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        tipo='E',
        tipo_dos='EFEC_CIE_CAJA',
        concepto='Egreso por entrega de efectivo cierre de caja',
        valor_efectivo=-valor_efectivo
    )
    return transaccion


def transaccion_caja_registrar_venta_product_efectivo_ingreso(
        punto_venta_turno_id: int,
        valor_efectivo: float,
        venta_id: int
) -> TransaccionCaja:
    if valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo deben ser iguales o mayores a 0. El valor del efectivo es %s' % (
                    valor_efectivo)}
        )

    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        tipo='I',
        tipo_dos='VENTA_PRODUCTO',
        concepto='Ingreso x Venta de Producto en Efectivo',
        valor_efectivo=valor_efectivo
    )

    transaccion.ventas_productos.add(venta_id)
    return transaccion


def transaccion_caja_liquidacion_cuenta_mesero(
        liquidacion_mesero_id: int,
        punto_venta_turno_id: int,
        valor_efectivo: float,
        valor_tarjeta: float,
        nro_vauchers: int
) -> TransaccionCaja:
    if valor_tarjeta < 0 or valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es %s y de la tarjeta es %s' % (
                    valor_efectivo, valor_tarjeta)}
        )

    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        tipo='I',
        tipo_dos='LIQ_CUE_MESERO',
        concepto='Liquidación de cuenta para mesero',
        valor_efectivo=valor_efectivo,
        valor_tarjeta=valor_tarjeta,
        nro_vauchers=nro_vauchers
    )
    transaccion.liquidaciones.add(liquidacion_mesero_id)
    return transaccion


def transaccion_caja_liquidacion_cuenta_acompanante(
        liquidacion_mesero_id: int,
        punto_venta_turno_id: int,
        valor_efectivo: float
) -> TransaccionCaja:
    if valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valor en efectivo debe ser igual o mayor a 0. El valor del efectivo es %s' % (
                    valor_efectivo)}
        )

    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        tipo='E',
        tipo_dos='LIQ_CUE_ACOMP',
        concepto='Liquidación de cuenta para acompañante',
        valor_efectivo=-valor_efectivo,
        valor_tarjeta=0,
        nro_vauchers=0
    )
    transaccion.liquidaciones.add(liquidacion_mesero_id)
    return transaccion


def transaccion_caja_registrar_venta_parqueadero(
        registro_entrada_parqueo_id: int,
        punto_venta_turno_id: int,
        concepto: str,
        valor_efectivo: float
) -> TransaccionCaja:
    if valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es %s' % (
                    valor_efectivo)}
        )

    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        tipo='I',
        tipo_dos='PARQUEADERO',
        concepto=concepto,
        valor_efectivo=valor_efectivo
    )
    transaccion.parqueaderos.add(registro_entrada_parqueo_id)
    return transaccion


def transaccion_caja_registrar_operacion_caja_egreso(
        punto_venta_turno_id: int,
        concepto: str,
        valor_efectivo: float,
) -> TransaccionCaja:
    if valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es %s' % (
                    valor_efectivo)}
        )

    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        tipo='E',
        tipo_dos='OPERA_CAJA',
        concepto=concepto,
        valor_efectivo=-valor_efectivo
    )
    return transaccion


def transaccion_caja_registrar_operacion_caja_ingreso(
        punto_venta_turno_id: int,
        concepto: str,
        valor_efectivo: float,
) -> TransaccionCaja:
    if valor_efectivo < 0:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es %s' % (
                    valor_efectivo)}
        )

    transaccion = TransaccionCaja.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        tipo='I',
        tipo_dos='OPERA_CAJA',
        concepto=concepto,
        valor_efectivo=valor_efectivo
    )
    return transaccion


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
        concepto='Devolucion por disminución de tiempo a %s minutos' % (minutos),
        valor_efectivo=-valor_efectivo
    )
    transaccion.servicios.add(servicio)
    if valor_efectivo != -diferencia:
        raise serializers.ValidationError(
            {
                '_error': 'El valor ingresado de forma de pago es diferente a la devolución por el servicio. El Valor de la devolucion es %s, pero el pago en Efectivo= %s no coincide' % (
                    abs(diferencia), abs(valor_efectivo))}
        )
    servicio.valor_servicio += diferencia
    servicio.save()

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
        concepto='Ingreso por extención de tiempo a %s minutos' % (minutos),
        valor_tarjeta=valor_tarjeta,
        nro_vauchers=1 if valor_tarjeta > 0 else 0,
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

    servicio.valor_servicio += diferencia
    servicio.save()
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
        nro_vauchers=1 if valor_tarjeta > 0 else 0,
        valor_efectivo=valor_efectivo,
        nro_autorizacion=nro_autorizacion,
        franquicia=franquicia
    )

    servicios = Servicio.objects.filter(id__in=array_servicios_id)
    transaccion.servicios.set(servicios)
    valor_total = transaccion.servicios.aggregate(
        valor=Coalesce(
            Sum(F('valor_habitacion') + F('valor_servicio') + F('impuestos') + F('valor_servicio_adicional')), 0)
    )['valor']

    if int(valor_tarjeta + valor_efectivo) != int(valor_total):
        raise serializers.ValidationError(
            {
                '_error': 'El valor ingresado de forma de pago es diferente al valor total de los servicios. El Valor de los servicios es %s, pero el pago en Efectivo= %s + Tarjeta= %s no coincide' % (
                    valor_total, valor_efectivo, valor_tarjeta)
            }
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
    habitacion_anterior_valor_adicional = habitacion_anterior.tipo.valor_adicional_servicio

    habitacion_nueva_valor = habitacion_nueva.tipo.valor
    habitacion_nueva_valor_adicional = habitacion_nueva.tipo.valor_adicional_servicio

    diferencia = (habitacion_nueva_valor + habitacion_nueva_valor_adicional) - (
            habitacion_anterior_valor + habitacion_anterior_valor_adicional)

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
        nro_vauchers=1 if valor_tarjeta > 0 else 0,
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
    habitacion_anterior_valor_adicional = habitacion_anterior.tipo.valor_adicional_servicio

    habitacion_nueva_valor = habitacion_nueva.tipo.valor
    habitacion_nueva_valor_adicional = habitacion_nueva.tipo.valor_adicional_servicio

    diferencia = (habitacion_nueva_valor + habitacion_nueva_valor_adicional) - (
            habitacion_anterior_valor + habitacion_anterior_valor_adicional)
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


# endregion

# region Operaciones Caja

# todo borrar
def operacion_caja_crear(
        concepto_id: int,
        usuario_pdv_id: int,
        valor: float,
        tercero_id: int = None,
        observacion: str = '',
) -> OperacionCaja:
    from terceros.models import Tercero
    cuenta = None

    if valor <= 0:
        raise serializers.ValidationError({'_error': 'El valor ingresado debe ser positivo mayor a cero'})

    concepto_operacion_caja = ConceptoOperacionCaja.objects.get(pk=concepto_id)
    if concepto_operacion_caja.tipo == 'E':
        valor = valor * -1

    usuario = User.objects.get(pk=usuario_pdv_id)
    if not hasattr(usuario, 'tercero'):
        raise serializers.ValidationError({'_error': 'Quien crea la operación debe tener un tercero'})
    if not usuario.tercero.presente:
        raise serializers.ValidationError({'_error': 'Quien crea de la operación debe estar presente'})
    punto_venta_turno = usuario.tercero.turno_punto_venta_abierto
    if not punto_venta_turno:
        raise serializers.ValidationError(
            {'_error': 'Quien crea de la operación debe tener un turno de punto de venta abierto'})

    if tercero_id is not None and concepto_operacion_caja.grupo in ['C', 'A', 'P']:
        raise serializers.ValidationError(
            {'_error': 'Para el concepto seleccionado se requiere un tercero'}
        )

    if tercero_id is not None and concepto_operacion_caja.grupo in ['O', 'T']:
        raise serializers.ValidationError(
            {'_error': 'Para los conceptos Otro y Taxi no se utiliza tercero'}
        )

    if tercero_id is not None:
        tercero = Tercero.objects.get(pk=tercero_id)
        if concepto_operacion_caja.grupo == 'C' and not tercero.es_colaborador:
            raise serializers.ValidationError(
                {'_error': 'Un tipo de operacion de caja para colaborador solo debe ser creada para un colaborador'})
        if concepto_operacion_caja.grupo == 'A' and not tercero.es_acompanante:
            raise serializers.ValidationError(
                {'_error': 'Un tipo de operacion de caja para acompañante solo debe ser creada para un acompañante'})
        if concepto_operacion_caja.grupo == 'P' and not tercero.es_proveedor:
            raise serializers.ValidationError(
                {'_error': 'Un tipo de operacion de caja para proveedor solo debe ser creada para un proveedor'})

        if tercero.es_acompanante or tercero.es_colaborador:
            if not tercero.presente:
                raise serializers.ValidationError({'_error': 'A quien se le crea la operación debe estar presente.'})
            cuenta = tercero.cuenta_abierta

    valor_operacion = abs(valor)

    if concepto_operacion_caja.tipo_cuenta == 'CXC':
        valor_operacion = valor_operacion * -1
        tipo_cuenta = 'CXC'
    elif concepto_operacion_caja.tipo_cuenta == 'CXP':
        valor_operacion = valor_operacion
        tipo_cuenta = 'CXP'
    else:
        valor_operacion = valor
        tipo_cuenta = 'NA'

    operacion_caja = OperacionCaja.objects.create(
        concepto_id=concepto_id,
        valor=valor_operacion,
        tercero_id=tercero_id,
        cuenta=cuenta,
        punto_venta_turno=punto_venta_turno,
        descripcion=concepto_operacion_caja.descripcion,
        observacion=observacion,
        tipo_cuenta=tipo_cuenta
    )
    if concepto_operacion_caja.tipo == 'E':
        transaccion_caja = transaccion_caja_registrar_operacion_caja_egreso(
            punto_venta_turno_id=punto_venta_turno.id,
            concepto='Egreso x %s' % concepto_operacion_caja.descripcion,
            valor_efectivo=-valor
        )
    else:
        transaccion_caja = transaccion_caja_registrar_operacion_caja_ingreso(
            punto_venta_turno_id=punto_venta_turno.id,
            concepto='Ingreso x %s' % concepto_operacion_caja.descripcion,
            valor_efectivo=valor
        )
    operacion_caja.transacciones_caja.add(transaccion_caja)
    return operacion_caja


# todo borrar
def operacion_caja_generar_recibo(operacion_caja_id):
    operacion_caja = OperacionCaja.objects.get(pk=operacion_caja_id)
    context = {
        "operacion_caja": operacion_caja
    }
    html_get_template = get_template('recibos/cajas/operacion_caja_comprobante.html').render(context)
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


# endregion


def arqueo_generar_recibo_entrega(arqueo_id):
    arqueo = ArqueoCaja.objects.get(pk=arqueo_id)
    context = {
        "arqueo": arqueo
    }
    html_get_template = get_template('reportes/cajas/entrega_cierre_pdf.html').render(context)
    html = HTML(
        string=html_get_template
    )
    width = '80mm'
    height = '28cm'
    size = 'size: %s %s' % (width, height)
    margin = 'margin: 0.8cm 0.8cm 0.8cm 0.8cm'

    css_string = '@page {text-align: justify; font-family: Arial;font-size: 0.6rem;%s;%s}' % (size, margin)
    main_doc = html.render(stylesheets=[CSS(string=css_string)])
    return main_doc


def arqueo_generar_reporte(arqueo_id):
    arqueo = ArqueoCaja.objects.get(pk=arqueo_id)
    context = {
        "arqueo": arqueo
    }
    html_get_template = get_template('reportes/cajas/arqueo_pdf.html').render(context)
    html = HTML(
        string=html_get_template
    )
    width = '80mm'
    height = '28cm'
    main_doc = html.render(stylesheets=[CSS('static/css/reportes_carta.css')])
    return main_doc


def arqueo_generar_reporte_email(arqueo_id):
    arqueo = ArqueoCaja.objects.get(pk=arqueo_id)
    main_doc = arqueo_generar_reporte(arqueo_id=arqueo_id)
    output = BytesIO()
    main_doc.write_pdf(
        target=output
    )
    text_content = render_to_string('email/cajas/arqueo_caja_envio_correo.html', {})
    msg = EmailMultiAlternatives(
        'Arqueo de Caja de %s' % arqueo.punto_venta_turno.usuario.username,
        text_content,
        bcc=['fabiogarciasanchez+dramor@gmail.com'],
        from_email='Clínica Dr. Amor <%s>' % 'webmaster@clinicadramor.com',
        to=['fabiogarciasanchez+dramor@gmail.com']
    )
    msg.attach_alternative(text_content, "text/html")
    msg.attach('Arqueo de caja %s' % arqueo.punto_venta_turno.usuario.username, output.getvalue(), 'application/pdf')
    try:
        msg.send()
    except Exception as e:
        print('error de envio')
        raise serializers.ValidationError(
            {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    return main_doc
