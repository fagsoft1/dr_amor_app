import reversion

from django.db import models


@reversion.register()
class Empresa(models.Model):
    nit = models.CharField(max_length=30, unique=True)
    nombre = models.CharField(max_length=200, unique=True)

    class Meta:
        permissions = [
            ['list_empresa', 'Puede listar empresas'],
        ]


class Comprobante(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.PROTECT, related_name='comprobantes')
    titulo_comprobante = models.CharField(max_length=300)
    titulo_interno = models.CharField(max_length=300)
    activo = models.BooleanField(default=False)
    nro_resolucion_dian = models.CharField(max_length=100)
    consecutivo = models.IntegerField()
    prefijo = models.CharField(max_length=10)
    numero_inicial = models.IntegerField()
    numero_final = models.IntegerField()
    fecha_autorizacion = models.DateTimeField()
    no_mostrar_mensaje_resolucion = models.BooleanField(default=False)
    direccion = models.CharField(max_length=200)
    ciudad = models.CharField(max_length=200)
    telefono = models.CharField(max_length=200)
