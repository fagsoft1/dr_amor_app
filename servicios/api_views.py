import json
from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from cajas.models import MovimientoDineroPDV
from .api_serializers import ServicioSerializer
from .models import Servicio
from terceros_acompanantes.models import CategoriaFraccionTiempo


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
        punto_venta_id = request.POST.get('punto_venta_id', None)
        servicio.anular(observacion_anulacion, self.request.user, punto_venta_id)
        tercero = servicio.cuenta.propietario.tercero

        total_valor_anulacion = -servicio.valor_total
        concepto = 'Anulación de servicio por: "%s"' % observacion_anulacion

        movimiento = MovimientoDineroPDV.objects.create(
            tipo='E',
            tipo_dos='ANU_SER_ACOM',
            punto_venta_id=punto_venta_id,
            creado_por=request.user,
            concepto=concepto,
            valor_tarjeta=0,
            valor_efectivo=total_valor_anulacion,
            nro_autorizacion=None,
            franquicia=None
        )
        movimiento.servicios.add(servicio)

        mensaje = 'Se ha solicitado anulación para el servicio de %s.' % (tercero.full_name_proxy)
        return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def terminar_servicio(self, request, pk=None):
        servicio = self.get_object()
        punto_venta_id = self.request.POST.get('punto_venta_id', None)
        if servicio.estado == 1:
            servicio.terminar(self.request.user, punto_venta_id)
            tercero = servicio.cuenta.propietario.tercero
            mensaje = 'El servicios de %s se ha terminado.' % (tercero.full_name_proxy)
            return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def cambiar_tiempo(self, request, pk=None):
        servicio = self.get_object()
        pago = json.loads(request.POST.get('pago'))
        punto_venta_id = pago.get('punto_venta_id', None)
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
        tipo = 'I'
        if diferencia > 0:
            concepto = 'Extención de tiempo de %s a %s minutos' % (servicio.tiempo_minutos, minutos)
        else:
            tipo = 'E'
            concepto = 'Disminución de tiempo de %s a %s minutos' % (servicio.tiempo_minutos, minutos)

        concepto = '%s para %s' % (concepto, servicio.cuenta.propietario.tercero.full_name_proxy)

        movimiento = MovimientoDineroPDV.objects.create(
            tipo=tipo,
            tipo_dos='CAM_TIE_SER_ACOM',
            punto_venta_id=punto_venta_id,
            creado_por=request.user,
            concepto=concepto,
            valor_tarjeta=valor_tarjeta,
            valor_efectivo=valor_efectivo,
            nro_autorizacion=nro_autorizacion,
            franquicia=franquicia
        )
        movimiento.servicios.add(servicio)

        servicio.cambiar_tiempo(minutos, self.request.user, punto_venta_id)
        servicio.valor_servicio += diferencia
        servicio.save()

        mensaje = 'Se ha efectuado con éxito la %s' % concepto

        return Response({'result': mensaje})
