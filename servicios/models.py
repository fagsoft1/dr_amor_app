from django.contrib.auth.models import User
from django.db import models
from django.db.models import Max
from django.utils import timezone

from model_utils.models import TimeStampedModel

from empresas.models import Empresa
from habitaciones.models import Habitacion
from terceros.models import Cuenta


class VentaServicio(TimeStampedModel):
    ESTADO_CHOICES = (
        (0, 'Activo'),
        (2, 'Iniciado'),
        (3, 'Terminado'),
    )
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='servicios_registrados')
    habitacion = models.ForeignKey(Habitacion, on_delete=models.PROTECT, related_name='ventas_servicios')
    estado = models.IntegerField(choices=ESTADO_CHOICES, default=0)

    def cambiar_estado(self, estado_nuevo):
        if not estado_nuevo == 0:
            servicios_activos = self.servicios.filter(estado=1)
            if servicios_activos.exists():
                self.estado = 2
                self.save()
            elif self.estado != estado_nuevo:
                if estado_nuevo == 2:
                    self.estado = estado_nuevo
                elif estado_nuevo == 3:
                    servicios_activos = self.servicios.filter(estado=1)
                    if not servicios_activos.exists():
                        servicios_para_eliminar = self.servicios.filter(estado=0)
                        [servicio.delete() for servicio in servicios_para_eliminar.all()]
                        self.estado = estado_nuevo
                self.save()
        return estado_nuevo == self.estado

    def iniciar_servicios(self, usuario):
        self.cambiar_estado(2)
        self.save()
        servicios = self.servicios.order_by('id')
        [servicio.iniciar(usuario) for servicio in servicios.all()]
        self.habitacion.cambiar_estado(1)


class Servicio(TimeStampedModel):
    ESTADO_CHOICES = (
        (0, 'Inicio'),
        (1, 'En Servicio'),
        (2, 'Terminado'),
        (3, 'Anulado'),
        (4, 'Solicitud Anulación'),
    )
    venta_servicio = models.ForeignKey(VentaServicio, on_delete=models.CASCADE, related_name='servicios')
    cuenta = models.ForeignKey(Cuenta, on_delete=models.PROTECT, related_name='servicios')
    empresa = models.ForeignKey(Empresa, on_delete=models.PROTECT, related_name='servicios', null=True, blank=True)
    estado = models.IntegerField(choices=ESTADO_CHOICES, default=0)
    hora_inicio = models.DateTimeField(null=True, blank=True)
    hora_final = models.DateTimeField(null=True, blank=True)
    hora_final_real = models.DateTimeField(null=True, blank=True)
    hora_anulacion = models.DateTimeField(null=True, blank=True)
    tiempo_minutos = models.PositiveIntegerField(default=0)
    categoria = models.CharField(max_length=120, null=True, blank=True)
    valor_servicio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valor_habitacion = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    valor_iva_habitacion = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    servicio_anterior = models.OneToOneField('self', on_delete=models.PROTECT, related_name='servicio_siguiente',
                                             null=True, blank=True)
    observacion_anulacion = models.TextField(null=True, blank=True)

    @property
    def valor_total(self):
        valor_total = self.valor_habitacion + self.valor_iva_habitacion + self.valor_servicio
        return valor_total

    def servicios_por_estado_por_acompanante(self, estado, tercero):
        return Servicio.objects.filter(cuenta__propietario__tercero=tercero, estado=estado)

    def calcular_hora_final(self, hora_inicio):
        hora_final = (hora_inicio + timezone.timedelta(minutes=self.tiempo_minutos))
        return hora_final

    def iniciar(self, usuario):
        hora_inicio = timezone.localtime(timezone.now())
        tercero = self.cuenta.propietario.tercero
        tercero.cambiar_estado(1)
        servicio_en_proceso_tercero = self.servicios_por_estado_por_acompanante(1, tercero)
        if servicio_en_proceso_tercero.exists():
            qsHoraServicio = servicio_en_proceso_tercero.aggregate(Max('hora_final'))
            hora_inicio = qsHoraServicio['hora_final__max']
            self.servicio_anterior = servicio_en_proceso_tercero.order_by('id').last()
        self.estado = 1
        self.hora_inicio = hora_inicio
        self.hora_final = self.calcular_hora_final(hora_inicio)
        self.save()
        BitacoraServicio.crear_bitacora_inicio_servicio(usuario, self)

    def cambiar_tiempo(self, tiempo, usuario):
        BitacoraServicio.crear_bitacora_cambiar_tiempo_servicio(usuario, self, tiempo)
        self.tiempo_minutos = tiempo
        self.hora_final = self.calcular_hora_final(self.hora_inicio)
        self.save()
        tiene_siguiente = hasattr(self, 'servicio_siguiente')
        if tiene_siguiente:
            Servicio.recursivo_asignacion_horas(None, self)

    def terminar(self, usuario):
        hora_final_real = timezone.localtime(timezone.now())
        self.estado = 2
        self.servicio_anterior = None
        self.servicio_siguiente = None
        self.hora_final_real = hora_final_real
        self.save()
        venta_servicio = self.venta_servicio
        venta_servicio.cambiar_estado(3)
        habitacion = venta_servicio.habitacion
        habitacion.cambiar_estado(2)
        tercero = self.cuenta.propietario.tercero
        tercero.cambiar_estado(0)
        BitacoraServicio.crear_bitacora_terminar_servicio(usuario, self)

    def anular(self, observacion_anulacion, usuario):
        self.estado = 4
        self.hora_anulacion = timezone.localtime(timezone.now())
        self.observacion_anulacion = observacion_anulacion

        servicio_anterior = self.servicio_anterior
        servicio_siguiente = None

        tiene_siguiente = hasattr(self, 'servicio_siguiente')
        if tiene_siguiente:
            servicio_siguiente = self.servicio_siguiente

        self.servicio_anterior = None
        self.save()

        if tiene_siguiente or servicio_anterior:
            if servicio_siguiente and servicio_anterior:
                servicio_siguiente.servicio_anterior = servicio_anterior
                servicio_siguiente.save()
                Servicio.recursivo_asignacion_horas(servicio_anterior, servicio_siguiente)
            elif not servicio_anterior:
                servicio_siguiente.servicio_anterior = None
                servicio_siguiente.hora_inicio = self.hora_inicio
                servicio_siguiente.hora_final = servicio_siguiente.calcular_hora_final(self.hora_inicio)
                servicio_siguiente.save()
                Servicio.recursivo_asignacion_horas(None, self)

        self.venta_servicio.cambiar_estado(3)
        self.venta_servicio.habitacion.cambiar_estado(2)
        tercero = self.cuenta.propietario.tercero
        tercero.cambiar_estado(0)
        BitacoraServicio.crear_bitacora_solicitar_anular_servicio(usuario, self, observacion_anulacion)

    @staticmethod
    def recursivo_asignacion_horas(servicio_anterior, servicio):
        if not servicio:
            pass
        else:
            if servicio_anterior:
                hora_inicio = servicio_anterior.hora_final
                servicio.hora_inicio = hora_inicio
                servicio.hora_final = servicio.calcular_hora_final(hora_inicio)
                servicio.save()
            if hasattr(servicio, 'servicio_siguiente'):
                Servicio.recursivo_asignacion_horas(servicio, servicio.servicio_siguiente)


class BitacoraServicio(TimeStampedModel):
    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='bitacoras_servicios'
    )
    servicio = models.ForeignKey(
        Servicio,
        on_delete=models.CASCADE,
        related_name='bitacoras_servicio',
        null=True,
        blank=True
    )
    venta_servicio = models.ForeignKey(
        VentaServicio,
        on_delete=models.PROTECT,
        related_name='bitacoras_servicio',
        null=True,
        blank=True
    )
    habitacion_nombre = models.CharField(max_length=300, null=True, blank=True)
    habitacion_anterior_nombre = models.CharField(max_length=300, null=True, blank=True)
    habitacion_nueva_nombre = models.CharField(max_length=300, null=True, blank=True)
    tiempo_contratado_anterior = models.PositiveIntegerField(null=True, blank=True)
    tiempo_contratado_nuevo = models.PositiveIntegerField(null=True, blank=True)
    tiempo_contratado = models.PositiveIntegerField(null=True, blank=True)
    hora_evento = models.DateTimeField(null=True, blank=True)
    tiempo_minutos_recorridos = models.PositiveIntegerField(null=True, blank=True)
    concepto = models.CharField(max_length=200)
    observacion = models.TextField(null=True)

    @staticmethod
    def crear_bitacora_inicio_servicio(usuario, servicio):
        BitacoraServicio.objects.create(
            created_by=usuario,
            servicio=servicio,
            venta_servicio=servicio.venta_servicio,
            concepto='Inicia Servicio',
            tiempo_contratado=servicio.tiempo_minutos,
            hora_evento=timezone.localtime(timezone.now()),
            habitacion_nombre=servicio.venta_servicio.habitacion.nombre
        )

    @staticmethod
    def crear_bitacora_terminar_servicio(usuario, servicio):
        now = timezone.now()
        tiempo_inicio_servicio = servicio.hora_inicio
        tiempo_minutos_recorridos = ((now - tiempo_inicio_servicio).seconds / 60) if tiempo_inicio_servicio < now else 0

        BitacoraServicio.objects.create(
            created_by=usuario,
            servicio=servicio,
            venta_servicio=servicio.venta_servicio,
            concepto='Termina Servicio',
            tiempo_contratado=servicio.tiempo_minutos,
            hora_evento=timezone.localtime(timezone.now()),
            habitacion_nombre=servicio.venta_servicio.habitacion.nombre,
            tiempo_minutos_recorridos=tiempo_minutos_recorridos
        )

    @staticmethod
    def crear_bitacora_solicitar_anular_servicio(usuario, servicio, observacion_anulacion):
        now = timezone.now()
        tiempo_inicio_servicio = servicio.hora_inicio
        tiempo_minutos_recorridos = ((now - tiempo_inicio_servicio).seconds / 60) if tiempo_inicio_servicio < now else 0
        BitacoraServicio.objects.create(
            created_by=usuario,
            servicio=servicio,
            venta_servicio=servicio.venta_servicio,
            concepto='Solicita Anular Servicio',
            observacion=observacion_anulacion,
            tiempo_contratado=servicio.tiempo_minutos,
            hora_evento=timezone.localtime(timezone.now()),
            habitacion_nombre=servicio.venta_servicio.habitacion.nombre,
            tiempo_minutos_recorridos=tiempo_minutos_recorridos
        )

    @staticmethod
    def crear_bitacora_cambiar_tiempo_servicio(usuario, servicio, tiempo_contratado_nuevo):
        now = timezone.now()
        tiempo_inicio_servicio = servicio.hora_inicio
        concepto = 'Extención de tiempo' if tiempo_contratado_nuevo > servicio.tiempo_minutos else 'Disminución de tiempo'
        tiempo_minutos_recorridos = ((now - tiempo_inicio_servicio).seconds / 60) if tiempo_inicio_servicio < now else 0

        BitacoraServicio.objects.create(
            created_by=usuario,
            servicio=servicio,
            venta_servicio=servicio.venta_servicio,
            concepto=concepto,
            tiempo_contratado_anterior=servicio.tiempo_minutos,
            tiempo_contratado_nuevo=tiempo_contratado_nuevo,
            hora_evento=timezone.localtime(timezone.now()),
            habitacion=servicio.venta_servicio.habitacion.nombre,
            tiempo_minutos_recorridos=tiempo_minutos_recorridos
        )

    @staticmethod
    def crear_bitacora_cambiar_habitacion_servicio(usuario, servicio, habitacion_anterior, habitacion_nueva,
                                                   observacion_devolucion=None):
        now = timezone.now()
        tiempo_inicio_servicio = servicio.hora_inicio
        tiempo_minutos_recorridos = ((now - tiempo_inicio_servicio).seconds / 60) if tiempo_inicio_servicio < now else 0
        BitacoraServicio.objects.create(
            created_by=usuario,
            servicio=servicio,
            venta_servicio=servicio.venta_servicio,
            concepto='Cambio de habitación',
            hora_evento=timezone.localtime(timezone.now()),
            habitacion_anterior_nombre=habitacion_anterior.nombre,
            tiempo_contratado=servicio.tiempo_minutos,
            habitacion_nueva_nombre=habitacion_nueva.nombre,
            tiempo_minutos_recorridos=tiempo_minutos_recorridos,
            observacion=observacion_devolucion
        )
