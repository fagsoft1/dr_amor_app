from io import BytesIO

from django.http import HttpResponse
from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull, EsColaboradorPermission
from .api_serializers import (
    EmpresaResumenSerializer
)
from empresas.models import Empresa


class ConsultaVentasEmpresaViewSet(viewsets.ModelViewSet):
    permission_classes = [EsColaboradorPermission]
    queryset = Empresa.objects.all()
    serializer_class = EmpresaResumenSerializer
