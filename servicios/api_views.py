import json
from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from cajas.models import MovimientoDineroServicio
from .api_serializers import ServicioSerializer, VentaServicioSerializer
from .models import Servicio, VentaServicio
from terceros_acompanantes.models import CategoriaFraccionTiempo


class VentaServicioViewSet(viewsets.ModelViewSet):
    queryset = VentaServicio.objects.all()
    serializer_class = VentaServicioSerializer


class ServicioViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Servicio.objects.select_related(
        'cuenta__propietario__tercero',
        'cuenta__propietario__tercero__categoria_modelo',
        'venta_servicio__habitacion',
        'venta_servicio__habitacion__tipo',
        'servicio_anterior',
        'servicio_siguiente',
    ).all()
    serializer_class = ServicioSerializer

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
            venta_servicio__habitacion_id=habitacion_id
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
        servicio.anular(observacion_anulacion, self.request.user)
        tercero = servicio.cuenta.propietario.tercero

        total_valor_anulacion = -servicio.valor_total
        concepto = 'Anulación de servicio por: "%s"' % observacion_anulacion

        MovimientoDineroServicio.objects.create(
            creado_por=request.user,
            concepto=concepto,
            valor_tarjeta=0,
            servicio=servicio,
            valor_efectivo=total_valor_anulacion,
            nro_autorizacion=None,
            franquicia=None
        )

        mensaje = 'Se ha solicitado anulación para el servicio de %s.' % (tercero.full_name_proxy)
        return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def terminar_servicio(self, request, pk=None):
        servicio = self.get_object()
        if servicio.estado == 1:
            servicio.terminar(self.request.user)
            tercero = servicio.cuenta.propietario.tercero
            mensaje = 'El servicios de %s se ha terminado.' % (tercero.full_name_proxy)
            return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def cambiar_tiempo(self, request, pk=None):
        servicio = self.get_object()
        pago = json.loads(request.POST.get('pago'))
        valor_efectivo = pago.get('valor_efectivo', 0)
        valor_tarjeta = pago.get('valor_tarjeta', 0)
        nro_autorizacion = pago.get('nro_autorizacion', 0)
        franquicia = pago.get('franquicia', None)
        categoria_fraccion_tiempo_id = pago.get('categoria_fraccion_tiempo_id', None)
        categoria_fraccion_tiempo = CategoriaFraccionTiempo.objects.get(id=categoria_fraccion_tiempo_id)

        valor_servicio_actual = servicio.valor_servicio
        valor_servicio_nuevo = categoria_fraccion_tiempo.valor

        diferencia = valor_servicio_nuevo - valor_servicio_actual

        minutos = categoria_fraccion_tiempo.fraccion_tiempo.minutos
        if diferencia > 0:
            concepto = 'Extención de tiempo de %s a %s minutos' % (servicio.tiempo_minutos, minutos)
        else:
            concepto = 'Disminución de tiempo de %s a %s minutos' % (servicio.tiempo_minutos, minutos)

        concepto = '%s para %s' % (concepto, servicio.cuenta.propietario.tercero.full_name_proxy)

        MovimientoDineroServicio.objects.create(
            creado_por=request.user,
            concepto=concepto,
            valor_tarjeta=valor_tarjeta,
            servicio=servicio,
            valor_efectivo=valor_efectivo,
            nro_autorizacion=nro_autorizacion,
            franquicia=franquicia
        )

        servicio.cambiar_tiempo(minutos, self.request.user)
        servicio.valor_servicio += diferencia
        servicio.save()

        mensaje = 'Se ha efectuado con éxito la %s' % concepto

        return Response({'result': mensaje})
