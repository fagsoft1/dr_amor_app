from .models import DatoGeneral


def dato_general_crear_actualizar(
        logo=None
) -> DatoGeneral:
    dato_general = DatoGeneral.objects.all()
    if not dato_general.exists():
        dato_general = DatoGeneral()
    else:
        dato_general = DatoGeneral.objects.first()
    dato_general.logo = logo
    dato_general.save()
    return DatoGeneral.objects.first()
