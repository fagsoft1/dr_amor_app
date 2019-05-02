import random

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Sum
from django.db.models.functions import Coalesce

from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit

from model_utils.models import TimeStampedModel
from rest_framework import serializers

from terceros.managers import (
    AcompanantesManager,
    ColaboradoresManager,
    ProveedoresManager,
    InternosManager,
    CuentaMeseroManager, CuentaAcompananteManager, CuentaColaboradorManager)
from terceros_acompanantes.models import CategoriaAcompanante


class Tercero(models.Model):
    def imagen_perfil_upload_to(self, filename) -> str:  # pragma: no cover
        nro_random = random.randint(1111, 9999)
        return "img/usuarios/perfil/%s01j%sj10%s.%s" % (self.id, nro_random, self.id, filename.split('.')[-1])

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

    CHOICES_ESTADO = (
        (0, 'Disponible'),
        (1, 'Ocupado')
    )

    usuario = models.OneToOneField(User, on_delete=models.PROTECT, related_name='tercero', null=True, blank=True)
    tipo_documento = models.CharField(max_length=2, choices=CHOICES_TIPO_DOCUMENTO, default='CC')
    nro_identificacion = models.CharField(
        max_length=30,
        unique=True,

    )
    nombre = models.CharField(max_length=400)
    nombre_segundo = models.CharField(max_length=60, null=True, blank=True)
    apellido = models.CharField(max_length=60, null=True, blank=True)
    apellido_segundo = models.CharField(max_length=60, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    genero = models.CharField(choices=CHOICES_SEXO, default='F', max_length=20, null=True, blank=True)
    grupo_sanguineo = models.CharField(
        max_length=60,
        null=True
    )
    es_acompanante = models.BooleanField(default=False)
    es_colaborador = models.BooleanField(default=False)
    es_proveedor = models.BooleanField(default=False)
    presente = models.BooleanField(default=False)
    pin = models.CharField(max_length=128, null=True)
    qr_acceso = models.CharField(max_length=300, null=True)
    imagen_perfil = ProcessedImageField(
        processors=[ResizeToFit(300, 300)],
        format='PNG',
        options={'quality': 100},
        null=True,
        blank=True,
        upload_to=imagen_perfil_upload_to
    )
    # campo para acompañante
    alias_modelo = models.CharField(
        max_length=120,
        null=True,
        unique=True,
        error_messages={'unique': "Este alias ya esta siendo utilizado por otra modelo. Por favor escoger otro"}
    )
    categoria_modelo = models.ForeignKey(
        CategoriaAcompanante,
        on_delete=models.PROTECT,
        null=True,
        related_name='acompanantes'
    )
    estado = models.PositiveIntegerField(choices=CHOICES_ESTADO, default=0)

    objects = models.Manager()
    acompanantes = AcompanantesManager()
    colaboradores = ColaboradoresManager()
    proveedores = ProveedoresManager()
    internos = InternosManager()

    @property
    def full_name_proxy(self) -> str:
        if self.es_acompanante:
            return self.alias_modelo
        else:
            nombre_segundo = ''
            if self.nombre_segundo:
                nombre_segundo = ' %s' % (self.nombre_segundo)

            apellido = ''
            if self.apellido_segundo:
                apellido = ' %s' % (self.apellido)

            apellido_segundo = ''
            if self.apellido_segundo:
                apellido_segundo = ' %s' % (self.apellido_segundo)

            return '%s%s %s%s' % (self.nombre, nombre_segundo, apellido, apellido_segundo)

    @property
    def full_name(self) -> str:
        from terceros.services import acompanante_desencriptar
        nombre = self.nombre
        apellido = self.apellido
        if self.es_acompanante:
            nombre = acompanante_desencriptar(self.nombre)
            apellido = acompanante_desencriptar(self.apellido)
        nombre_segundo = ''

        if self.nombre_segundo:
            nombre_segundo = ' %s' % (self.nombre_segundo)
            if self.es_acompanante:
                nombre_segundo = ' %s' % acompanante_desencriptar(self.nombre_segundo)

        apellido_segundo = ''
        if self.apellido_segundo:
            apellido_segundo = ' %s' % (self.apellido_segundo)
            if self.es_acompanante:
                apellido_segundo = ' %s' % acompanante_desencriptar(self.apellido_segundo)

        return '%s%s %s%s' % (nombre, nombre_segundo, apellido, apellido_segundo)

    @property
    def identificacion(self) -> str:
        from terceros.services import acompanante_desencriptar
        nro_identificacion = self.nro_identificacion
        if self.es_acompanante:
            nro_identificacion = acompanante_desencriptar(nro_identificacion)
        return '%s %s' % (self.tipo_documento, nro_identificacion)

    @property
    def cuenta_abierta_mesero(self):
        if not self.es_colaborador:
            raise serializers.ValidationError(
                {'_error': 'Las cuentas abiertas de mesero solo pueden ser para colaboradores'})
        cuenta_sin_liquidar = Cuenta.cuentas_meseros.sin_liquidar().filter(propietario__tercero=self)
        if cuenta_sin_liquidar.count() > 1:
            raise serializers.ValidationError(
                {
                    '_error': 'Sólo debe de haber 1 o 0 cuentas mesero de tipo 2 no liquidada. Hay %s' % cuenta_sin_liquidar.count()}
            )
        cuenta = cuenta_sin_liquidar.first()
        if not cuenta:
            ultima_cuenta_liquidada = self.ultima_cuenta_mesero_liquidada
            self.usuario.cuentas.create(liquidada=False, tipo=2, cuenta_anterior=ultima_cuenta_liquidada)
            cuenta = cuenta_sin_liquidar.first()
        return cuenta

    @property
    def ultima_cuenta_mesero_liquidada(self):
        if not self.es_colaborador:
            raise serializers.ValidationError(
                {'_error': 'Las cuentas liquidadas de mesero solo pueden ser para colaboradores'})

        cuenta_liquidada = Cuenta.cuentas_meseros.liquidada().filter(propietario__tercero=self)
        if cuenta_liquidada.exists():
            return cuenta_liquidada.last()
        return None

    @property
    def turno_punto_venta_abierto(self):
        if not self.es_colaborador:
            raise serializers.ValidationError(
                {'_error': 'Los turnos de punto de venta solo pueden existir para colaboradores'})
        turno_pv_abierta = self.usuario.turnos_punto_venta.filter(finish__isnull=True)
        if turno_pv_abierta.count() > 1:
            raise serializers.ValidationError(
                {
                    '_error': 'Sólo debe de haber 1 o 0 turnos abiertos en punto de venta. Hay %s' % turno_pv_abierta.count()
                }
            )
        if turno_pv_abierta.exists():
            return turno_pv_abierta.first()
        else:
            return None

    @property
    def cuenta_abierta(self):
        if self.es_acompanante:
            cuentas_sin_liquidar = Cuenta.cuentas_acompanantes.sin_liquidar().filter(propietario__tercero=self)
        elif self.es_colaborador:
            cuentas_sin_liquidar = Cuenta.cuentas_colaboradores.sin_liquidar().filter(propietario__tercero=self)
        else:
            cuentas_sin_liquidar = None

        if cuentas_sin_liquidar:
            if cuentas_sin_liquidar.count() > 1:
                raise serializers.ValidationError(
                    {
                        '_error': 'Sólo debe de haber 1 o 0 cuentas de tipo 1 no liquidada. Hay %s' % cuentas_sin_liquidar.count()}
                )
        cuenta = cuentas_sin_liquidar.last()
        if not cuenta:
            ultima_cuenta_liquidada = self.ultima_cuenta_liquidada
            self.usuario.cuentas.create(liquidada=False, tipo=1, cuenta_anterior=ultima_cuenta_liquidada)
            cuenta = cuentas_sin_liquidar.last()
        return cuenta

    @property
    def ultima_cuenta_liquidada(self):
        if self.es_acompanante:
            cuentas_liquidadas = Cuenta.cuentas_acompanantes.liquidada().filter(propietario__tercero=self)
        elif self.es_colaborador:
            cuentas_liquidadas = Cuenta.cuentas_colaboradores.liquidada().filter(propietario__tercero=self)
        else:
            cuentas_liquidadas = None

        if cuentas_liquidadas.exists():
            return cuentas_liquidadas.last()
        return None

    class Meta:
        unique_together = [('tipo_documento', 'nro_identificacion')]
        permissions = [
            ['list_tercero', 'Puede listar terceros'],
            ['view_terceroacompanante', 'Can view acompanantes'],
            ['view_privado_terceroacompanante', 'Can view acompanantes privado'],
            ['add_terceroacompanante', 'Puede adicionar acompanantes'],
            ['delete_terceroacompanante', 'Puede eliminar acompanantes'],
            ['change_terceroacompanante', 'Puede cambiar acompanantes'],
            ['list_terceroacompanante', 'Puede listar acompanantes'],
            ['view_tercerocolaborador', 'Can view colaboradores'],
            ['add_tercerocolaborador', 'Puede adicionar colaboradores'],
            ['delete_tercerocolaborador', 'Puede eliminar colaboradores'],
            ['change_tercerocolaborador', 'Puede cambiar colaboradores'],
            ['list_tercerocolaborador', 'Puede listar colaboradores'],
            ['view_terceroproveedor', 'Can view proveedores'],
            ['add_terceroproveedor', 'Puede adicionar proveedores'],
            ['delete_terceroproveedor', 'Puede eliminar proveedores'],
            ['change_terceroproveedor', 'Puede cambiar proveedores'],
            ['list_terceroproveedor', 'Puede listar proveedores'],
            ['can_be_waiter', 'Puede Ser Mesero(a)'],
        ]


class Cuenta(TimeStampedModel):
    TIPO_CHOICES = (
        (1, 'Propia'),
        (2, 'Mesero'),
    )
    cuenta_anterior = models.OneToOneField(
        'self',
        null=True,
        on_delete=models.PROTECT,
        related_name='cuenta_siguiente'
    )
    propietario = models.ForeignKey(User, null=True, blank=True, on_delete=models.PROTECT, related_name='cuentas')
    liquidada = models.BooleanField(default=False, db_index=True)
    tipo = models.PositiveIntegerField(choices=TIPO_CHOICES, default=1)

    objects = models.Manager()
    cuentas_meseros = CuentaMeseroManager()
    cuentas_acompanantes = CuentaAcompananteManager()
    cuentas_colaboradores = CuentaColaboradorManager()
