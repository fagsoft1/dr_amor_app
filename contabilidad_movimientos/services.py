from rest_framework.exceptions import ValidationError

from .models import AsientoContable, ApunteContable


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
