from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from empresas.models import Empresa


class TipoHabitacion(models.Model):
    nombre = models.CharField(max_length=30, unique=True)
    valor = models.DecimalField(max_digits=10, decimal_places=0, default=0, verbose_name='Valor con Iva')
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
    activa = models.BooleanField(default=1)
    fecha_ultimo_estado = models.DateTimeField(null=True, blank=True)

    def iniciar_servicios(self, usuario, servicios, punto_venta):
        self.save()
        [servicio.iniciar(usuario, punto_venta) for servicio in servicios.all()]
        self.cambiar_estado(1)

    class Meta:
        permissions = [
            ['list_habitacion', 'Puede listar habitaciones'],
        ]

    @property
    def nombre(self):
        return '%s %s' % (self.tipo.nombre, self.numero)

    def cambiar_estado(self, nuevo_estado):
        if self.estado != nuevo_estado:
            temp_estado = None
            if self.estado == 0:
                if nuevo_estado in [1, 2, 3]:
                    temp_estado = nuevo_estado
            elif self.estado == 1:
                if nuevo_estado == 2:
                    servicios = self.servicios.filter(estado=1)
                    if not servicios.exists():
                        [servicio.delete() for servicio in self.servicios.filter(estado=0)]
                        temp_estado = nuevo_estado
            elif self.estado == 2:
                if nuevo_estado in [0, 3]:
                    temp_estado = nuevo_estado
            elif self.estado == 3:
                if nuevo_estado in [0, 2]:
                    temp_estado = nuevo_estado

            if temp_estado in [0, 1, 2, 3]:
                self.estado = temp_estado
                self.fecha_ultimo_estado = timezone.localtime(timezone.now())
                self.save()
        return self.estado == nuevo_estado
