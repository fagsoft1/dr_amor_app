from rest_framework import viewsets
from .api_serializers import EmpresaSerializer
from .models import Empresa
from dr_amor_app.custom_permissions import DjangoModelPermissionsFull


class EmpresaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
