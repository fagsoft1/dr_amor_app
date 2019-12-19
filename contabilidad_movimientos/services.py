from django.contrib.auth.models import User
from django.db.models import Sum
from django.template.loader import get_template
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from weasyprint import HTML, CSS

from .models import AsientoContable, ApunteContable
from contabilidad_cuentas.models import CuentaContable


def asiento_contable_con_comprobante_generar_tirilla(
        asiento_contable_id: int
):
    asiento_contable = AsientoContable.objects.get(pk=asiento_contable_id)
    comprobante_contable = asiento_contable.tipo_comprobante_bancario_empresa
    empresa = comprobante_contable.empresa
    context = {
        "nota": asiento_contable.nota,
        "fecha": asiento_contable.fecha,
        "concepto": asiento_contable.concepto,
        "nro_comprobante": asiento_contable.nro_comprobante,
        "tercero_nombre": asiento_contable.tercero.full_name_proxy if asiento_contable.tercero else None,
        "usuario": asiento_contable.usuario.get_full_name() if asiento_contable.usuario else None,
        "nit_empresa": empresa.nit if empresa else None,
        "nombre_empresa": empresa.nombre if empresa else None,
        "pais": comprobante_contable.pais_emision if comprobante_contable else None,
        "ciudad": comprobante_contable.ciudad_emision if comprobante_contable else None,
        "telefono": comprobante_contable.telefono_emision if comprobante_contable else None,
        "direccion": comprobante_contable.direccion_emision if comprobante_contable else None,
        "fecha_autorizacion": comprobante_contable.fecha_autorizacion if comprobante_contable else None,
        "rango_superior_numeracion": comprobante_contable.rango_superior_numeracion if comprobante_contable else None,
        "rango_inferior_numeracion": comprobante_contable.rango_inferior_numeracion if comprobante_contable else None,
        "numero_autorizacion": comprobante_contable.numero_autorizacion if comprobante_contable else None,
        "descripcion_comprobante": comprobante_contable.tipo_comprobante.descripcion if comprobante_contable else None,
        "codigo_comprobante": comprobante_contable.tipo_comprobante.codigo_comprobante,
        "valor": asiento_contable.total_credito
    }
    html_get_template = get_template('comprobantes_contables/comprobante_contable.html').render(context)
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


def asiento_contable_asentar_operacion_caja(
        concepto_id: int,
        usuario_pdv_id: int,
        valor: float,
        tercero_id: int = None,
        observacion: str = '',
) -> AsientoContable:
    from terceros.models import Tercero
    from cajas.models import ConceptoOperacionCaja

    if valor <= 0:
        raise ValidationError({'_error': 'El valor ingresado debe ser positivo mayor a cero'})

    usuario = User.objects.get(pk=usuario_pdv_id)
    if not hasattr(usuario, 'tercero'):
        raise ValidationError({'_error': 'Quien crea la operación debe tener un tercero'})
    if not usuario.tercero.presente:
        raise ValidationError({'_error': 'Quien crea de la operación debe estar presente'})

    concepto_operacion_caja = ConceptoOperacionCaja.objects.get(pk=concepto_id)

    if not concepto_operacion_caja.tipo_comprobante_contable_empresa.activo:
        raise ValidationError(
            {'_error': 'El concepto no tiene un comprobante activo, notifique al administrador del sistema'})

    if tercero_id is None:
        if concepto_operacion_caja.grupo in ['C', 'A', 'P']:
            raise ValidationError(
                {'_error': 'Para el concepto seleccionado se requiere un tercero'}
            )
        else:
            tercero_id = concepto_operacion_caja.tercero_cuenta_contrapartida_id
    else:
        if concepto_operacion_caja.grupo in ['O', 'T']:
            raise ValidationError(
                {'_error': 'Para los conceptos Otro y Taxi no se utiliza tercero'}
            )

        tercero = Tercero.objects.get(pk=tercero_id)
        if concepto_operacion_caja.grupo == 'C' and not tercero.es_colaborador:
            raise ValidationError(
                {'_error': 'Un tipo de operacion de caja para colaborador solo debe ser creada para un colaborador'})
        if concepto_operacion_caja.grupo == 'A' and not tercero.es_acompanante:
            raise ValidationError(
                {'_error': 'Un tipo de operacion de caja para acompañante solo debe ser creada para un acompañante'})
        if concepto_operacion_caja.grupo == 'P' and not tercero.es_proveedor:
            raise ValidationError(
                {'_error': 'Un tipo de operacion de caja para proveedor solo debe ser creada para un proveedor'})

        if tercero.es_acompanante or tercero.es_colaborador:
            if not tercero.presente:
                raise ValidationError({'_error': 'A quien se le crea la operación debe estar presente.'})

    punto_venta_turno = usuario.tercero.turno_punto_venta_abierto
    if not punto_venta_turno:
        raise ValidationError(
            {'_error': 'Quien crea de la operación debe tener un turno de punto de venta abierto'})

    tipo_comprobante = concepto_operacion_caja.tipo_comprobante_contable_empresa
    if tipo_comprobante.consecutivo_actual == tipo_comprobante.rango_superior_numeracion:
        raise ValidationError({
            '_error': 'Ya no hay consecutivos disponibles para %s, notifique al administrador del sistema' % concepto_operacion_caja.descripcion})

    if tipo_comprobante.tiene_vigencia:
        hoy = timezone.now().date()
        fecha_inicial_vigencia = tipo_comprobante.fecha_inicial_vigencia
        fecha_final_vigencia = tipo_comprobante.fecha_final_vigencia
        if hoy < fecha_inicial_vigencia or hoy > fecha_final_vigencia:
            raise ValidationError({
                '_error': 'La vigencia del comprobante %s caducó, notifique al administrador del sistema' % concepto_operacion_caja.descripcion})

    asiento_contable = AsientoContable()
    asiento_contable.tercero_id = tercero_id
    asiento_contable.tipo_comprobante_bancario_empresa = tipo_comprobante
    nro_consecutivo = tipo_comprobante.consecutivo_actual + 1
    asiento_contable.nro_comprobante = nro_consecutivo
    asiento_contable.diario_contable = concepto_operacion_caja.diario_contable
    asiento_contable.empresa = tipo_comprobante.empresa
    asiento_contable.concepto = concepto_operacion_caja.descripcion
    asiento_contable.fecha = timezone.now()
    asiento_contable.nota = observacion
    tipo_comprobante.consecutivo_actual = nro_consecutivo
    asiento_contable.usuario_id = usuario_pdv_id
    tipo_comprobante.save()
    asiento_contable.save()

    cuenta_contable_caja = CuentaContable.objects.get(pk=punto_venta_turno.punto_venta.cuenta_contable_caja_id)
    cuenta_contable_concepto_operacion_caja = CuentaContable.objects.get(
        pk=concepto_operacion_caja.cuenta_contable_contrapartida_id
    )

    ApunteContable.objects.create(
        asiento_contable=asiento_contable,
        debito=valor if concepto_operacion_caja.tipo == 'DEBITO' else 0,
        credito=valor if concepto_operacion_caja.tipo == 'CREDITO' else 0,
        cuenta_contable=cuenta_contable_caja,
    )

    ApunteContable.objects.create(
        asiento_contable=asiento_contable,
        debito=valor if concepto_operacion_caja.tipo == 'CREDITO' else 0,
        credito=valor if concepto_operacion_caja.tipo == 'DEBITO' else 0,
        tercero_id=tercero_id,
        cuenta_contable=cuenta_contable_concepto_operacion_caja,
    )

    return asiento_contable


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
