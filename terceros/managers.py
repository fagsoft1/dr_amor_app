from django.db import models
from django.db.models import Q


class TerceroQuerySet(models.QuerySet):
    def presentes(self):
        return self.filter(presente=True)

    def ausentes(self):
        return self.filter(presente=False)

    def activos(self):
        return self.filter(usuario__is_active=True)


class AcompanantesManager(models.Manager):
    def get_queryset(self):
        return TerceroQuerySet(self.model, using=self._db).select_related('usuario', 'categoria_modelo').filter(
            es_acompanante=True
        )

    def presentes(self):
        return self.get_queryset().presentes()

    def ausentes(self):
        return self.get_queryset().ausentes()


class InternosManager(models.Manager):
    def get_queryset(self):
        return TerceroQuerySet(self.model, using=self._db).select_related('usuario', 'categoria_modelo').filter(
            Q(es_acompanante=True) |
            Q(es_colaborador=True)
        )

    def presentes(self):
        return self.get_queryset().presentes()

    def ausentes(self):
        return self.get_queryset().ausentes()


class ColaboradoresManager(models.Manager):
    def get_queryset(self):
        return TerceroQuerySet(self.model, using=self._db).select_related(
            'usuario'
        ).filter(es_colaborador=True)

    def presentes(self):
        return self.get_queryset().presentes()

    def ausentes(self):
        return self.get_queryset().ausentes()


class ProveedoresManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(es_proveedor=True)
