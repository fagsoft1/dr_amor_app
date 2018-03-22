from django.db import models


class Empresa(models.Model):
    nit = models.CharField(max_length=30, unique=True)
    nombre = models.CharField(max_length=200, unique=True)

    class Meta:
        permissions = [
            ['list_empresa', 'Puede listar empresas'],
        ]