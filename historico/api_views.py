from rest_framework import viewsets
from reversion.models import Version
from .api_serializers import HistoricoSerializer


class HistoricoViewSet(viewsets.ModelViewSet):
    queryset = Version.objects.all()
    serializer_class = HistoricoSerializer
