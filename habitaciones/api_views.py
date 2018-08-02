import json

from django.db.models import Max, Subquery, OuterRef, ExpressionWrapper, DateTimeField
from rest_framework import viewsets, serializers, permissions
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from .api_serializers import HabitacionSerializer, TipoHabitacionSerializer
from .models import Habitacion, TipoHabitacion
from servicios.models import Servicio, BitacoraServicio
from terceros.models import Tercero
from terceros_acompanantes.models import CategoriaFraccionTiempo
from cajas.models import MovimientoDineroPDV


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
        servicios = Servicio.objects.values('habitacion_id').annotate(
            ultima_hora=Max('hora_final')
        ).filter(
            habitacion_id=OuterRef('id'),
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
        punto_venta_id = self.request.POST.get('punto_venta_id', None)
        mensaje = 'no hizo nada'
        if habitacion.estado == 1:
            servicios = habitacion.servicios.filter(estado=1)
            [servicio.terminar(self.request.user, punto_venta_id) for servicio in servicios.all()]
            habitacion.cambiar_estado(2)
            mensaje = 'Los servicios para habitacion %s se han terminado.' % (habitacion.numero)
        return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def iniciar_servicios(self, request, pk=None):
        habitacion = self.get_object()
        pago = json.loads(request.POST.get('pago'))
        servicios = json.loads(request.POST.get('servicios'))
        punto_venta_id = pago.get('punto_venta_id', None)
        valor_efectivo = pago.get('valor_efectivo', 0)
        valor_tarjeta = pago.get('valor_tarjeta', 0)
        nro_autorizacion = pago.get('nro_autorizacion', 0)
        franquicia = pago.get('franquicia', None)

        movimiento = MovimientoDineroPDV.objects.create(
            tipo="I",
            tipo_dos='SER_ACOM',
            punto_venta_id=punto_venta_id,
            creado_por=request.user,
            concepto='Pago de servicios habitación %s' % habitacion.nombre,
            valor_tarjeta=valor_tarjeta,
            valor_efectivo=valor_efectivo,
            nro_autorizacion=nro_autorizacion,
            franquicia=franquicia
        )

        for servicio in servicios:
            servicio.pop('id')
            tercero_id = servicio.pop('tercero_id')
            tercero = Tercero.objects.get(pk=tercero_id)

            categoria_fraccion_tiempo_id = servicio.pop('categoria_fraccion_tiempo_id')
            categoria_fraccion_tiempo = CategoriaFraccionTiempo.objects.get(pk=categoria_fraccion_tiempo_id)
            servicio_adicionado = Servicio.adicionar_servicio(habitacion, tercero, categoria_fraccion_tiempo)
            movimiento.servicios.add(servicio_adicionado)
        servicios_a_iniciar = movimiento.servicios.all()
        habitacion.iniciar_servicios(self.request.user, servicios_a_iniciar, punto_venta_id)
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
        pago = json.loads(request.POST.get('pago'))
        punto_venta_id = pago.get('punto_venta_id', None)

        if diferencia == 0:
            for servicio in servicios.all():
                BitacoraServicio.crear_bitacora_cambiar_habitacion_servicio(
                    self.request.user,
                    servicio,
                    habitacion,
                    habitacion_nueva,
                    punto_venta_id
                )
                servicio.habitacion = habitacion_nueva
                servicio.save()
        else:

            valor_efectivo = pago.get('valor_efectivo', 0)
            punto_venta_id = pago.get('punto_venta_id', None)
            observacion_devolucion = pago.get(
                'observacion_devolucion') if 'observacion_devolucion' in pago.keys() else None

            valor_tarjeta = pago.get('valor_tarjeta', 0)
            nro_autorizacion = pago.get('nro_autorizacion', 0)
            franquicia = pago.get('franquicia', None)
            tipo = 'I'
            tipo_dos = 'CAM_HABITACION'

            concepto = 'Pago excedente'
            if diferencia < 0:
                tipo = 'E'
                concepto = 'Devolución'

            for servicio in servicios.all():
                BitacoraServicio.crear_bitacora_cambiar_habitacion_servicio(
                    self.request.user,
                    servicio,
                    habitacion,
                    habitacion_nueva,
                    punto_venta_id,
                    observacion_devolucion
                )
                valor_habitacion = habitacion_nueva.tipo.valor_antes_impuestos
                valor_habitacion_con_iva = habitacion_nueva.tipo.valor
                valor_iva_habitacion = valor_habitacion_con_iva - valor_habitacion

                servicio.valor_habitacion = valor_habitacion
                servicio.valor_iva_habitacion = valor_iva_habitacion
                servicio.habitacion = habitacion_nueva
                servicio.save()

            movimiento = MovimientoDineroPDV.objects.create(
                tipo=tipo,
                tipo_dos=tipo_dos,
                punto_venta_id=punto_venta_id,
                creado_por=request.user,
                concepto='%s por cambio de la habitación %s a la habitación %s' % (
                    concepto, habitacion.nombre, habitacion_nueva.nombre),
                valor_tarjeta=valor_tarjeta,
                valor_efectivo=valor_efectivo,
                nro_autorizacion=nro_autorizacion,
                franquicia=franquicia
            )
            movimiento.servicios.set(servicios)
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
