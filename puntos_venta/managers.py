from django.db import models
from django.db.models import Q, ExpressionWrapper, Sum, DecimalField, IntegerField


# region PuntoVentaTurno Managers
class PuntoVentaTurnoQuerySet(models.QuerySet):
    def abiertos(self):
        return self.filter(finish__isnull=True)

    def cerrados(self):
        return self.filter(finish__isnull=False)


class PuntoVentaTurnoManager(models.Manager):
    def get_queryset(self):
        return PuntoVentaTurnoQuerySet(self.model, using=self._db).select_related(
            'punto_venta'
        ).annotate(
            total_efectivo=ExpressionWrapper(
                Sum('transacciones_caja__valor_efectivo'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            total_tarjeta=ExpressionWrapper(
                Sum('transacciones_caja__valor_tarjeta'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            total_tarjeta_cantidad=ExpressionWrapper(
                Sum('transacciones_caja__nro_vauchers'),
                output_field=IntegerField()
            )
        ).all()
# endregion
