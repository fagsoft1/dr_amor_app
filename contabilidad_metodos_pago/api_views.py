from rest_framework import viewsets
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import (
    MetodoPagoSerializer
)
from .models import (
    MetodoPago
)


class MetodoPagoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = MetodoPago.objects.all()
    serializer_class = MetodoPagoSerializer
