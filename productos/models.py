from django.db import models
from model_utils.models import TimeStampedModel

from empresas.models import Empresa
from terceros.models import Cuenta


class UnidadProducto(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        permissions = [
            ['list_unidadproducto', 'Puede listar unidades productos'],
        ]


class CategoriaProducto(models.Model):
    nombre = models.CharField(max_length=200, unique=True)
    codigo = models.CharField(max_length=10, unique=True)

    class Meta:
        permissions = [
            ['list_categoriaproducto', 'Puede listar categorias productos'],
        ]


class CategoriaDosProducto(models.Model):
    categoria = models.ForeignKey(CategoriaProducto, on_delete=models.PROTECT, related_name='categorias_dos')
    nombre = models.CharField(max_length=200, unique=True)
    codigo = models.CharField(max_length=10, unique=True)

    class Meta:
        permissions = [
            ['list_categoriadosproducto', 'Puede listar categorias dos productos'],
        ]


class Producto(models.Model):
    nombre = models.CharField(max_length=200, unique=True)
    categoria_dos = models.ForeignKey(CategoriaDosProducto, on_delete=models.PROTECT, related_name='productos')
    unidad_producto = models.ForeignKey(UnidadProducto, on_delete=models.PROTECT, related_name='productos')
    empresa = models.ForeignKey(Empresa, on_delete=models.PROTECT, related_name='productos')
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    comision = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    activo = models.BooleanField(default=True)

    class Meta:
        permissions = [
            ['list_producto', 'Puede listar productos'],
        ]
