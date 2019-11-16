from django.db.models import Sum
from rest_framework.exceptions import ValidationError

from .models import AsientoContable, ApunteContable
from contabilidad_cuentas.models import CuentaContable


def cerrar_cuenta_a_tercero(
        terceri_id: int,
        cuenta_contable_id: int,
        asiento_contable_id: int,
        valor_asiento: float
) -> ApunteContable:
    apuntes_a_cerrar = ApunteContable.objects.exclude(apunte_contable_cierre__isnull=True).filter(
        cuenta_contable_id=cuenta_contable_id,
        terceri_id=terceri_id
    )
    valores_apuntes = apuntes_a_cerrar.annotate(
        credito=Sum('credito'),
        debito=Sum('debito')
    )
    credito = valores_apuntes['credito']
    debito = valores_apuntes['debito']
    apunte_contable_cierre = ApunteContable()
    apunte_contable_cierre.asiento_contable_id = asiento_contable_id
    apunte_contable_cierre.cuenta_contable_id = cuenta_contable_id
    apunte_contable_cierre.tercero_id = terceri_id

    cuenta_contable = CuentaContable.objects.get(pk=cuenta_contable_id)
    naturaleza_cuenta_contable = cuenta_contable.naturaleza

    if naturaleza_cuenta_contable == 'D':
        para_valor_cero = debito - credito
    else:
        para_valor_cero = credito - debito
    saldo_al_final = para_valor_cero - valor_asiento

    if naturaleza_cuenta_contable == 'D':
        apunte_contable_cierre.debito = saldo_al_final
    else:
        apunte_contable_cierre.credito = saldo_al_final
    apunte_contable_cierre.save()

    for apunte_contable in apuntes_a_cerrar.all():
        apunte_contable.apunte_contable_cierre = apunte_contable_cierre
        apunte_contable.save()

    return apunte_contable_cierre


def aumentar_disminuir_cuenta(
        tipo_accion: str,
        cuenta_contable_id: int,
        asiento_contable_id: int,
        valor_asiento: float,
        terceri_id: int = None,
) -> ApunteContable:
    cuenta_contable = CuentaContable.objects.get(pk=cuenta_contable_id)
    apunte_contable = ApunteContable()
    apunte_contable.asiento_contable_id = asiento_contable_id
    apunte_contable.cuenta_contable_id = cuenta_contable_id
    apunte_contable.tercero_id = terceri_id
    naturaleza_cuenta_contable = cuenta_contable.naturaleza
    if tipo_accion == 'A':  # Aumenta
        if naturaleza_cuenta_contable == 'D':
            apunte_contable.debito = valor_asiento
        else:
            apunte_contable.credito = valor_asiento
    elif tipo_accion == 'D':  # Disminuye
        if naturaleza_cuenta_contable == 'D':
            apunte_contable.credito = valor_asiento
        else:
            apunte_contable.debito = valor_asiento
    apunte_contable.save()
    return apunte_contable


def asiento_contable_asentar_apuntes(
        apuntes_contables: list,
        asiento_contable_id: int
) -> AsientoContable:
    asiento_contable = AsientoContable.objects.get(pk=asiento_contable_id)
    debitos = 0
    creditos = 0
    # Comprobamos que los débitos y creditos coincidan antes de guardar
    apuntes_contables_a_guardar = []
    apuntes_contables_a_eliminar = []
    for apunte in apuntes_contables:
        cuenta_contable_id = int(apunte.get('cuenta_contable'))
        accion = apunte.get('accion')
        debito = float(apunte.get('debito'))
        credito = float(apunte.get('credito'))
        id = apunte.get('id')

        if accion == 'DELETE':
            apunte = ApunteContable.objects.get(pk=int(id))
            apuntes_contables_a_eliminar.append(apunte)

        if accion == 'LOADED' or accion == 'EDITED':
            apunte = ApunteContable.objects.get(pk=int(id))
            apunte.credito = credito
            apunte.debito = debito
            apunte.cuenta_contable_id = cuenta_contable_id
            apunte.asiento_contable = asiento_contable
            apuntes_contables_a_guardar.append(apunte)
            debitos += float(debito)
            creditos += float(credito)

        if accion == 'CREATE':
            apunte_contable_nuevo = ApunteContable()
            apunte_contable_nuevo.credito = credito
            apunte_contable_nuevo.debito = debito
            apunte_contable_nuevo.cuenta_contable_id = cuenta_contable_id
            apunte_contable_nuevo.asiento_contable = asiento_contable
            apuntes_contables_a_guardar.append(apunte_contable_nuevo)
            debitos += float(debito)
            creditos += float(credito)

    if debitos != creditos:
        raise ValidationError({
            '_error': 'Los débitos no coinciden con los créditos. Valor de los débitos es %s y de los créditos %s' % (
                debitos, creditos)})
    [apunte.save() for apunte in apuntes_contables_a_guardar]
    [apunte.delete() for apunte in apuntes_contables_a_eliminar]
    return asiento_contable
