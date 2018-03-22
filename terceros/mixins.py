from rest_framework.decorators import list_route
from rest_framework.response import Response

from dr_amor_app.utils_queryset import query_varios_campos_or
from terceros.models import Tercero


class TerceroViewSetMixin(object):
    search_fields = None

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

        if nro_identificacion and Tercero.existe_documento(nro_identificacion):
            validacion_reponse.update({'nro_identificacion': 'Ya exite'})
            print('llego')

        return Response(validacion_reponse)
