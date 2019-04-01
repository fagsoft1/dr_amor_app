from django.db import models
from django.contrib.auth.models import User

from empresas.models import Empresa


class TipoHabitacion(models.Model):
    nombre = models.CharField(max_length=30, unique=True)
    valor = models.DecimalField(max_digits=10, decimal_places=0, default=0, verbose_name='Valor con Iva')
    comision = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    porcentaje_impuesto = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    @property
    def valor_antes_impuestos(self):
        return self.valor / (1 + (self.porcentaje_impuesto / 100))

    @property
    def impuesto(self):
        return self.valor - self.valor_antes_impuestos

    class Meta:
        permissions = [
            ['list_tipohabitacion', 'Puede listar tipos habitaciones'],
        ]


class Habitacion(models.Model):
    ESTADO_CHOICES = (
        (0, 'Disponible'),
        (1, 'Ocupada'),
        (2, 'Sucia'),
        (3, 'En Mantenimiento'),
        (4, 'Bloqueada'),
    )
    tipo = models.ForeignKey(TipoHabitacion, related_name='mis_habitaciones', verbose_name='Tipo de Habitación',
                             on_delete=models.PROTECT)
    numero = models.PositiveIntegerField()
    estado = models.PositiveIntegerField(choices=ESTADO_CHOICES, default=0)
    empresa = models.ForeignKey(Empresa, related_name='mis_habitaciones', on_delete=models.PROTECT)
    activa = models.BooleanField(default=False)
    fecha_ultimo_estado = models.DateTimeField(null=True, blank=True)

    class Meta:
        permissions = [
            ['list_habitacion', 'Puede listar habitaciones'],
        ]

    @property
    def nombre(self):
        return '%s %s' % (self.tipo.nombre, self.numero)
