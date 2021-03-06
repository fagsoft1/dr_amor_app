import sys

from django.contrib.auth.models import User
from django.db.models import Sum, F
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from puntos_venta.models import PuntoVenta, PuntoVentaTurno
from contabilidad_cuentas.models import CuentaContable


def punto_venta_crear_actualizar(
        tipo: int,
        nombre: str,
        bodega_id: int = None,
        cuenta_contable_caja_id: int = None,
        punto_venta_id: int = None,
) -> PuntoVenta:
    if punto_venta_id is not None:
        punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    else:
        punto_venta = PuntoVenta()
    punto_venta.bodega_id = bodega_id
    cuenta_contable_caja = CuentaContable.objects.get(pk=cuenta_contable_caja_id)
    if cuenta_contable_caja.tipo != 'D':
        raise ValidationError(
            {'_error': 'La cuenta contable de la caja debería ser de tipo detalle y no lo es y no lo es'})
    if cuenta_contable_caja.naturaleza != 'D':
        raise ValidationError({'_error': 'La cuenta contable de la caja debería ser de naturaleza débito y no lo es'})
    punto_venta.cuenta_contable_caja_id = cuenta_contable_caja_id
    punto_venta.nombre = nombre
    punto_venta.tipo = tipo
    punto_venta.save()
    return punto_venta


def punto_venta_set_operacion_caja_en_cierre(
        punto_venta_id: int,
        concepto_operacion_caja_id: int,
        en_cierre: bool
) -> PuntoVenta:
    from cajas.models import ConceptoOperacionCaja
    punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    concepto_operacion_caja = ConceptoOperacionCaja(pk=concepto_operacion_caja_id)
    conceptos_operaciones_caja = punto_venta.conceptos_operaciones_caja_punto_venta.filter(
        concepto_operacion_caja_id=concepto_operacion_caja_id)
    if not conceptos_operaciones_caja.exists():
        raise ValidationError({
            '_error': 'Este puento de venta no tiene relacionado el concepto de cierre de caja %s' % concepto_operacion_caja.descripcion})
    concepto = conceptos_operaciones_caja.first()
    concepto.para_cierre_caja = en_cierre
    concepto.save()
    return PuntoVenta.objects.get(pk=punto_venta_id)


def punto_venta_set_metodo_pago_activo(
        punto_venta_id: int,
        metodo_pago_id: int,
        activo: bool
) -> PuntoVenta:
    from contabilidad_metodos_pago.models import MetodoPago
    punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    metodo_pago = MetodoPago(pk=metodo_pago_id)
    metodos_pago_punto_venta = punto_venta.metodos_pagos_punto_venta.filter(
        metodo_pago_id=metodo_pago_id)
    if not metodos_pago_punto_venta.exists():
        raise ValidationError({
            '_error': 'Este puento de venta no tiene relacionado el método de pago %s %s' % (
                metodo_pago.tipo, metodo_pago.nombre)})
    concepto = metodos_pago_punto_venta.first()
    concepto.activo = activo
    concepto.save()
    return PuntoVenta.objects.get(pk=punto_venta_id)


def punto_venta_relacionar_concepto_operacion_caja(
        punto_venta_id: int,
        concepto_operacion_caja_id: int
) -> PuntoVenta:
    from cajas.models import ConceptoOperacionCaja
    from cajas.models import ConceptoOperacionCajaPuntoVenta
    punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    existe_concepto = punto_venta.conceptos_operaciones_caja.filter(pk=concepto_operacion_caja_id).exists()
    concepto_operacion_caja = ConceptoOperacionCaja.objects.get(pk=concepto_operacion_caja_id)
    if not existe_concepto:
        ConceptoOperacionCajaPuntoVenta.objects.create(
            punto_venta_id=punto_venta_id,
            concepto_operacion_caja_id=concepto_operacion_caja_id,
            para_cierre_caja=False
        )
    else:
        raise serializers.ValidationError(
            {'_error': 'Este punto de venta ya tiene asociado el concepto %s' % concepto_operacion_caja.descripcion})
    return PuntoVenta.objects.get(pk=punto_venta_id)


def punto_venta_quitar_concepto_operacion_caja(
        punto_venta_id: int,
        concepto_operacion_caja_id: int
) -> PuntoVenta:
    from cajas.models import ConceptoOperacionCaja
    punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    concepto_operacion_caja = ConceptoOperacionCaja.objects.get(pk=concepto_operacion_caja_id)
    conceptos_punto_venta = punto_venta.conceptos_operaciones_caja_punto_venta.filter(
        concepto_operacion_caja_id=concepto_operacion_caja_id)
    if conceptos_punto_venta.exists():
        conceptos_punto_venta.delete()
    else:
        raise serializers.ValidationError(
            {'_error': 'Este punto de venta no tiene asociado el concepto %s' % concepto_operacion_caja.descripcion})
    return PuntoVenta.objects.get(pk=punto_venta_id)


def punto_venta_relacionar_metodo_pago(
        punto_venta_id: int,
        metodo_pago_id: int
) -> PuntoVenta:
    from contabilidad_metodos_pago.models import MetodoPagoPuntoVenta, MetodoPago
    punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    existe_concepto = punto_venta.metodos_pago.filter(pk=metodo_pago_id)
    metodo_pago = MetodoPago.objects.get(pk=metodo_pago_id)
    if not existe_concepto:
        MetodoPagoPuntoVenta.objects.create(
            punto_venta_id=punto_venta_id,
            metodo_pago_id=metodo_pago_id,
            activo=True
        )
    else:
        raise serializers.ValidationError(
            {'_error': 'Este punto de venta ya tiene asociado el método de pago %s %s' % (
                metodo_pago.tipo, metodo_pago.nombre)})
    return PuntoVenta.objects.get(pk=punto_venta_id)


def punto_venta_quitar_metodo_pago(
        punto_venta_id: int,
        metodo_pago_id: int
) -> PuntoVenta:
    from contabilidad_metodos_pago.models import MetodoPago
    punto_venta = PuntoVenta.objects.get(pk=punto_venta_id)
    metodo_pago = MetodoPago.objects.get(pk=metodo_pago_id)
    metodos_pago_punto_venta = punto_venta.metodos_pagos_punto_venta.filter(
        metodo_pago_id=metodo_pago_id)
    if metodos_pago_punto_venta.exists():
        metodos_pago_punto_venta.delete()
    else:
        raise serializers.ValidationError(
            {'_error': 'Este punto de venta no tiene asociado el método de pago %s %s' % (
                metodo_pago.tipo, metodo_pago.nombre)})
    return PuntoVenta.objects.get(pk=punto_venta_id)


def punto_venta_abrir(
        usuario_pv_id: int,
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
            punto_venta_turno_anterior = PuntoVentaTurno.objects.filter(usuario=usuario).last()
            punto_venta_turno = PuntoVentaTurno.objects.create(
                usuario=usuario,
                punto_venta=punto_venta,
                diferencia_cierre_caja_anterior=punto_venta_turno_anterior.diferencia_cierre_caja if punto_venta_turno_anterior else 0,
                turno_anterior=punto_venta_turno_anterior,
                base_inicial_efectivo=base_inicial_efectivo
            )
            if base_inicial_efectivo > 0:
                from cajas.services import transaccion_caja_registrar_ingreso_base_inicial_apertura_caja
                transaccion_caja_registrar_ingreso_base_inicial_apertura_caja(
                    punto_venta_turno_id=punto_venta_turno.id,
                    valor_efectivo=base_inicial_efectivo
                )

    punto_venta.abierto = True
    punto_venta.usuario_actual = User.objects.get(pk=usuario_pv_id)
    punto_venta.save()
    return punto_venta, punto_venta_turno


from cajas.models import ArqueoCaja


def punto_venta_cerrar(
        usuario_pv_id: int,
        entrega_efectivo_dict: dict,
        operaciones_caja_dict,
        entrega_base_dict: dict,
        valor_tarjeta: float,
        nro_vauchers: int,
        valor_dolares: float,
        tasa_dolar: float,
) -> [PuntoVenta, ArqueoCaja]:
    usuario = User.objects.get(pk=usuario_pv_id)
    if hasattr(usuario, 'tercero'):
        tercero = usuario.tercero
        punto_venta_turno = tercero.turno_punto_venta_abierto
        if punto_venta_turno:
            from cajas.models import (
                ArqueoCaja,
                EfectivoEntregaDenominacion,
                BaseDisponibleDenominacion
            )
            from cajas.services import (
                transaccion_caja_registrar_egreso_entrega_base_cierre_caja,
                transaccion_caja_registrar_egreso_entrega_efectivo_cierre_caja,
                operacion_caja_crear
            )

            from cajas.models import ConceptoOperacionCaja
            for operacion_caja in operaciones_caja_dict:
                id_concepto = int(operacion_caja.get('id'))
                concepto = ConceptoOperacionCaja.objects.get(pk=id_concepto)
                valor = float(operacion_caja.get('valor'))

                if valor > 0:
                    operacion_caja_crear(
                        concepto_id=id_concepto,
                        usuario_pdv_id=usuario_pv_id,
                        valor=valor,
                        observacion='Desde cierre de caja'
                    )

            # region Valores Transacciones
            transacciones_egresos = punto_venta_turno.transacciones_caja.filter(
                punto_venta_turno_id=punto_venta_turno.id,
                tipo='E'
            )
            transacciones_ingresos = punto_venta_turno.transacciones_caja.filter(
                punto_venta_turno_id=punto_venta_turno.id,
                tipo='I'
            )

            total_ingreso_efectivo = transacciones_ingresos.aggregate(
                total=Coalesce(Sum('valor_efectivo'), 0)
            )['total']

            total_ingreso_tarjeta = transacciones_ingresos.aggregate(
                total=Coalesce(Sum('valor_tarjeta'), 0)
            )['total']

            total_egreso_efectivo = -transacciones_egresos.aggregate(
                total=Coalesce(Sum('valor_efectivo'), 0)
            )['total']

            total_egreso_tarjeta = -transacciones_egresos.aggregate(
                total=Coalesce(Sum('valor_tarjeta'), 0)
            )['total']

            cantidad_ventas_tarjeta = transacciones_ingresos.aggregate(
                cantidad=Coalesce(Sum('nro_vauchers'), 0)
            )['cantidad']

            total_a_recibir_efectivo = total_ingreso_efectivo - total_egreso_efectivo
            total_a_recibir_tarjeta = total_ingreso_tarjeta - total_egreso_tarjeta

            # endregion
            arqueo = ArqueoCaja.objects.create(
                punto_venta_turno_id=punto_venta_turno.id,
                valor_pago_efectivo_a_entregar=total_a_recibir_efectivo,
                valor_pago_tarjeta_a_entregar=total_a_recibir_tarjeta,
                nro_voucher_a_entregar=cantidad_ventas_tarjeta,
                dolares_tasa=tasa_dolar,
                valor_dolares_entregados=valor_dolares,
                valor_tarjeta_entregados=valor_tarjeta,
                nro_voucher_entregados=nro_vauchers
            )

            for denominacion in entrega_efectivo_dict:
                cantidad = int(denominacion.get('cantidad'))
                valor = float(denominacion.get('valor'))
                valor_total = cantidad * valor
                if cantidad > 0:
                    EfectivoEntregaDenominacion.objects.create(
                        arqueo_caja=arqueo,
                        valor_total=valor_total,
                        **denominacion
                    )
            for denominacion in entrega_base_dict:
                cantidad = int(denominacion.get('cantidad'))
                valor = float(denominacion.get('valor'))
                valor_total = cantidad * valor
                if cantidad > 0:
                    BaseDisponibleDenominacion.objects.create(
                        arqueo_caja=arqueo,
                        valor_total=valor_total,
                        **denominacion
                    )

            if 'test' in sys.argv:
                print('-----------------DATOS ARQUEO CAJA-------------------------')
                print('Arqueo dinero entrega efectivo %s' % arqueo.valor_entrega_efectivo)
                print('Arqueo dinero entrega base efectivo %s' % arqueo.valor_base_dia_siguiente)
                print('Arqueo dinero entrega dolares %s' % arqueo.valor_dolares_en_pesos)
                print('Arqueo dinero entrega efectivo total %s' % arqueo.valor_entrega_efectivo_total)

                print('-----------------------------------------------------------')
                print('Valor ingresos totales %s' % (total_ingreso_efectivo + total_ingreso_tarjeta))
                print('Valor egresos totales %s' % (total_egreso_efectivo + total_egreso_tarjeta))
                print('Valor ingreso transacciones en efectivo %s' % total_ingreso_efectivo)
                print('Valor ingreso transacciones en tarjeta %s' % total_ingreso_tarjeta)
                print('Valor egresos transacciones en efectivo %s' % total_egreso_efectivo)
                print('Valor egresos transacciones en tarjeta %s' % total_egreso_tarjeta)
                print('Valor a recibir transacciones en efectivo %s' % total_a_recibir_efectivo)

            total_entrega_efectivo = arqueo.valor_entrega_efectivo_total

            transaccion_caja_registrar_egreso_entrega_efectivo_cierre_caja(
                punto_venta_turno_id=punto_venta_turno.id,
                valor_efectivo=total_entrega_efectivo
            )
            transaccion_caja_registrar_egreso_entrega_base_cierre_caja(
                punto_venta_turno_id=punto_venta_turno.id,
                valor_efectivo=arqueo.valor_base_dia_siguiente
            )

            total_entrega_tarjeta = arqueo.valor_tarjeta_entregados

            descuadre_efectivo = total_a_recibir_efectivo - total_entrega_efectivo
            descuadre_tarjeta = total_a_recibir_tarjeta - total_entrega_tarjeta

            if 'test' in sys.argv:
                print('-----------------------------------------------------------')
                print('Descuadre por efectivo %s' % descuadre_efectivo)
                print('Descuadre por tarjeta %s' % descuadre_tarjeta)

            punto_venta = punto_venta_turno.punto_venta
            punto_venta.abierto = False
            punto_venta.usuario_actual = None
            punto_venta.save()
            punto_venta_turno.finish = timezone.now()
            punto_venta_turno.saldo_cierre_caja = arqueo.diferencia
            punto_venta_turno.save()
            if 'test' in sys.argv:
                print('el saldo es %s' % punto_venta_turno.diferencia_cierre_caja)
        else:
            raise serializers.ValidationError(
                {'_error': 'Este tercero no posee ningún punto de venta abierto actualmente'}
            )
    else:
        raise serializers.ValidationError(
            {
                '_error': 'El usuario no tiene un tercero relacionado, por ende, no tiene ningún punto de venta que cerrar'}
        )
    return punto_venta, arqueo
