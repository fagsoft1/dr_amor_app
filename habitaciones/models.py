from django.db import models
from django.contrib.auth.models import User

from empresas.models import Empresa


class TipoHabitacion(models.Model):
    nombre = models.CharField(max_length=30, unique=True)
    valor = models.DecimalField(max_digits=10, decimal_places=0, default=0, verbose_name='Valor con Iva')

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
    )
    tipo = models.ForeignKey(TipoHabitacion, related_name='mis_habitaciones', verbose_name='Tipo de Habitación',
                             on_delete=models.PROTECT)
    numero = models.PositiveIntegerField()
    estado = models.PositiveIntegerField(choices=ESTADO_CHOICES, default=0)
    empresa = models.ForeignKey(Empresa, related_name='mis_habitaciones', on_delete=models.PROTECT)
    activa = models.BooleanField(default=1)

    class Meta:
        permissions = [
            ['list_habitacion', 'Puede listar habitaciones'],
        ]

    @property
    def nombre(self):
        return '%s %s' % (self.tipo.nombre, self.numero)
