from django.db import models


class CategoriaAcompanante(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        permissions = [
            ['list_categoriaacompanante', 'Puede listar categorias acompanantes'],
            ['detail_categoriaacompanante', 'Puede ver detalles categoria acompanante'],
        ]
