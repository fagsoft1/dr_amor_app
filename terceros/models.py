from django.contrib.auth.models import User
from django.db import models

from terceros_acompanantes.models import CategoriaAcompanante


class Tercero(models.Model):
    CHOICES_TIPO_DOCUMENTO = (
        ('CC', 'Cédula Ciudadanía'),
        ('CE', 'Cédula Extrangería'),
        ('PS', 'Pasaporte'),
        ('TI', 'Tarjeta Identidad'),
        ('NI', 'Nit'),
    )

    CHOICES_SEXO = (
        ('F', 'Femenino'),
        ('M', 'Masculino')
    )

    usuario = models.OneToOneField(User, on_delete=models.PROTECT, related_name='tercero', null=True, blank=True)
    tipo_documento = models.CharField(max_length=2, choices=CHOICES_TIPO_DOCUMENTO, default='CC')
    nro_identificacion = models.CharField(max_length=30, unique=True)
    nombre = models.CharField(max_length=400)
    nombre_segundo = models.CharField(max_length=60, null=True, blank=True)
    apellido = models.CharField(max_length=60, null=True, blank=True)
    apellido_segundo = models.CharField(max_length=60, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    genero = models.CharField(choices=CHOICES_SEXO, default='F', max_length=20, null=True, blank=True)
    grupo_sanguineo = models.CharField(max_length=60, null=True, blank=True)
    es_acompanante = models.BooleanField(default=False)
    es_colaborador = models.BooleanField(default=False)
    es_proveedor = models.BooleanField(default=False)

    # campo para acompañante
    alias_modelo = models.CharField(max_length=120, blank=True, null=True, unique=True)
    categoria_modelo = models.ForeignKey(CategoriaAcompanante, on_delete=models.PROTECT, blank=True, null=True,
                                         related_name='acompanantes')

    @staticmethod
    def existe_documento(nro_identificacion: str) -> bool:
        return Tercero.objects.filter(nro_identificacion=nro_identificacion).exists()

    @staticmethod
    def existe_alias(alias: str) -> bool:
        return Tercero.objects.filter(alias_modelo=alias).exists()

    @property
    def full_name_proxy(self) -> str:
        if self.es_acompanante:
            return self.alias_modelo
        else:
            nombre_segundo = ''
            if self.nombre_segundo:
                nombre_segundo = ' %s' % (self.nombre_segundo)

            apellido_segundo = ''
            if self.apellido_segundo:
                apellido_segundo = ' %s' % (self.apellido_segundo)

            return '%s%s %s%s' % (self.nombre, nombre_segundo, self.apellido, apellido_segundo)

    @property
    def full_name(self) -> str:
        nombre_segundo = ''
        if self.nombre_segundo:
            nombre_segundo = ' %s' % (self.nombre_segundo)

        apellido_segundo = ''
        if self.apellido_segundo:
            apellido_segundo = ' %s' % (self.apellido_segundo)

        return '%s%s %s%s' % (self.nombre, nombre_segundo, self.apellido, apellido_segundo)

    @property
    def identificacion(self) -> str:
        return '%s %s' % (self.get_tipo_documento_display(), self.nro_identificacion)

    class Meta:
        unique_together = [('tipo_documento', 'nro_identificacion')]
        permissions = [
            ['list_terceroacompanante', 'Puede listar acompanantes'],
            ['detail_terceroacompanante', 'Puede ver detalles acompanantes'],
            ['add_terceroacompanante', 'Puede adicionar acompanantes'],
            ['delete_terceroacompanante', 'Puede eliminar acompanantes'],
            ['change_terceroacompanante', 'Puede cambiar acompanantes'],
            ['list_tercerocolaborador', 'Puede listar colaboradores'],
            ['detail_tercerocolaborador', 'Puede ver detalles colaboradores'],
            ['add_tercerocolaborador', 'Puede adicionar colaboradores'],
            ['delete_tercerocolaborador', 'Puede eliminar colaboradores'],
            ['change_tercerocolaborador', 'Puede cambiar colaboradores'],
            ['list_terceroproveedor', 'Puede listar proveedores'],
            ['detail_terceroproveedor', 'Puede ver detalles proveedores'],
            ['add_terceroproveedor', 'Puede adicionar proveedores'],
            ['delete_terceroproveedor', 'Puede eliminar proveedores'],
            ['change_terceroproveedor', 'Puede cambiar proveedores'],
        ]
