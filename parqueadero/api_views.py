from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

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

    @list_route(methods=['get'], permission_classes=[EsColaboradorPermission])
    def por_salir(self, request):
        qs = self.queryset.filter(hora_salida__isnull=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


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


class ModalidadFraccionTiempoDetalleViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = ModalidadFraccionTiempoDetalle.objects.select_related(
        'modalidad_fraccion_tiempo',
        'modalidad_fraccion_tiempo__tipo_vehiculo'
    ).all()
    serializer_class = ModalidadFraccionTiempoDetalleSerializer

    @list_route(methods=['get'], permission_classes=[EsColaboradorPermission])
    def por_movimiento(self, request):
        modalidad_fraccion_tiempo_id = int(request.GET.get('modalidad_fraccion_tiempo_id'))
        qs = self.queryset.filter(modalidad_fraccion_tiempo_id=modalidad_fraccion_tiempo_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
