from datetime import date

from rest_framework.exceptions import ValidationError

from .models import TipoComprobanteContableEmpresa, TipoComprobanteContable
from empresas.models import Empresa


def tipo_comprobante_contable_crear_actualizar(
        codigo_comprobante: str,
        descripcion: str,
        titulo_comprobante: str,
        tipo_comprobante_contable_id: int = None,
        texto_uno: str = None,
        texto_dos: str = None,
        texto_tres: str = None,
) -> TipoComprobanteContable:
    if tipo_comprobante_contable_id is None:
        tipo_comprobante_contable = TipoComprobanteContable()
    else:
        tipo_comprobante_contable = TipoComprobanteContable.objects.get(pk=tipo_comprobante_contable_id)
    tipo_comprobante_contable.codigo_comprobante = codigo_comprobante
    tipo_comprobante_contable.descripcion = descripcion
    tipo_comprobante_contable.titulo_comprobante = titulo_comprobante
    tipo_comprobante_contable.texto_uno = texto_uno
    tipo_comprobante_contable.texto_dos = texto_dos
    tipo_comprobante_contable.texto_tres = texto_tres
    tipo_comprobante_contable.save()
    return tipo_comprobante_contable


# TODO: validar si ya hay transacciones para no dejar modificar, lo único modificable sería el estado a no activo
def tipo_comprobante_contable_empresa_crear_actualizar(
        tipo_comprobante_id: int,
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
        activo: str = False,
        empresa_id: int = None,
) -> TipoComprobanteContableEmpresa:
    if rango_inferior_numeracion < 0 or rango_superior_numeracion < 0:
        raise ValidationError({'_error': 'Los rangos de numeración deben de ser positivos'})

    if rango_inferior_numeracion > rango_superior_numeracion:
        raise ValidationError({'_error': 'El rango inferior de numeración no puede ser mayor al superior'})

    if consecutivo_actual < rango_inferior_numeracion or consecutivo_actual > rango_superior_numeracion:
        raise ValidationError({
            '_error': 'El consecutivo de numeración actual debe de estar entre los rangos superiores (%s) e inferiores (%s)' % (
                rango_superior_numeracion, rango_inferior_numeracion)})

    if tiene_vigencia and (fecha_inicial_vigencia is None or fecha_final_vigencia is None):
        raise ValidationError({'_error': 'Si tiene vigencia debe definir una fecha inicial y final para la misma'})

    tipo_comprobante = TipoComprobanteContable.objects.get(pk=tipo_comprobante_id)

    empresa = Empresa.objects.get(pk=empresa_id) if empresa_id else None

    if empresa:
        tiene_comprobantes = TipoComprobanteContableEmpresa.objects.filter(
            tipo_comprobante=tipo_comprobante,
            empresa=empresa,
            activo=True
        )
    else:
        tiene_comprobantes = TipoComprobanteContableEmpresa.objects.filter(
            tipo_comprobante=tipo_comprobante,
            empresa__isnull=True,
            activo=True
        )
    if tipo_comprobante_empresa_id is not None:
        tiene_comprobantes = tiene_comprobantes.exclude(id=tipo_comprobante_empresa_id)

    if activo and tiene_comprobantes.exists():
        raise ValidationError({
            '_error': 'Ya existe un consecutivo para este tipo de comprobante activo. Inactive el que ya no funcionara y realize el proceso de nuevo'})

    if tipo_comprobante_empresa_id is not None:
        tipo_comprobante_contable_empresa = TipoComprobanteContableEmpresa.objects.get(pk=tipo_comprobante_empresa_id)
    else:
        tipo_comprobante_contable_empresa = TipoComprobanteContableEmpresa()

    tipo_comprobante_contable_empresa.activo = activo

    tipo_comprobante_contable_empresa.tipo_comprobante_id = tipo_comprobante_id

    tipo_comprobante_contable_empresa.consecutivo_actual = consecutivo_actual
    tipo_comprobante_contable_empresa.numero_autorizacion = numero_autorizacion
    tipo_comprobante_contable_empresa.fecha_autorizacion = fecha_autorizacion
    tipo_comprobante_contable_empresa.empresa = empresa

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
