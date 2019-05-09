from django.db import models


# Create your models here.
class CuentaContable(models.Model):
    NATURALEZA_CHOICES = (
        ('D', 'Débito'),
        ('C', 'Crédito'),
    )
    TIPO_CHOICES = (
        ('T', 'Título'),
        ('D', 'Detalle'),
    )
    codigo = models.CharField(unique=True, max_length=14, db_index=True)
    cuenta_nivel_1 = models.CharField(max_length=14)
    cuenta_nivel_2 = models.CharField(max_length=14)
    cuenta_nivel_3 = models.CharField(max_length=14)
    cuenta_nivel_4 = models.CharField(max_length=14)
    cuenta_nivel_5 = models.CharField(max_length=14)
    cuenta_nivel_6 = models.CharField(max_length=14)
    cuenta_nivel_7 = models.CharField(max_length=14)
    cuenta_nivel_8 = models.CharField(max_length=14)
    cuenta_nivel = models.IntegerField()
    descripcion = models.CharField(max_length=300)
    cuenta_padre = models.ForeignKey('self', on_delete=models.PROTECT, null=True, related_name='cuentas_hijas')
    naturaleza = models.CharField(choices=NATURALEZA_CHOICES, max_length=1)
    tipo = models.CharField(choices=TIPO_CHOICES, max_length=1)

    class Meta:
        permissions = [
            ['list_cuentacontable', 'Puede listar Cuentas Contables'],
        ]
