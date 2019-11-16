from rest_framework.exceptions import ValidationError

from .models import MetodoPago


def metodo_pago_crear_actualizar(
        nombre: str,
        tipo: int,
        diario_contable_id: int,
        cuenta_metodo_pago_id: int,
        cuenta_metodo_pago_devolucion_id: int,
        cuenta_bancaria_id: int = None,
        metodo_pago_id: int = None
) -> MetodoPago:
    if metodo_pago_id is not None:
        metodo_pago = MetodoPago.objects.get(pk=metodo_pago_id)
    else:
        metodo_pago = MetodoPago()
    metodo_pago.tipo = tipo
    if tipo in [3, 4]:
        qs = MetodoPago.objects.filter(tipo=tipo)
        if metodo_pago_id is not None:
            qs = qs.exclude(pk=metodo_pago_id)
        if qs.exists():
            raise ValidationError(
                {
                    '_error': 'Ya existe un tipo de método de pago %s y sólo puede existir uno' % metodo_pago.get_tipo_display()})
    metodo_pago.cuenta_metodo_pago_devolucion_id = cuenta_metodo_pago_devolucion_id
    metodo_pago.cuenta_metodo_pago_id = cuenta_metodo_pago_id
    metodo_pago.nombre = nombre
    metodo_pago.diario_contable_id = diario_contable_id
    metodo_pago.activo = True
    metodo_pago.cuenta_bancaria_id = cuenta_bancaria_id
    metodo_pago.save()
    return metodo_pago
