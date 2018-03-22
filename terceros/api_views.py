from .models import Tercero
from rest_framework import viewsets

from .api_serializers import AcompananteSerializer, ColaboradorSerializer, ProveedorSerializer
from .mixins import TerceroViewSetMixin


class AcompananteViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    queryset = Tercero.objects.select_related('usuario', 'categoria_modelo').filter(es_acompanante=True).all()
    serializer_class = AcompananteSerializer
    search_fields = ['=nro_identificacion', 'nombre', 'nombre_segundo', 'apellido', 'apellido_segundo', 'alias_modelo']


class ColaboradorViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    queryset = Tercero.objects.select_related('usuario').filter(es_colaborador=True).all()
    serializer_class = ColaboradorSerializer
    search_fields = ['=nro_identificacion', 'nombre', 'nombre_segundo', 'apellido', 'apellido_segundo']


class ProveedorViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    queryset = Tercero.objects.filter(es_proveedor=True).all()
    serializer_class = ProveedorSerializer
    search_fields = ['=nro_identificacion', 'nombre']
