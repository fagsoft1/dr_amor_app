from django.db.models import OuterRef, ExpressionWrapper, DecimalField, Subquery
from rest_framework.decorators import list_route
from rest_framework.response import Response

from dr_amor_app.utils_queryset import query_varios_campos_or
from liquidaciones.models import LiquidacionCuenta
from terceros.services import (
    tercero_existe_documento
)


class TerceroViewSetMixin(object):
    search_fields = None

    def get_queryset(self):
        saldo = LiquidacionCuenta.objects.filter(
            cuenta__liquidada=True,
            cuenta__tipo=1,
            cuenta__propietario_id=OuterRef('usuario_id')
        ).order_by('-pk')
        qs = self.queryset.annotate(
            saldo_final=ExpressionWrapper(
                Subquery(saldo.values('saldo')[:1]),
                output_field=DecimalField(max_digits=10, decimal_places=2)
            )
        ).all()
        return qs

    def buscar_x_parametro(self, request) -> Response:
        parametro = request.GET.get('parametro')
        qs = None
        if len(parametro) > 5:
            qs = query_varios_campos_or(self.queryset, self.search_fields, parametro)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def validar_documento_tercero(self, request) -> Response:
        validacion_reponse = {}
        nro_identificacion = self.request.GET.get('nro_identificacion', None)
        tipo_documento = self.request.GET.get('tipo_documento', None)

        if nro_identificacion and tercero_existe_documento(nro_identificacion):
            validacion_reponse.update({'nro_identificacion': 'Ya exite'})
        return Response(validacion_reponse)
