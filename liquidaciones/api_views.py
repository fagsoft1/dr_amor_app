from django.http import HttpResponse
from rest_framework import viewsets, permissions
from rest_framework.decorators import detail_route
from io import BytesIO

from .api_serializers import LiquidacionCuentaSerializer
from .models import LiquidacionCuenta


class LiquidacionCuentaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = LiquidacionCuenta.objects.all()
    serializer_class = LiquidacionCuentaSerializer

    @detail_route(methods=['post'])
    def imprimir_liquidacion(self, request, pk=None):
        from .services import (
            liquidar_cuenta_acompanante_generar_comprobante,
            liquidar_cuenta_colaborador_generar_comprobante,
            liquidar_cuenta_mesero_generar_comprobante
        )
        liquidacion = self.get_object()
        if liquidacion.tipo_cuenta == 'ACOMPANANTE':
            main_doc = liquidar_cuenta_acompanante_generar_comprobante(
                liquidacion_id=liquidacion.id
            )
        elif liquidacion.tipo_cuenta == 'COLABORADOR':
            main_doc = liquidar_cuenta_colaborador_generar_comprobante(
                liquidacion_id=liquidacion.id
            )
        else:
            main_doc = liquidar_cuenta_mesero_generar_comprobante(
                liquidacion_id=liquidacion.id
            )
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
