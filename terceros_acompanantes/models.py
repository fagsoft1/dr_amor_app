from django.db import models


class CategoriaAcompanante(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        permissions = [
            ['list_categoriaacompanante', 'Puede listar categorias acompanantes'],
            ['detail_categoriaacompanante', 'Puede ver detalles categoria acompanante'],
        ]


class FraccionTiempo(models.Model):
    minutos = models.PositiveIntegerField(unique=True)
    nombre = models.CharField(max_length=20, unique=True)

    class Meta:
        permissions = [
            ['list_fracciontiempo', 'Puede listar fraciones de tiempo'],
        ]


class CategoriaFraccionTiempo(models.Model):
    categoria = models.ForeignKey(CategoriaAcompanante, on_delete=models.CASCADE, related_name='fracciones')
    fraccion_tiempo = models.ForeignKey(FraccionTiempo, on_delete=models.CASCADE, related_name='categorias')
    valor = models.DecimalField(max_digits=10, decimal_places=0, default=0)

    class Meta:
        unique_together = [('categoria', 'fraccion_tiempo')]
        permissions = [
            ['list_categoriafracciontiempo', 'Puede listar fraciones de tiempo x categoria'],
        ]
