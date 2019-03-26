from django.db import models
from django.db.models import ExpressionWrapper, Sum, DecimalField


class VentasProductosManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related(
            'cuenta'
        ).annotate(
            precio_total=ExpressionWrapper(
                Sum('productos__precio_total'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            cantidad=ExpressionWrapper(
                Sum('productos__cantidad'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
        ).all()
