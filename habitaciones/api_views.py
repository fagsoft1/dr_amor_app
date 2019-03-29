import json

from django.db.models import Max, Subquery, OuterRef, ExpressionWrapper, DateTimeField
from rest_framework import viewsets, permissions
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from .api_serializers import HabitacionSerializer, TipoHabitacionSerializer
from .models import Habitacion, TipoHabitacion
from servicios.models import Servicio
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull

from .services import (
    habitacion_iniciar_servicios,
    habitacion_terminar_servicios,
    habitacion_cambiar_estado,
    habitacion_cambiar_servicios_de_habitacion
)


class TipoHabitacionViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = TipoHabitacion.objects.all()
    serializer_class = TipoHabitacionSerializer


class HabitacionViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
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
        habitacion_terminar_servicios(
            habitacion_id=habitacion.id,
            usuario_pdv_id=self.request.user.id
        )
        mensaje = 'Los servicios para habitacion %s se han terminado.' % (habitacion.numero)
        return Response({'result': mensaje})

    @detail_route(methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def iniciar_servicios(self, request, pk=None):
        habitacion = self.get_object()
        pago = json.loads(request.POST.get('pago'))
        servicios = json.loads(request.POST.get('servicios'))

        # TODO: evaluar que se puede ir, ya sale del usuario actual
        # punto_venta_id = pago.get('punto_venta_id', None)
        valor_efectivo = float(pago.get('valor_efectivo', 0))
        valor_tarjeta = float(pago.get('valor_tarjeta', 0))
        nro_autorizacion = pago.get('nro_autorizacion', 0)
        franquicia = pago.get('franquicia', None)

        habitacion_iniciar_servicios(
            habitacion.id,
            self.request.user.id,
            servicios,
            valor_efectivo,
            valor_tarjeta,
            nro_autorizacion,
            franquicia
        )
        return Response({'result': 'Los servicios se han iniciado correctamente'})

    @detail_route(methods=['post'])
    def cambiar_habitacion(self, request, pk=None):
        pago = json.loads(request.POST.get('pago'))
        # punto_venta_id = pago.get('punto_venta_id', None)
        habitacion_nueva = Habitacion.objects.get(pk=int(request.POST.get('nueva_habitacion_id', None)))
        habitacion_cambiar_servicios_de_habitacion(
            habitacion_nueva_id=habitacion_nueva.id,
            habitacion_anterior_id=self.get_object().id,
            servicios_array_id=json.loads(request.POST.get('servicios_array_id', None)),
            punto_venta_id=self.request.user.tercero.turno_punto_venta_abierto.punto_venta_id,
            usuario_id=self.request.user.id,
            valor_efectivo=float(pago.get('valor_efectivo', 0)),
            valor_tarjeta=float(pago.get('valor_tarjeta', 0)),
            observacion_devolucion=pago.get(
                'observacion_devolucion') if 'observacion_devolucion' in pago.keys() else None,
            nro_autorizacion=pago.get('nro_autorizacion', None),
            franquicia=pago.get('franquicia', None)
        )
        mensaje = 'Se han cambiado los servicios para la habitacion %s.' % (habitacion_nueva.nombre)
        return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def cambiar_estado(self, request, pk=None):
        nuevo_estado = int(request.POST.get('estado'))
        habitacion = self.get_object()
        habitacion_cambiar_estado(
            habitacion.id,
            nuevo_estado
        )
        mensaje = 'Se han cambiado el estado para la habitacion %s.' % (habitacion.nombre)
        return Response({'result': mensaje})
