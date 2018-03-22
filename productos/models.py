from django.db import models
from empresas.models import Empresa


class UnidadProducto(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        permissions = [
            ['list_unidadproducto', 'Puede listar unidades productos'],
        ]


class Categoria(models.Model):
    nombre = models.CharField(max_length=200, unique=True)
    codigo = models.CharField(max_length=3, unique=True)

    class Meta:
        permissions = [
            ['list_categoria', 'Puede listar categorias productos'],
        ]


class CategoriaDos(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='categorias_dos')
    nombre = models.CharField(max_length=200, unique=True)
    codigo = models.CharField(max_length=3, unique=True)

    class Meta:
        permissions = [
            ['list_categoriados', 'Puede listar categorias dos productos'],
        ]


class Producto(models.Model):
    nombre = models.CharField(max_length=200, unique=True)
    categoria_dos = models.ForeignKey(CategoriaDos, on_delete=models.PROTECT, related_name='productos')
    unidad_producto = models.ForeignKey(UnidadProducto, on_delete=models.PROTECT, related_name='productos')
    empresa = models.ForeignKey(Empresa, on_delete=models.PROTECT, related_name='productos')
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    activo = models.BooleanField(default=True)

    class Meta:
        permissions = [
            ['list_producto', 'Puede listar productos'],
        ]
