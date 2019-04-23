from django.contrib.auth.models import User
from django.template.loader import get_template
from rest_framework import serializers
from weasyprint import HTML, CSS

from terceros.models import Tercero
from .models import LiquidacionCuenta


def liquidar_cuenta_mesero(
        colaborador_id: int,
        punto_venta_turno_id,
        valor_tarjetas: float = 0,
        nro_vauchers: int = 0,
        valor_efectivo: float = 0
) -> LiquidacionCuenta:
    from cajas.services import transaccion_caja_liquidacion_cuenta_mesero
    from terceros.models import Cuenta

    colaborador = Tercero.objects.get(pk=colaborador_id)
    if not colaborador.es_colaborador:
        raise serializers.ValidationError(
            {'_error': 'Sólo se puede liquidar una cuenta mesero a alguien que sea un colaborador'})
    if not colaborador.presente:
        raise serializers.ValidationError(
            {'_error': 'Sólo se puede liquidar una cuenta mesero a colaborador presente'}
        )

    cuenta_actual = Cuenta.cuentas_meseros.sin_liquidar().filter(propietario__tercero__id=colaborador_id).first()
    if not cuenta_actual:
        raise serializers.ValidationError(
            {'_error': 'No hay nada que deba pagar este mesero'})

    valor_que_debe_entregar = cuenta_actual.valor_ventas_productos
    entregado = valor_tarjetas + valor_efectivo
    liquidacion_anterior = colaborador.ultima_cuenta_mesero_liquidada
    saldo_anterior = liquidacion_anterior.liquidacion.saldo if liquidacion_anterior else 0

    saldo = valor_que_debe_entregar + saldo_anterior - entregado
    cuenta_actual.liquidada = True
    cuenta_actual.save()

    liquidacion_cuenta = LiquidacionCuenta.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        cuenta=cuenta_actual,
        saldo_anterior=saldo_anterior,
        a_cobrar_a_tercero=valor_que_debe_entregar,
        pagado=entregado,
        efectivo=valor_efectivo,
        tarjeta_o_transferencia=valor_tarjetas,
        saldo=saldo
    )
    transaccion_caja_liquidacion_cuenta_mesero(
        liquidacion_mesero_id=liquidacion_cuenta.id,
        punto_venta_turno_id=punto_venta_turno_id,
        valor_efectivo=valor_efectivo,
        valor_tarjeta=valor_tarjetas,
        nro_vauchers=nro_vauchers
    )
    return liquidacion_cuenta


def liquidar_cuenta_mesero_generar_comprobante(
        liquidacion_id
):
    liquidacion = LiquidacionCuenta.objects.get(pk=liquidacion_id)
    context = {
        "liquidacion": liquidacion
    }
    html_get_template = get_template('recibos/liquidaciones/liquidacion_mesero_comprobante.html').render(context)
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


def liquidar_cuenta_acompanante(
        acompanante_id: int,
        punto_venta_turno_id,
        valor_transferencia: float = 0,
        valor_efectivo: float = 0
) -> LiquidacionCuenta:
    from cajas.services import transaccion_caja_liquidacion_cuenta_acompanante
    from terceros.models import Cuenta

    acompanante = Tercero.objects.get(pk=acompanante_id)
    if not acompanante.es_acompanante:
        raise serializers.ValidationError(
            {'_error': 'Sólo se puede liquidar una cuenta a un tercero que sea acompanante'})
    if not acompanante.presente:
        raise serializers.ValidationError(
            {'_error': 'Sólo se puede liquidar cuenta a una acompanante presente'}
        )

    cuenta_actual = Cuenta.cuentas_acompanantes.sin_liquidar().filter(
        propietario__tercero__id=acompanante_id
    ).first()

    if not cuenta_actual:
        raise serializers.ValidationError(
            {'_error': 'No hay nada para liquidar para acompañante'})

    valor_a_pagar_a_acompanante = cuenta_actual.total_ingresos
    valor_a_cobrar_a_acompanante = cuenta_actual.total_egresos

    liquidacion_anterior = acompanante.ultima_cuenta_liquidada
    saldo_anterior = liquidacion_anterior.liquidacion.saldo if liquidacion_anterior else 0
    valor_a_entregar = valor_a_pagar_a_acompanante - valor_a_cobrar_a_acompanante
    pagado = valor_transferencia + valor_efectivo

    saldo = valor_a_entregar - pagado + saldo_anterior

    cuenta_actual.liquidada = True
    cuenta_actual.save()

    liquidacion_cuenta = LiquidacionCuenta.objects.create(
        punto_venta_turno_id=punto_venta_turno_id,
        cuenta=cuenta_actual,
        saldo_anterior=saldo_anterior,
        a_cobrar_a_tercero=valor_a_cobrar_a_acompanante,
        a_pagar_a_tercero=valor_a_pagar_a_acompanante,
        pagado=pagado,
        efectivo=valor_efectivo,
        tarjeta_o_transferencia=valor_transferencia,
        saldo=saldo
    )
    if valor_efectivo > 0:
        transaccion_caja_liquidacion_cuenta_acompanante(
            liquidacion_mesero_id=liquidacion_cuenta.id,
            punto_venta_turno_id=punto_venta_turno_id,
            valor_efectivo=valor_efectivo
        )

    return liquidacion_cuenta


def liquidar_cuenta_acompanante_generar_comprobante(
        liquidacion_id
):
    liquidacion = LiquidacionCuenta.objects.select_related(
        'cuenta',
        'cuenta__propietario',
        'cuenta__propietario__tercero',
        'punto_venta_turno',
        'punto_venta_turno__usuario',
        'punto_venta_turno__usuario__tercero',
        'punto_venta_turno__punto_venta',
    ).get(pk=liquidacion_id)
    context = {
        "liquidacion": liquidacion
    }
    html_get_template = get_template('recibos/liquidaciones/liquidacion_acompanante_comprobante.html').render(context)
    html = HTML(
        string=html_get_template
    )
    width = '80mm'
    height = '12cm'
    size = 'size: %s %s' % (width, height)
    margin = 'margin: 0.8cm 0.8cm 0.8cm 0.8cm'

    css_string = '@page {text-align: justify; font-family: Arial;font-size: 0.6rem;%s;%s}' % (size, margin)
    main_doc = html.render(stylesheets=[CSS(string=css_string)])
    return main_doc


def liquidar_cuenta_colaborador(
        colaborador_id: int,
        user_id: int,
        valor_cuadre_cierre_nomina
) -> LiquidacionCuenta:
    from terceros.models import Cuenta
    if valor_cuadre_cierre_nomina < 0:
        raise serializers.ValidationError(
            {'_error': 'El valor ingresado para el cuadre de liquidación del colaborador debe ser mayor a 0'})
    colaborador = Tercero.objects.get(pk=colaborador_id)
    if not colaborador.es_colaborador:
        raise serializers.ValidationError(
            {'_error': 'Sólo se puede liquidar una cuenta a un tercero que sea colaborador'})
    if not colaborador.presente:
        raise serializers.ValidationError(
            {'_error': 'Sólo se puede liquidar cuenta a un colaborador presente'}
        )

    cuenta_actual = Cuenta.cuentas_colaboradores.sin_liquidar().filter(
        propietario__tercero__id=colaborador_id
    ).first()

    if not cuenta_actual:
        raise serializers.ValidationError(
            {'_error': 'No hay nada para liquidar para colaborador'})

    valor_a_pagar_a_colaborador = cuenta_actual.total_ingresos
    valor_a_cobrar_a_colaborador = cuenta_actual.total_egresos

    liquidacion_anterior = colaborador.ultima_cuenta_liquidada
    saldo_anterior = liquidacion_anterior.liquidacion.saldo if liquidacion_anterior else 0
    valor_a_cobrar = valor_a_cobrar_a_colaborador - valor_a_pagar_a_colaborador
    cobrado = valor_cuadre_cierre_nomina
    saldo = valor_a_cobrar + saldo_anterior - cobrado

    cuenta_actual.liquidada = True
    cuenta_actual.save()

    liquidacion_cuenta = LiquidacionCuenta.objects.create(
        creado_por_id=user_id,
        cuenta=cuenta_actual,
        saldo_anterior=saldo_anterior,
        a_cobrar_a_tercero=valor_a_cobrar_a_colaborador,
        a_pagar_a_tercero=valor_a_pagar_a_colaborador,
        pagado=cobrado,
        efectivo=0,
        tarjeta_o_transferencia=0,
        saldo=saldo
    )

    return liquidacion_cuenta


def liquidar_cuenta_colaborador_generar_comprobante(
        liquidacion_id,
        user_id=None
):
    liquidacion = LiquidacionCuenta.objects.select_related(
        'cuenta',
        'cuenta__propietario',
        'cuenta__propietario__tercero'
    ).get(pk=liquidacion_id)
    if user_id:
        user = User.objects.get(pk=user_id)
    else:
        user = None
    context = {
        "liquidacion": liquidacion,
        "user": user
    }
    html_get_template = get_template('recibos/liquidaciones/liquidacion_colaborador_comprobante.html').render(context)
    html = HTML(
        string=html_get_template
    )
    width = '80mm'
    height = '12cm'
    size = 'size: %s %s' % (width, height)
    margin = 'margin: 0.8cm 0.8cm 0.8cm 0.8cm'

    css_string = '@page {text-align: justify; font-family: Arial;font-size: 0.6rem;%s;%s}' % (size, margin)
    main_doc = html.render(stylesheets=[CSS(string=css_string)])
    return main_doc
