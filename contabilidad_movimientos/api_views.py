import json
from datetime import datetime
from io import BytesIO

from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
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

    @action(detail=True, methods=['post'], permission_classes=[EsColaboradorPermission])
    def imprimir_asiento_contable(self, request, pk=None):
        from .services import asiento_contable_con_comprobante_generar_tirilla
        ultimo_asiento = AsientoContable.objects.last()
        main_doc = asiento_contable_con_comprobante_generar_tirilla(asiento_contable_id=ultimo_asiento.pk)
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

    @action(detail=False, methods=['post'], permission_classes=[EsColaboradorPermission])
    def asentar_operacion_caja(self, request):
        from .services import asiento_contable_asentar_operacion_caja

        concepto = int(self.request.POST.get('concepto', None))
        valor = float(self.request.POST.get('valor', None))
        tercero = self.request.POST.get('tercero', None)
        observacion = str(self.request.POST.get('observacion', None))

        asiento_contable = asiento_contable_asentar_operacion_caja(
            concepto_id=concepto,
            valor=valor,
            tercero_id=int(tercero) if tercero is not None else None,
            observacion=observacion,
            usuario_pdv_id=self.request.user.id
        )

        serializer = self.get_serializer(asiento_contable)
        return Response(serializer.data)


class ApunteContableViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = ApunteContable.objects.select_related(
        'cuenta_contable',
        'asiento_contable'
    ).all()
    serializer_class = ApunteContableSerializer
