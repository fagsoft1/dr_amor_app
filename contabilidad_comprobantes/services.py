from datetime import date

from rest_framework.exceptions import ValidationError

from .models import TipoComprobanteContableEmpresa, TipoComprobanteContable
from empresas.models import Empresa


def tipo_comprobante_contable_empresa_crear_actualizar(
        tipo_comprobante_id: int,
        empresa_id: int,
        rango_inferior_numeracion: int,
        rango_superior_numeracion: int,
        consecutivo_actual: int,
        tipo_comprobante_empresa_id: int = None,
        numero_autorizacion: int = None,
        fecha_autorizacion: date = None,
        tiene_vigencia: bool = False,
        fecha_inicial_vigencia: date = None,
        fecha_final_vigencia: date = None,
        pais_emision: str = None,
        ciudad_emision: str = None,
        direccion_emision: str = None,
        telefono_emision: str = None,
) -> TipoComprobanteContableEmpresa:
    if rango_inferior_numeracion > rango_superior_numeracion:
        raise ValidationError({'_error': 'El rango inferior de numeración no puede ser mayor al superior'})

    if consecutivo_actual < rango_inferior_numeracion or consecutivo_actual > rango_superior_numeracion:
        raise ValidationError({
            '_error': 'El consecutivo de numeración actual debe de estar entre los rangos superiores (%s) e inferiores (%s)' % (
                rango_superior_numeracion, rango_inferior_numeracion)})

    if tiene_vigencia and fecha_inicial_vigencia is None or fecha_final_vigencia is None:
        raise ValidationError({'_error': 'Si tiene vigencia debe definir una fecha inicial y final para la misma'})

    empresa = Empresa.objects.get(pk=empresa_id)
    tipo_comprobante = TipoComprobanteContable.objects.get(pk=tipo_comprobante_id)
    qs_tiene_comprobante = empresa.tipos_comprobantes.filter(tipo_comprobante_id=tipo_comprobante_id)

    cambio_tipo_comprobante = False
    if tipo_comprobante_empresa_id is not None:
        tipo_comprobante_contable_empresa = TipoComprobanteContableEmpresa.objects.get(pk=tipo_comprobante_empresa_id)
        cambio_tipo_comprobante = tipo_comprobante_id != tipo_comprobante_contable_empresa.tipo_comprobante_id
    else:
        tipo_comprobante_contable_empresa = TipoComprobanteContableEmpresa()

    if tipo_comprobante_empresa_id is None or cambio_tipo_comprobante:
        if qs_tiene_comprobante.exists():
            raise ValidationError({
                '_error': 'La empresa ya tiene relacionado este tipo de documento (%s), no es posible relacionarse dos veces' % tipo_comprobante.descripcion})

    tipo_comprobante_contable_empresa.tipo_comprobante_id = tipo_comprobante_id

    tipo_comprobante_contable_empresa.consecutivo_actual = consecutivo_actual
    tipo_comprobante_contable_empresa.numero_autorizacion = numero_autorizacion
    tipo_comprobante_contable_empresa.fecha_autorizacion = fecha_autorizacion

    tipo_comprobante_contable_empresa.rango_inferior_numeracion = rango_inferior_numeracion
    tipo_comprobante_contable_empresa.rango_superior_numeracion = rango_superior_numeracion

    tipo_comprobante_contable_empresa.tiene_vigencia = tiene_vigencia
    tipo_comprobante_contable_empresa.fecha_inicial_vigencia = fecha_inicial_vigencia
    tipo_comprobante_contable_empresa.fecha_final_vigencia = fecha_final_vigencia

    tipo_comprobante_contable_empresa.pais_emision = pais_emision
    tipo_comprobante_contable_empresa.ciudad_emision = ciudad_emision
    tipo_comprobante_contable_empresa.direccion_emision = direccion_emision
    tipo_comprobante_contable_empresa.telefono_emision = telefono_emision

    tipo_comprobante_contable_empresa.save()
    return tipo_comprobante_contable_empresa
