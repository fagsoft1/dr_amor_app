from rest_framework import viewsets

from .api_serializers import VehiculoSerializer, TipoVehiculoSerializer, ModalidadFraccionTiempoSerializer, \
    ModalidadFraccionTiempoDetalleSerializer
from .models import Vehiculo, TipoVehiculo, ModalidadFraccionTiempo, ModalidadFraccionTiempoDetalle
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull


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
