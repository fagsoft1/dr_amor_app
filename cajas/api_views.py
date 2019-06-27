from io import BytesIO

from django.http import HttpResponse
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull, EsColaboradorPermission
from .api_serializers import (
    BilleteMonedaSerializer,
    ArqueoCajaSerializer,
    ConceptoOperacionCajaSerializer,
    OperacionCajaSerializer
)
from .models import (
    BilleteMoneda,
    OperacionCaja,
    ConceptoOperacionCaja,
    ArqueoCaja
)


class OperacionCajaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = OperacionCaja.objects.select_related(
        'cuenta',
        'concepto'
    ).all()
    serializer_class = OperacionCajaSerializer

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def consultar_por_tercero_cuenta_abierta(self, request):
        tercero_id = request.GET.get('tercero_id', None)
        qs = self.queryset.filter(
            cuenta__propietario__tercero=tercero_id,
            cuenta__liquidada=False,
            cuenta__tipo=1
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ConceptoOperacionCajaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = ConceptoOperacionCaja.objects.all()
    serializer_class = ConceptoOperacionCajaSerializer


class BilleteMonedaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = BilleteMoneda.objects.all()
    serializer_class = BilleteMonedaSerializer


class ArqueoCajaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = ArqueoCaja.objects.select_related(
        'punto_venta_turno',
        'punto_venta_turno__usuario__tercero',
        'punto_venta_turno__punto_venta'
    ).all()
    serializer_class = ArqueoCajaSerializer

    @action(detail=False, methods=['get'], permission_classes=[EsColaboradorPermission])
    def mi_ultimo_arqueo_caja(self, request):
        usuario = self.request.user
        arqueo = ArqueoCaja.objects.filter(punto_venta_turno__usuario=usuario).last()
        serializer = self.get_serializer(arqueo)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def imprimir_entrega(self, request, pk=None):
        from .services import arqueo_generar_recibo_entrega
        arqueo = self.get_object()
        main_doc = arqueo_generar_recibo_entrega(arqueo_id=arqueo.id)
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

    @action(detail=True, methods=['post'])
    def imprimir_arqueo(self, request, pk=None):
        from .services import arqueo_generar_reporte
        arqueo = self.get_object()
        main_doc = arqueo_generar_reporte(arqueo_id=arqueo.id)
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

    # @action(detail=True, methods=['post'])
    # def enviar_arqueo_email(self, request, pk=None):
    #     arqueo = self.get_object()
    #     main_doc = self.generar_pdf_arqueo(request)
    #     text_content = render_to_string('email/cajas/arqueo_caja_envio_correo.html', {})
    #     output = BytesIO()
    #     main_doc.write_pdf(
    #         target=output
    #     )
    #
    #     msg = EmailMultiAlternatives(
    #         'Arqueo de Caja de %s' % arqueo.usuario.username,
    #         text_content,
    #         bcc=['fabiogarciasanchez+dramor@gmail.com'],
    #         from_email='Clínica Dr. Amor <%s>' % 'webmaster@clinicadramor.com',
    #         to=['fabiogarciasanchez+dramor@gmail.com']
    #     )
    #     msg.attach_alternative(text_content, "text/html")
    #     msg.attach('Arqueo de caja %s' % arqueo.usuario.username, output.getvalue(), 'application/pdf')
    #     try:
    #         msg.send()
    #     except Exception as e:
    #         raise serializers.ValidationError(
    #             {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    #     return Response({'resultado': 'ok'})
