from datetime import timedelta
from io import BytesIO

from django.db.models import Q, F, Value
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .api_serializers import (
    VehiculoSerializer,
    TipoVehiculoSerializer,
    ModalidadFraccionTiempoSerializer,
    ModalidadFraccionTiempoDetalleSerializer,
    RegistroEntradaParqueoSerializer
)
from .models import (
    Vehiculo,
    TipoVehiculo,
    ModalidadFraccionTiempo,
    ModalidadFraccionTiempoDetalle,
    RegistroEntradaParqueo
)
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull, EsColaboradorPermission


class RegistroEntradaParqueoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = RegistroEntradaParqueo.objects.select_related(
        'vehiculo',
        'vehiculo__tipo_vehiculo'
    ).all()
    serializer_class = RegistroEntradaParqueoSerializer

    @action(detail=False, methods=['get'], permission_classes=[EsColaboradorPermission])
    def por_salir(self, request):
        qs = self.queryset.filter(hora_salida__isnull=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[EsColaboradorPermission])
    def por_en_proceso(self, request):
        qs = self.queryset.filter(
            Q(hora_salida__isnull=True) |
            Q(hora_pago__isnull=True)
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def valor_a_pagar(self, request, pk=None):
        from .services import registro_entrada_parqueo_calcular_pago
        registro = self.get_object()
        minutos, tarifa, hora_actual = registro_entrada_parqueo_calcular_pago(
            registro_entrada_parqueo_id=registro.id
        )
        return Response({
            'valor': tarifa.valor,
            'modalidad_fraccion_tiempo_id': tarifa.id
        })

    @action(detail=True, methods=['post'])
    def registrar_salida(self, request, pk=None):
        from .services import registro_entrada_parqueo_registrar_salida
        registro = self.get_object()
        registro_entrada_parqueo_registrar_salida(
            registro_entrada_parqueo_id=registro.id
        )
        return Response({'result': 'La salida del vehiculo se ha registrado correctamente'})

    @action(detail=True, methods=['post'])
    def pagar(self, request, pk=None):
        from .services import registro_entrada_parqueo_registrar_pago
        modalidad_fraccion_tiempo_detalle_id = self.request.POST.get('modalidad_fraccion_tiempo_detalle_id', None)
        registro = self.get_object()
        registro_entrada_parqueo_registrar_pago(
            registro_entrada_parqueo_id=registro.id,
            modalidad_fraccion_tiempo_detalle_id=modalidad_fraccion_tiempo_detalle_id,
            usuario_pdv_id=self.request.user.id,
        )
        return Response({'result': 'Pago Realizado'})

    @action(detail=True, methods=['post'])
    def imprimir_recibo(self, request, pk=None):
        from .services import registro_entrada_parqueo_comprobante_entrada
        registro = self.get_object()
        main_doc = registro_entrada_parqueo_comprobante_entrada(registro_entrada_id=registro.id)
        output = BytesIO()
        main_doc.write_pdf(
            target=output
        )
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="somefilename.pdf"'
        response['Content-Transfer-Encoding'] = 'binary'
        response.write(output.getvalue())
        output.close()
        return response

    @action(detail=True, methods=['post'])
    def imprimir_factura(self, request, pk=None):
        from .services import registro_entrada_parqueo_factura
        registro = self.get_object()
        main_doc = registro_entrada_parqueo_factura(registro_entrada_id=registro.id)
        output = BytesIO()
        main_doc.write_pdf(
            target=output
        )
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="somefilename.pdf"'
        response['Content-Transfer-Encoding'] = 'binary'
        response.write(output.getvalue())
        output.close()
        return response


class VehiculoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Vehiculo.objects.select_related(
        'tipo_vehiculo'
    ).all()
    serializer_class = VehiculoSerializer


class TipoVehiculoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = TipoVehiculo.objects.select_related(
        'empresa'
    ).all()
    serializer_class = TipoVehiculoSerializer


class ModalidadFraccionTiempoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = ModalidadFraccionTiempo.objects.select_related(
        'tipo_vehiculo'
    ).all()
    serializer_class = ModalidadFraccionTiempoSerializer

    def aplica_dia(self, fecha, obj: ModalidadFraccionTiempo) -> bool:
        dia_semana = fecha.weekday()
        if obj.lunes and dia_semana == 0:
            return True
        elif obj.martes and dia_semana == 1:
            return True
        elif obj.miercoles and dia_semana == 2:
            return True
        elif obj.jueves and dia_semana == 3:
            return True
        elif obj.viernes and dia_semana == 4:
            return True
        elif obj.sabado and dia_semana == 5:
            return True
        elif obj.domingo and dia_semana == 6:
            return True
        else:
            return False

    def aplica_horas(self, hora_inicio, nro_horas: int, obj: ModalidadFraccionTiempo) -> bool:
        hora_inicial = hora_inicio.hour
        hora_final = hora_inicial + nro_horas
        fecha_hora_actual = timezone.now().astimezone()

        diferencia_a_fin_dia = 24 - hora_final
        if diferencia_a_fin_dia < 0:

            fecha_limite_inicio_dia_ant = fecha_hora_actual.replace(
                hour=hora_inicio.hour,
                minute=hora_inicio.minute,
                second=0
            ) + timedelta(days=-1)

            fecha_limite_fin_dia_hoy = fecha_limite_inicio_dia_ant + timedelta(days=nro_horas)

            if fecha_hora_actual > fecha_limite_inicio_dia_ant and fecha_hora_actual < fecha_limite_fin_dia_hoy:
                return self.aplica_dia(fecha_hora_actual + timedelta(days=-1), obj)

            fecha_limite_inicio_dia_hoy = fecha_hora_actual.replace(
                hour=hora_inicio.hour,
                minute=hora_inicio.minute,
                second=0
            )

            fecha_limite_fin_dia_hoy = fecha_limite_inicio_dia_hoy.replace(
                hour=23,
                minute=59,
                second=59
            )

            if fecha_hora_actual > fecha_limite_inicio_dia_hoy and fecha_hora_actual < fecha_limite_fin_dia_hoy:
                return self.aplica_dia(fecha_hora_actual, obj)

        else:
            fecha_limite_inicio_dia_cero = fecha_hora_actual.replace(
                hour=hora_inicio.hour,
                minute=hora_inicio.minute,
                second=0
            )
            fecha_limite_fin_dia_cero = fecha_limite_inicio_dia_cero + timedelta(hours=nro_horas)
            if fecha_hora_actual > fecha_limite_inicio_dia_cero and fecha_hora_actual < fecha_limite_fin_dia_cero:
                return self.aplica_dia(fecha_hora_actual, obj)

    @action(detail=False, methods=['get'])
    def por_tipo_vehiculo(self, request):

        tipo_vehiculo_id = self.request.GET.get('tipo_vehiculo_id')
        qs = ModalidadFraccionTiempo.objects.filter(
            tipo_vehiculo_id=tipo_vehiculo_id
        )
        id_habilitados_de_modalidades = []
        for m in qs.all():
            hora_inicio = m.hora_inicio
            nro_horas = m.numero_horas
            if hora_inicio:
                if self.aplica_horas(hora_inicio, nro_horas, m):
                    id_habilitados_de_modalidades.append(m.id)
            else:
                fecha_hora_actual = timezone.now().astimezone()
                if self.aplica_dia(fecha_hora_actual, m):
                    id_habilitados_de_modalidades.append(m.id)

        qs = qs.filter(id__in=id_habilitados_de_modalidades)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ModalidadFraccionTiempoDetalleViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = ModalidadFraccionTiempoDetalle.objects.select_related(
        'modalidad_fraccion_tiempo',
        'modalidad_fraccion_tiempo__tipo_vehiculo'
    ).all()
    serializer_class = ModalidadFraccionTiempoDetalleSerializer

    @action(detail=False, methods=['get'], permission_classes=[EsColaboradorPermission])
    def por_modalidad_fraccion_tiempo(self, request):
        modalidad_fraccion_tiempo_id = int(request.GET.get('modalidad_fraccion_tiempo_id'))
        qs = self.queryset.filter(modalidad_fraccion_tiempo_id=modalidad_fraccion_tiempo_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[EsColaboradorPermission])
    def por_movimiento(self, request):
        modalidad_fraccion_tiempo_id = int(request.GET.get('modalidad_fraccion_tiempo_id'))
        qs = self.queryset.filter(modalidad_fraccion_tiempo_id=modalidad_fraccion_tiempo_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
