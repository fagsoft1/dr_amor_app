import json
from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from servicios.services import servicio_terminar, servicio_cambiar_tiempo
from .api_serializers import ServicioSerializer
from .models import Servicio
from servicios.services import servicio_solicitar_anular


class ServicioViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Servicio.objects.select_related(
        'cuenta',
        'cuenta__propietario__tercero',
        'cuenta__propietario__tercero__categoria_modelo',
        'habitacion',
        'habitacion__tipo',
        'servicio_anterior',
        'servicio_siguiente',
    ).all()
    serializer_class = ServicioSerializer

    @list_route(methods=['get'])
    def consultar_por_tercero_cuenta_abierta(self, request):
        tercero_id = request.GET.get('tercero_id', None)
        qs = self.queryset.filter(
            cuenta__propietario__tercero=tercero_id,
            cuenta__liquidada=False,
            cuenta__tipo=1
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def en_proceso(self, request):
        qs = self.queryset.filter(estado__in=[1, 0])
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def pendientes_por_habitacion(self, request):
        habitacion_id = self.request.GET.get('habitacion_id')
        servicios_list = self.queryset.filter(
            estado__in=[0, 1],
            habitacion_id=habitacion_id
        )
        serializer = self.get_serializer(servicios_list, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def terminados(self, request):
        qs = self.queryset.filter(estado=2)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def solicitar_anulacion(self, request, pk=None):
        servicio = self.get_object()
        observacion_anulacion = request.POST.get('observacion_anulacion')
        # TODO: revisar quitar del post porque ya no se necesita
        punto_venta_id = request.POST.get('punto_venta_id', None)
        servicio_solicitar_anular(
            servicio_id=servicio.id,
            observacion_anulacion=observacion_anulacion,
            usuario_pdv_id=self.request.user.id
        )
        tercero = servicio.cuenta.propietario.tercero
        mensaje = 'Se ha solicitado anulación para el servicio de %s.' % (tercero.full_name_proxy)
        return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def terminar_servicio(self, request, pk=None):
        servicio = self.get_object()
        # TODO: evaluar quitar del post, ya viene del usuario activo
        punto_venta_id = self.request.POST.get('punto_venta_id', None)
        if servicio.estado == 1:
            servicio_terminar(
                servicio_id=servicio.id,
                usuario_pdv_id=self.request.user.id
            )
            tercero = servicio.cuenta.propietario.tercero
            mensaje = 'El servicios de %s se ha terminado.' % (tercero.full_name_proxy)
            return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def cambiar_tiempo(self, request, pk=None):
        servicio = self.get_object()
        pago = json.loads(request.POST.get('pago'))
        # TODO: evaluar quitar del post, ya viene del usuario
        punto_venta_id = pago.get('punto_venta_id', None)
        valor_efectivo = float(pago.get('valor_efectivo', 0))
        valor_tarjeta = float(pago.get('valor_tarjeta', 0))
        nro_autorizacion = pago.get('nro_autorizacion', 0)
        franquicia = pago.get('franquicia', None)
        categoria_fraccion_tiempo_id = pago.get('categoria_fraccion_tiempo_id', None)

        servicio_cambiar_tiempo(
            servicio_id=servicio.id,
            usuario_pdv_id=self.request.user.id,
            categoria_fraccion_tiempo_id=categoria_fraccion_tiempo_id,
            valor_efectivo=valor_efectivo,
            valor_tarjeta=valor_tarjeta,
            nro_autorizacion=nro_autorizacion,
            franquicia=franquicia
        )
        mensaje = 'Se ha efectuado con éxito el cambio de tiempo'
        return Response({'result': mensaje})
