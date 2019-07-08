from django.db import models
from django.contrib.auth.models import User

from empresas.models import Empresa
from contabilidad_impuestos.models import Impuesto


class TipoHabitacion(models.Model):
    nombre = models.CharField(max_length=30, unique=True)
    valor = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    valor_adicional_servicio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    impuestos = models.ManyToManyField(Impuesto, related_name='tipos_habitaciones')

    @property
    def valor_antes_impuestos(self):
        valor = self.valor
        valor_impuestos_tipo_3 = 0
        impuestos_tipo_3 = self.impuestos.filter(tipo_calculo_impuesto=3)
        if impuestos_tipo_3:
            for impuesto in impuestos_tipo_3:
                if impuesto.tipo_calculo_impuesto == 3:
                    valor_impuestos_tipo_3 += impuesto.tasa_importe_venta
                    valor -= impuesto.tasa_importe_venta

        impuestos_tipo_1 = self.impuestos.filter(tipo_calculo_impuesto=1)
        if impuestos_tipo_1:
            for impuesto in impuestos_tipo_1:
                if impuesto.tipo_calculo_impuesto == 1:
                    valor = valor / (1 + (impuesto.tasa_importe_venta / 100))
        return valor

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
        verbose_name_plural = 'Habitaciones'
        permissions = [
            ['list_habitacion', 'Puede listar habitaciones'],
        ]

    @property
    def nombre(self):
        return '%s %s' % (self.tipo.nombre, self.numero)
