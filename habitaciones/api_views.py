import json

from django.db.models import Max, Subquery, OuterRef, ExpressionWrapper, DateTimeField
from rest_framework import viewsets, serializers, permissions
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from .api_serializers import HabitacionSerializer, TipoHabitacionSerializer
from .models import Habitacion, TipoHabitacion
from servicios.models import VentaServicio, Servicio, BitacoraServicio
from terceros.models import Tercero
from terceros_acompanantes.models import CategoriaFraccionTiempo
from cajas.models import MovimientoDineroServicio


class TipoHabitacionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = TipoHabitacion.objects.all()
    serializer_class = TipoHabitacionSerializer
    #
    # def perform_destroy(self, instance):
    #     if not instance.mis_habitaciones.exists():
    #         super().perform_destroy(instance)
    #     else:
    #         content = {'error': ['No se puede eliminar, hay habitaciones con este tipo']}
    #         raise serializers.ValidationError(content)


class HabitacionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Habitacion.objects.select_related(
        'empresa',
        'tipo'
    ).all()
    serializer_class = HabitacionSerializer

    def get_queryset(self):
        servicios = Servicio.objects.values('venta_servicio__habitacion_id').annotate(
            ultima_hora=Max('hora_final')
        ).filter(
            venta_servicio__habitacion_id=OuterRef('id'),
            estado=1
        )
        qs = self.queryset.annotate(
            tiempo_final_servicio=ExpressionWrapper(
                Subquery(servicios.values('ultima_hora')),
                output_field=DateTimeField()
            )
        ).all()
        return qs

    @detail_route(methods=['post'])
    def terminar_servicios(self, request, pk=None):
        habitacion = self.get_object()
        mensaje = 'no hizo nada'
        if habitacion.estado == 1:
            servicios = Servicio.objects.filter(venta_servicio__habitacion=habitacion, estado=1)
            [servicio.terminar(self.request.user) for servicio in servicios.all()]
            habitacion.cambiar_estado(2)
            mensaje = 'Los servicios para habitacion %s se han terminado.' % (habitacion.numero)
        return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def iniciar_servicios(self, request, pk=None):
        habitacion = self.get_object()
        pago = json.loads(request.POST.get('pago'))
        valor_efectivo = pago.get('valor_efectivo', 0)
        valor_tarjeta = pago.get('valor_tarjeta', 0)
        nro_autorizacion = pago.get('nro_autorizacion', 0)
        franquicia = pago.get('franquicia', None)

        venta_servicios = habitacion.ultimo_venta_servicio
        venta_servicios.iniciar_servicios(self.request.user)

        MovimientoDineroServicio.objects.create(
            creado_por=request.user,
            concepto='Pago de servicios habitación %s' % habitacion.nombre,
            valor_tarjeta=valor_tarjeta,
            venta_servicios=venta_servicios,
            valor_efectivo=valor_efectivo,
            nro_autorizacion=nro_autorizacion,
            franquicia=franquicia
        )
        mensaje = 'Los servicios para habitacion %s han iniciado.' % (habitacion.numero)
        return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def cambiar_habitacion(self, request, pk=None):
        habitacion = self.get_object()
        nueva_habitacion_id = request.POST.get('nueva_habitacion_id', None)
        habitacion_nueva = Habitacion.objects.get(pk=nueva_habitacion_id)
        habitacion_valor = habitacion.tipo.valor
        habitacion_nueva_valor = habitacion_nueva.tipo.valor
        diferencia = habitacion_nueva_valor - habitacion_valor
        servicios_array_id = json.loads(request.POST.get('servicios_array_id', None))
        servicios = Servicio.objects.filter(id__in=servicios_array_id)

        nuevo_vs = VentaServicio.objects.create(
            created_by=self.request.user,
            habitacion=habitacion_nueva,
            estado=2
        )

        if diferencia == 0:
            for servicio in servicios.all():
                BitacoraServicio.crear_bitacora_cambiar_habitacion_servicio(
                    self.request.user,
                    servicio,
                    habitacion,
                    habitacion_nueva
                )
                venta_servicio_anterior = servicio.venta_servicio
                venta_servicio_anterior.cambiar_estado(3)
                servicio.venta_servicio = nuevo_vs
                servicio.save()
        else:
            pago = json.loads(request.POST.get('pago'))
            valor_efectivo = pago.get('valor_efectivo', 0)
            observacion_devolucion = pago.get(
                'observacion_devolucion') if 'observacion_devolucion' in pago.keys() else None

            valor_tarjeta = pago.get('valor_tarjeta', 0)
            nro_autorizacion = pago.get('nro_autorizacion', 0)
            franquicia = pago.get('franquicia', None)

            concepto = 'Pago excedente'
            if diferencia < 0:
                concepto = 'Devolución'

            for servicio in servicios.all():
                BitacoraServicio.crear_bitacora_cambiar_habitacion_servicio(
                    self.request.user,
                    servicio,
                    habitacion,
                    habitacion_nueva,
                    observacion_devolucion
                )

                venta_servicio_anterior = servicio.venta_servicio
                servicio.venta_servicio = nuevo_vs

                valor_habitacion = habitacion_nueva.tipo.valor_antes_impuestos
                valor_habitacion_con_iva = habitacion_nueva.tipo.valor
                valor_iva_habitacion = valor_habitacion_con_iva - valor_habitacion

                servicio.valor_habitacion = valor_habitacion
                servicio.valor_iva_habitacion = valor_iva_habitacion

                servicio.save()
                venta_servicio_anterior.cambiar_estado(3)

            MovimientoDineroServicio.objects.create(
                creado_por=request.user,
                concepto='%s por cambio de la habitación %s a la habitación %s' % (
                    concepto, habitacion.nombre, habitacion_nueva.nombre),
                valor_tarjeta=valor_tarjeta,
                venta_servicios=nuevo_vs,
                valor_efectivo=valor_efectivo,
                nro_autorizacion=nro_autorizacion,
                franquicia=franquicia
            )
        habitacion.cambiar_estado(2)
        habitacion_nueva.cambiar_estado(1)
        mensaje = 'Se han cambiado los servicios para la habitacion %s.' % (habitacion_nueva.nombre)
        return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def cambiar_estado(self, request, pk=None):
        nuevo_estado = int(request.POST.get('estado'))
        habitacion = self.get_object()
        se_hizo_cambio = habitacion.cambiar_estado(nuevo_estado)
        if se_hizo_cambio:
            mensaje = 'Cambio de estado en habitacion %s a %s se ha aplicado' % (
                habitacion.numero, habitacion.get_estado_display())
            return Response({'result': mensaje})
        raise serializers.ValidationError('No se pudo ejecutar el cambio de estado')

    @detail_route(methods=['post'])
    def adicionar_servicio(self, request, pk=None):
        habitacion = self.get_object()
        tercero_id = request.POST.get('tercero_id')
        categoria_fraccion_tiempo_id = request.POST.get('categoria_fraccion_tiempo_id')
        tercero = Tercero.objects.get(pk=tercero_id)
        if tercero:
            categoria_fraccion_tiempo = CategoriaFraccionTiempo.objects.get(pk=categoria_fraccion_tiempo_id)
            empresa = habitacion.empresa
            estado = 0
            tiempo_minutos = categoria_fraccion_tiempo.fraccion_tiempo.minutos
            categoria = tercero.categoria_modelo.nombre
            valor_servicio = categoria_fraccion_tiempo.valor
            valor_habitacion = habitacion.tipo.valor_antes_impuestos
            valor_habitacion_con_iva = habitacion.tipo.valor
            cuenta = tercero.cuenta_abierta
            venta_servicio_activo = habitacion.ventas_servicios.filter(estado=0).first()
            valor_iva_habitacion = valor_habitacion_con_iva - valor_habitacion
            if not venta_servicio_activo:
                venta_servicio_activo = VentaServicio.objects.create(
                    created_by=request.user,
                    habitacion=habitacion,
                    estado=0
                )
            Servicio.objects.create(
                venta_servicio=venta_servicio_activo,
                cuenta=cuenta,
                empresa=empresa,
                estado=estado,
                tiempo_minutos=tiempo_minutos,
                categoria=categoria,
                valor_servicio=valor_servicio,
                valor_habitacion=valor_habitacion,
                valor_iva_habitacion=valor_iva_habitacion
            )
        return Response({'result': 'prueba'})
