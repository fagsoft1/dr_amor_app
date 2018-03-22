from rest_framework import viewsets

from .models import CategoriaAcompanante
from .api_serializers import CategoriaAcompananteSerializer


class CategoriaAcompananteViewSet(viewsets.ModelViewSet):
    queryset = CategoriaAcompanante.objects.all()
    serializer_class = CategoriaAcompananteSerializer
