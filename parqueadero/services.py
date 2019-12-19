from django.contrib.auth.models import User
from django.template.loader import get_template
from django.utils import timezone
from rest_framework import serializers
from weasyprint import CSS, HTML

from .models import (
    ModalidadFraccionTiempoDetalle,
    ModalidadFraccionTiempo,
    RegistroEntradaParqueo,
    Vehiculo
)


def modalidad_fraccion_tiempo_adicionar_quitar_impuesto(
        modalidad_fraccion_tiempo_id: int,
        impuesto_id: int,
        tipo: str
) -> ModalidadFraccionTiempo:
    modalidad_fraccion_tiempo = ModalidadFraccionTiempo.objects.get(pk=modalidad_fraccion_tiempo_id)
    if tipo == 'del':
        modalidad_fraccion_tiempo.impuestos.remove(impuesto_id)
    if tipo == 'add':
        if not modalidad_fraccion_tiempo.impuestos.filter(pk=impuesto_id).exists():
            modalidad_fraccion_tiempo.impuestos.add(impuesto_id)
    modalidad_fraccion_tiempo.refresh_from_db()
    return modalidad_fraccion_tiempo


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
        modalidad_fraccion_tiempo_detalle.save()
        return modalidad_fraccion_tiempo_detalle
    else:
        return ModalidadFraccionTiempoDetalle.objects.create(
            modalidad_fraccion_tiempo_id=modalidad_fraccion_tiempo_id,
            minutos=minutos,
            valor=valor
        )


def registro_entrada_parqueo_crear(
        usuario_pdv_id: int,
        modalidad_fraccion_tiempo_id: int,
        placa: str = None
) -> RegistroEntradaParqueo:
    usuario = User.objects.get(pk=usuario_pdv_id)
    if not hasattr(usuario, 'tercero'):
        raise serializers.ValidationError({'_error': 'Quien registra la entrada a parqueadero debe tener un tercero'})
    if not usuario.tercero.presente:
        raise serializers.ValidationError({'_error': 'Quien registra la entrada a parqueadero debe de estar presente'})
    punto_venta_turno = usuario.tercero.turno_punto_venta_abierto
    if not punto_venta_turno:
        raise serializers.ValidationError(
            {'_error': 'Quien registra la entrada a parqueadero debe tener un turno de punto de venta abierto'})

    modalidad_fraccion_tiempo = ModalidadFraccionTiempo.objects.get(pk=modalidad_fraccion_tiempo_id)
    tipo_vehiculo = modalidad_fraccion_tiempo.tipo_vehiculo
    if tipo_vehiculo.tiene_placa and not placa:
        raise serializers.ValidationError({'_error': 'Faltó digitar la placa del vehiculo'})

    if tipo_vehiculo.tiene_placa:
        placa = placa.replace(" ", "")
        existe_placa_actualmente = RegistroEntradaParqueo.objects.filter(
            hora_pago__isnull=True,
            vehiculo__placa=placa
        ).exists()
        if existe_placa_actualmente:
            raise serializers.ValidationError(
                {'_error': 'No se puede volver a registrar una placa si actualmente esta en proceso en el parqueadero'})

    if not tipo_vehiculo.tiene_placa and placa:
        raise serializers.ValidationError({'_error': 'Este tipo de vehiculo no requiere placa, seleccione el correcto'})

    if not placa:
        return RegistroEntradaParqueo.objects.create(
            punto_venta_turno_id=punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=modalidad_fraccion_tiempo_id,
            codigo_qr='Aqui el codigo que vamos a generar',
            hora_ingreso=timezone.now()
        )
    else:
        placa = placa.replace(" ", "")
        vehiculo, created = Vehiculo.objects.get_or_create(
            tipo_vehiculo_id=tipo_vehiculo.id,
            placa=placa
        )
        return RegistroEntradaParqueo.objects.create(
            punto_venta_turno_id=punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=modalidad_fraccion_tiempo_id,
            vehiculo=vehiculo,
            hora_ingreso=timezone.now(),
            codigo_qr='Aqui el codigo que vamos a generar'
        )


def registro_entrada_parqueo_calcular_pago(
        registro_entrada_parqueo_id: int
) -> [int, ModalidadFraccionTiempoDetalle, timezone]:
    registro_entrada_parqueo = RegistroEntradaParqueo.objects.get(pk=registro_entrada_parqueo_id)
    hora_actual = timezone.now()
    hora_inicial = registro_entrada_parqueo.hora_ingreso
    minutos = ((hora_actual - hora_inicial).seconds / 60)
    modalidad = registro_entrada_parqueo.modalidad_fraccion_tiempo
    if not modalidad.fracciones.filter(minutos__lte=minutos).exists():
        tarifa = modalidad.fracciones.order_by('minutos')[:1].first()
    elif not modalidad.fracciones.filter(minutos__gte=minutos).exists():
        tarifa = modalidad.fracciones.order_by('-minutos')[:1].first()
    else:
        tarifas = modalidad.fracciones.filter(
            minutos__gte=minutos
        )
        tarifa = tarifas.order_by('minutos')[:1].first()
    return minutos, tarifa, hora_actual


def registro_entrada_parqueo_registrar_pago(
        registro_entrada_parqueo_id: int,
        usuario_pdv_id: int,
        modalidad_fraccion_tiempo_detalle_id: int
) -> RegistroEntradaParqueo:
    from .models import RegistroEntradaParqueo, ModalidadFraccionTiempoDetalle
    from cajas.services import transaccion_caja_registrar_venta_parqueadero

    usuario = User.objects.get(pk=usuario_pdv_id)
    if not hasattr(usuario, 'tercero'):
        raise serializers.ValidationError({'_error': 'Quien registra la entrada a parqueadero debe tener un tercero'})
    if not usuario.tercero.presente:
        raise serializers.ValidationError({'_error': 'Quien registra la entrada a parqueadero debe de estar presente'})
    punto_venta_turno = usuario.tercero.turno_punto_venta_abierto
    if not punto_venta_turno:
        raise serializers.ValidationError(
            {'_error': 'Quien registra la entrada a parqueadero debe tener un turno de punto de venta abierto'})

    tarifa = ModalidadFraccionTiempoDetalle.objects.get(
        pk=modalidad_fraccion_tiempo_detalle_id)

    registro_entrada_parqueo = RegistroEntradaParqueo.objects.get(pk=registro_entrada_parqueo_id)
    concepto = 'Cobro por parqueo para %s %s' % (tarifa.tipo_vehiculo_nombre, registro_entrada_parqueo.vehiculo.placa)
    registro_entrada_parqueo.hora_pago = timezone.now()
    registro_entrada_parqueo.valor_parqueadero = tarifa.valor_antes_impuestos
    registro_entrada_parqueo.valor_iva_parqueadero = tarifa.impuesto_iva
    registro_entrada_parqueo.valor_impuesto_unico = tarifa.valor_unico_impuesto
    registro_entrada_parqueo.detalle = concepto
    registro_entrada_parqueo.save()

    if registro_entrada_parqueo.valor_total != tarifa.valor:
        raise serializers.ValidationError(
            {
                '_error': 'Los valores calculados de tarifa y pago de parqueadero no coinciden. El valor de la tarifa es %s y el ingresado a pagar %s' % (
                    tarifa.valor,
                    registro_entrada_parqueo.valor_total
                )
            }
        )
    transaccion_caja_registrar_venta_parqueadero(
        registro_entrada_parqueo_id=registro_entrada_parqueo.id,
        punto_venta_turno_id=punto_venta_turno.id,
        concepto=concepto,
        valor_efectivo=registro_entrada_parqueo.valor_total
    )
    return registro_entrada_parqueo


def registro_entrada_parqueo_registrar_salida(
        registro_entrada_parqueo_id: int
) -> RegistroEntradaParqueo:
    from .models import RegistroEntradaParqueo
    registro_entrada_parqueo = RegistroEntradaParqueo.objects.get(pk=registro_entrada_parqueo_id)
    registro_entrada_parqueo.hora_salida = timezone.now()
    registro_entrada_parqueo.save()
    return registro_entrada_parqueo


def registro_entrada_parqueo_comprobante_entrada(registro_entrada_id):
    registro_entrada = RegistroEntradaParqueo.objects.select_related(
        'vehiculo',
        'vehiculo__tipo_vehiculo',
        'vehiculo__tipo_vehiculo__empresa',
        'punto_venta_turno',
        'punto_venta_turno__punto_venta',
        'punto_venta_turno__usuario',
        'punto_venta_turno__usuario__tercero',
    ).get(pk=registro_entrada_id)
    context = {
        "registro_entrada": registro_entrada
    }
    html_get_template = get_template('recibos/parqueadero/ticket_entrada.html').render(context)
    html = HTML(
        string=html_get_template
    )
    width = '80mm'
    height = '6cm'
    size = 'size: %s %s' % (width, height)
    margin = 'margin: 0.8cm 0.8cm 0.8cm 0.8cm'

    css_string = '@page {text-align: justify; font-family: Arial;font-size: 0.6rem;%s;%s}' % (size, margin)
    main_doc = html.render(stylesheets=[CSS(string=css_string)])
    return main_doc


def registro_entrada_parqueo_factura(registro_entrada_id):
    registro_entrada = RegistroEntradaParqueo.objects.select_related(
        'vehiculo',
        'vehiculo__tipo_vehiculo',
        'vehiculo__tipo_vehiculo__empresa',
        'punto_venta_turno',
        'punto_venta_turno__punto_venta',
        'punto_venta_turno__usuario',
        'punto_venta_turno__usuario__tercero',
    ).get(pk=registro_entrada_id)
    context = {
        "registro_entrada": registro_entrada
    }
    html_get_template = get_template('recibos/parqueadero/factura.html').render(context)
    html = HTML(
        string=html_get_template
    )
    width = '80mm'
    height = '8cm'
    size = 'size: %s %s' % (width, height)
    margin = 'margin: 0.8cm 0.8cm 0.8cm 0.8cm'

    css_string = '@page {text-align: justify; font-family: Arial;font-size: 0.6rem;%s;%s}' % (size, margin)
    main_doc = html.render(stylesheets=[CSS(string=css_string)])
    return main_doc
