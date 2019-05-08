from rest_framework.exceptions import ValidationError

from .models import CuentaContable


def cuenta_contable_crear(
        descripcion,
        codigo: int,
        naturaleza: int,
        cuenta_padre_id: int = None
) -> CuentaContable:
    cuenta_padre = None
    nivel = 1

    cuenta_existe = CuentaContable.objects.filter(codigo=codigo).exists()
    if cuenta_existe:
        raise ValidationError({'_error': 'Ya existe una cuenta con el código %s' % codigo})

    if not cuenta_padre_id and codigo > 9:
        raise ValidationError({'_error': 'Una clase no debe tener 1 dígito en su código'})

    if cuenta_padre_id:
        cuenta_padre = CuentaContable.objects.get(pk=cuenta_padre_id)
        nivel = cuenta_padre.cuenta_nivel + 1

        cuenta_padre.tipo = 'T'
        cuenta_padre.save()

        cuenta_padre_codigo_str = str(cuenta_padre.codigo)
        tamano_codigo_cuenta_padre = len(cuenta_padre_codigo_str)
        codigo_nuevo = str(codigo)[:tamano_codigo_cuenta_padre]

        if codigo_nuevo != str(cuenta_padre.codigo):
            raise ValidationError({
                '_error': 'Los dígitos no concuerdan con la cuenta padre. Cuenta padre es %s y la nueva cuenta hija inicia por %s' % (
                    cuenta_padre_codigo_str, codigo_nuevo)})

        cuenta_nivel_1 = cuenta_padre.cuenta_nivel_1
        cuenta_nivel_2 = cuenta_padre.cuenta_nivel_2
        cuenta_nivel_3 = cuenta_padre.cuenta_nivel_3
        cuenta_nivel_4 = cuenta_padre.cuenta_nivel_4
        cuenta_nivel_5 = cuenta_padre.cuenta_nivel_5
        cuenta_nivel_6 = cuenta_padre.cuenta_nivel_6
        cuenta_nivel_7 = cuenta_padre.cuenta_nivel_7
        cuenta_nivel_8 = cuenta_padre.cuenta_nivel_8

        if nivel == 2:
            if not (10 <= codigo <= 99):
                raise ValidationError(
                    {'_error': 'Un grupo debe tener 2 digitos en su código'}
                )

            cuenta_nivel_2 = codigo
            cuenta_nivel_3 = codigo
            cuenta_nivel_4 = codigo
            cuenta_nivel_5 = codigo
            cuenta_nivel_6 = codigo
            cuenta_nivel_7 = codigo
            cuenta_nivel_8 = codigo

        if nivel == 3:
            if not (1000 <= codigo <= 9999):
                raise ValidationError(
                    {'_error': 'Una cuenta debe tener 4 digitos en su código'}
                )

            cuenta_nivel_3 = codigo
            cuenta_nivel_4 = codigo
            cuenta_nivel_5 = codigo
            cuenta_nivel_6 = codigo
            cuenta_nivel_7 = codigo
            cuenta_nivel_8 = codigo

        if nivel == 4:
            if not (100000 <= codigo <= 999999):
                raise ValidationError(
                    {'_error': 'Una subcuenta debe tener 6 digitos en su código'}
                )
            cuenta_nivel_4 = codigo
            cuenta_nivel_5 = codigo
            cuenta_nivel_6 = codigo
            cuenta_nivel_7 = codigo
            cuenta_nivel_8 = codigo

        if nivel == 5:
            cuenta_nivel_5 = codigo
            cuenta_nivel_6 = codigo
            cuenta_nivel_7 = codigo
            cuenta_nivel_8 = codigo

        if nivel == 6:
            cuenta_nivel_6 = codigo
            cuenta_nivel_7 = codigo
            cuenta_nivel_8 = codigo

        if nivel == 7:
            cuenta_nivel_7 = codigo
            cuenta_nivel_8 = codigo

        if nivel == 8:
            cuenta_nivel_8 = codigo
    else:
        cuenta_nivel_1 = codigo
        cuenta_nivel_2 = codigo
        cuenta_nivel_3 = codigo
        cuenta_nivel_4 = codigo
        cuenta_nivel_5 = codigo
        cuenta_nivel_6 = codigo
        cuenta_nivel_7 = codigo
        cuenta_nivel_8 = codigo

    cuenta = CuentaContable.objects.create(
        descripcion=descripcion,
        codigo=codigo,
        cuenta_padre=cuenta_padre,
        cuenta_nivel=nivel,
        cuenta_nivel_1=cuenta_nivel_1,
        cuenta_nivel_2=cuenta_nivel_2,
        cuenta_nivel_3=cuenta_nivel_3,
        cuenta_nivel_4=cuenta_nivel_4,
        cuenta_nivel_5=cuenta_nivel_5,
        cuenta_nivel_6=cuenta_nivel_6,
        cuenta_nivel_7=cuenta_nivel_7,
        cuenta_nivel_8=cuenta_nivel_8,
        tipo='D',
        naturaleza=naturaleza
    )

    return cuenta
