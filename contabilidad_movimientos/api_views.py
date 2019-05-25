import json
from datetime import datetime

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull, EsColaboradorPermission
from .api_serializers import (
    ApunteContableSerializer,
    AsientoContableSerializer,
    AsientoContableConDetalleSerializer
)
from .models import (
    ApunteContable,
    AsientoContable
)


class AsientoContableViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = AsientoContable.objects.select_related(
        'diario_contable',
        'empresa',
        'tercero'
    ).all()
    serializer_class = AsientoContableSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = AsientoContableConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        from .services import asiento_contable_asentar_apuntes
        apuntes_contables = json.loads(request.data.get('apuntes_contables_asiento'))
        tercero_id = request.data.get('tercero')
        concepto = request.data.get('concepto')
        diario_contable_id = request.data.get('diario_contable')
        fecha = request.data.get('fecha')
        empresa_id = request.data.get('empresa')

        asiento = AsientoContable()
        asiento.empresa_id = empresa_id
        asiento.tercero_id = tercero_id
        asiento.diario_contable_id = diario_contable_id
        asiento.fecha = fecha
        asiento.concepto = concepto
        asiento.nota = ''
        asiento.save()

        asiento = asiento_contable_asentar_apuntes(
            asiento_contable_id=asiento.id,
            apuntes_contables=apuntes_contables
        )
        asiento = AsientoContable.objects.get(pk=asiento.id)
        serializer = self.get_serializer(asiento)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        from .services import asiento_contable_asentar_apuntes
        apuntes_contables = json.loads(request.data.get('apuntes_contables_asiento'))
        tercero_id = request.data.get('tercero')
        concepto = request.data.get('concepto')
        diario_contable_id = request.data.get('diario_contable')
        fecha = request.data.get('fecha')
        empresa_id = request.data.get('empresa')
        id = request.data.get('id')

        asiento = AsientoContable.objects.get(pk=id)
        asiento.empresa_id = empresa_id
        asiento.tercero_id = tercero_id
        asiento.diario_contable_id = diario_contable_id
        asiento.fecha = fecha
        asiento.concepto = concepto
        asiento.nota = ''
        asiento.save()

        asiento = asiento_contable_asentar_apuntes(
            asiento_contable_id=asiento.id,
            apuntes_contables=apuntes_contables
        )
        asiento = AsientoContable.objects.get(pk=asiento.id)
        serializer = self.get_serializer(asiento)
        return Response(serializer.data)

    @list_route(methods=['get'], permission_classes=[EsColaboradorPermission])
    def por_fecha_empresa_diario(self, request):
        empresa_id = int(request.GET.get('empresa_id'))
        diario_id = int(request.GET.get('diario_id'))
        fecha = datetime.strptime(request.GET.get('fecha'), "%d/%m/%Y").date()
        qs = self.queryset.filter(
            fecha__date=fecha,
            diario_contable_id=diario_id,
            empresa_id=empresa_id
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ApunteContableViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = ApunteContable.objects.select_related(
        'cuenta_contable',
        'asiento_contable'
    ).all()
    serializer_class = ApunteContableSerializer
