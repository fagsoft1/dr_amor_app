from django.db.models import Max
from django.db.models.functions import Coalesce
from rest_framework.exceptions import ValidationError

from .models import CuentaContable


def cuenta_contable_evaluar_codigo_formato(
        nivel: int,
        codigo: str
):
    if nivel == 1 and len(codigo) != 1:
        raise ValidationError(
            {'_error': 'Una clase debe tener 1 digito en su código'}
        )
    if nivel == 2 and len(codigo) != 2:
        raise ValidationError(
            {'_error': 'Un grupo debe tener 2 digitos en su código'}
        )
    if nivel == 3 and len(codigo) != 4:
        raise ValidationError(
            {'_error': 'Una cuenta debe tener 4 digitos en su código'}
        )
    if nivel == 4 and len(codigo) != 6:
        raise ValidationError(
            {'_error': 'Una subcuenta debe tener 6 digitos en su código'}
        )
    if nivel == 5 and len(codigo) != 8:
        raise ValidationError(
            {'_error': 'Una cuenta nivel 5 debe tener 8 digitos en su código'}
        )
    if nivel == 6 and len(codigo) != 10:
        raise ValidationError(
            {'_error': 'Una cuenta nivel 6 debe tener 10 digitos en su código'}
        )
    if nivel == 7 and len(codigo) != 12:
        raise ValidationError(
            {'_error': 'Una cuenta nivel 7 debe tener 12 digitos en su código'}
        )
    if nivel == 8 and len(codigo) != 14:
        raise ValidationError(
            {'_error': 'Una cuenta nivel 8 debe tener 14 digitos en su código'}
        )


def cuenta_contable_evaluar_codigo_padre_codigo_hijo(
        codigo_hijo: str,
        codigo_padre: str,
):
    if len(codigo_hijo) <= len(codigo_padre):
        raise ValidationError(
            {'_error': 'El código de la cuenta padre no puede ser mayor o igual al código de la cuenta'}
        )
    sub_codigo_hijo = codigo_hijo[0: len(codigo_padre)]
    if codigo_padre != sub_codigo_hijo:
        raise ValidationError(
            {'_error': 'El código hijo debe contener el padre. El hijo comienza por %s mientras que el padre %s' % (
                sub_codigo_hijo, codigo_padre)}
        )


def asignar_codigos_cuentas_niveles(
        cuenta: CuentaContable
) -> CuentaContable:
    nivel = cuenta.cuenta_nivel
    cuenta.cuenta_nivel_1 = cuenta.codigo[:1]
    cuenta.cuenta_nivel_2 = cuenta.codigo if nivel <= 2 else cuenta.codigo[:2]
    cuenta.cuenta_nivel_3 = cuenta.codigo if nivel <= 3 else cuenta.codigo[:4]
    cuenta.cuenta_nivel_4 = cuenta.codigo if nivel <= 4 else cuenta.codigo[:6]
    cuenta.cuenta_nivel_5 = cuenta.codigo if nivel <= 5 else cuenta.codigo[:8]
    cuenta.cuenta_nivel_6 = cuenta.codigo if nivel <= 6 else cuenta.codigo[:10]
    cuenta.cuenta_nivel_7 = cuenta.codigo if nivel <= 7 else cuenta.codigo[:12]
    cuenta.cuenta_nivel_8 = cuenta.codigo if nivel <= 8 else cuenta.codigo[:14]
    cuenta.save()
    return cuenta


def cuenta_contable_cambiar_cuenta_padre(
        cuenta_contable_padre_id: int,
        cuenta_contable_id: int,
        calcular_codigo=False
) -> CuentaContable:
    cuenta_contable_padre = CuentaContable.objects.get(pk=cuenta_contable_padre_id)

    if cuenta_contable_padre.tipo == 'D':
        raise ValidationError({'_error': 'La cuenta padre debe ser una cuenta título'})

    codigo_padre = cuenta_contable_padre.codigo
    nivel_padre = cuenta_contable_padre.id
    tamano_padre = len(cuenta_contable_padre.codigo)

    cuenta_contable = CuentaContable.objects.get(pk=cuenta_contable_id)
    cuenta_contable_codigo = cuenta_contable.codigo

    cuenta_contable_codigo = codigo_padre + cuenta_contable_codigo[tamano_padre:]

    if calcular_codigo:
        cuenta_contable_codigo = codigo_padre + cuenta_contable.codigo[-2:]
        busqueda = cuenta_contable_padre.cuentas_hijas.filter(codigo=cuenta_contable_codigo)
        if busqueda.exists():
            cuenta_contable_codigo_max = cuenta_contable_padre.cuentas_hijas.aggregate(
                max=Coalesce(Max('codigo'), 0)
            )['max']
            if cuenta_contable_codigo_max == 0:
                if nivel_padre == 1:
                    cuenta_contable_codigo = codigo_padre + '1'
                if nivel_padre > 1:
                    cuenta_contable_codigo = codigo_padre + '01'
            else:
                cuenta_contable_codigo = cuenta_contable_codigo_max

    cuenta_contable.codigo = cuenta_contable_codigo
    cuenta_contable.cuenta_padre = cuenta_contable_padre
    cuenta_contable.cuenta_nivel = cuenta_contable_padre.cuenta_nivel + 1
    cuenta_contable.save()
    cuenta_contable = asignar_codigos_cuentas_niveles(cuenta_contable)

    for cuenta in cuenta_contable.cuentas_hijas.all():
        cuenta_contable_cambiar_cuenta_padre(
            cuenta_contable_padre_id=cuenta_contable.id,
            cuenta_contable_id=cuenta.id,
            calcular_codigo=True
        )

    return cuenta_contable


def cuenta_contable_crear_actualizar(
        descripcion,
        codigo: str,
        naturaleza: str,
        cuenta_padre_id: int = None,
        cuenta_contable_id: int = None
) -> CuentaContable:
    cuenta_padre = None
    if cuenta_padre_id:
        cuenta_padre = CuentaContable.objects.get(pk=cuenta_padre_id)
        if cuenta_padre.tipo == 'D':
            raise ValidationError(
                {'_error': 'La cuenta padre asignada es de tipo Detalle. Una cuenta padre debe ser tipo Título'})

    nivel = 1
    busqueda_cuenta = CuentaContable.objects.filter(codigo=codigo)
    if cuenta_contable_id:
        busqueda_cuenta = busqueda_cuenta.exclude(pk=cuenta_contable_id)
    if busqueda_cuenta.exists():
        raise ValidationError({'_error': 'Ya existe una cuenta con el código %s' % codigo})

    if not cuenta_contable_id:
        if cuenta_padre:
            cuenta_contable_evaluar_codigo_formato(
                nivel=cuenta_padre.cuenta_nivel + 1,
                codigo=codigo
            )
            cuenta_contable_evaluar_codigo_padre_codigo_hijo(
                codigo_padre=cuenta_padre.codigo,
                codigo_hijo=codigo
            )
            nivel = cuenta_padre.cuenta_nivel + 1

        cuenta = CuentaContable.objects.create(
            descripcion=descripcion,
            codigo=codigo,
            cuenta_padre=cuenta_padre,
            cuenta_nivel=nivel,
            cuenta_nivel_1=codigo,
            cuenta_nivel_2=codigo,
            cuenta_nivel_3=codigo,
            cuenta_nivel_4=codigo,
            cuenta_nivel_5=codigo,
            cuenta_nivel_6=codigo,
            cuenta_nivel_7=codigo,
            cuenta_nivel_8=codigo,
            tipo='T',
            naturaleza=naturaleza
        )
        cuenta = asignar_codigos_cuentas_niveles(cuenta)

    else:
        cuenta = CuentaContable.objects.get(pk=cuenta_contable_id)
        quito_padre = cuenta.cuenta_padre and not cuenta_padre_id
        coloco_padre = not cuenta.cuenta_padre and cuenta_padre_id
        cambio_padre = cuenta.cuenta_padre and cuenta.cuenta_padre.id != cuenta_padre_id
        cambio_codigo = cuenta.codigo != codigo

        cuenta.naturaleza = naturaleza
        cuenta.descripcion = descripcion
        cuenta.save()

        if quito_padre:
            cuenta_contable_evaluar_codigo_formato(
                nivel=1,
                codigo=codigo
            )
            cuenta.cuenta_padre = None
            cuenta.codigo = codigo
            cuenta.save()
            cuenta = asignar_codigos_cuentas_niveles(cuenta)

            for hija in cuenta.cuentas_hijas.all():
                cuenta = cuenta_contable_cambiar_cuenta_padre(
                    cuenta_contable_id=hija.id,
                    cuenta_contable_padre_id=cuenta.id,
                    calcular_codigo=True
                )

        elif cambio_padre or coloco_padre:
            cuenta_contable_evaluar_codigo_formato(
                nivel=cuenta_padre.cuenta_nivel + 1,
                codigo=codigo
            )

            cuenta_contable_evaluar_codigo_padre_codigo_hijo(
                codigo_padre=cuenta_padre.codigo,
                codigo_hijo=codigo
            )
            cuenta.codigo = codigo
            cuenta.save()
            cuenta = cuenta_contable_cambiar_cuenta_padre(
                cuenta_contable_id=cuenta_contable_id,
                cuenta_contable_padre_id=cuenta_padre_id
            )
            cuenta.save()

        elif cambio_codigo:
            cuenta_contable_evaluar_codigo_formato(
                nivel=cuenta.cuenta_nivel,
                codigo=codigo
            )
            if cuenta.cuenta_padre:
                cuenta_contable_evaluar_codigo_padre_codigo_hijo(
                    codigo_padre=cuenta_padre.codigo,
                    codigo_hijo=codigo
                )
            cuenta.codigo = codigo
            cuenta.save()
            cuenta = asignar_codigos_cuentas_niveles(cuenta)
            for hija in cuenta.cuentas_hijas.all():
                cuenta_contable_cambiar_cuenta_padre(
                    cuenta_contable_id=hija.id,
                    cuenta_contable_padre_id=cuenta.id,
                    calcular_codigo=True
                )

    return cuenta
