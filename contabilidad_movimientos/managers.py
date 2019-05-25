from django.db import models
from django.db.models import Q, Sum, OuterRef, Subquery, DecimalField, ExpressionWrapper, F, When, Case
from django.db.models.functions import Coalesce


class AsientoContableQuerySet(models.QuerySet):
    def consolidado(self):
        return self.filter(consolidada=True)

    def sin_consolidar(self):
        return self.filter(consolidada=False)


class AsientoContableManager(models.Manager):
    def get_queryset(self):
        return AsientoContableQuerySet(self.model, using=self._db).annotate(
            debitos=Coalesce(Sum('apuntes_contables__debito'), 0),
            creditos=Coalesce(Sum('apuntes_contables__credito'), 0)
        )

    def consolidada(self):
        return self.get_queryset().consolidada()

    def sin_consolidar(self):
        return self.get_queryset().sin_consolidar()
