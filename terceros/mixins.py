from rest_framework import serializers
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from knox.models import AuthToken

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
        return Response(validacion_reponse)

    @detail_route(methods=['post'])
    def cambiar_pin(self, request, pk=None):
        tercero = self.get_object()
        pin = self.request.POST.get('pin1')
        tercero.set_new_pin(pin)
        serializer = self.get_serializer(tercero)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def registrar_ingreso(self, request, pk=None):
        tercero = self.get_object()
        pin = request.POST.get('pin')

        if not pin or pin == "":
            raise serializers.ValidationError('El pin no puede ser vacio')
        elif not tercero.is_pin_correct(pin):
            raise serializers.ValidationError('Es un pin errado')
        else:
            if not tercero.presente:
                tercero.presente = True
                tercero.registra_entrada()
                tercero.estado = 0
                tercero.save()
            mensaje = 'El registro de Entrada para %s ha sido éxitoso' % (tercero.full_name_proxy)
            return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def registrar_salida(self, request, pk=None):
        tercero = self.get_object()
        pin = request.POST.get('pin')

        if not pin or pin == "":
            raise serializers.ValidationError('El pin no puede ser vacio')
        elif not tercero.is_pin_correct(pin):
            raise serializers.ValidationError('Es un pin errado')
        else:
            if tercero.presente:
                cambio_estado, mensaje = tercero.cambiar_estado(0)
                AuthToken.objects.filter(user=tercero.usuario).delete()
                if cambio_estado:
                    tercero.presente = False
                    tercero.registra_salida()
                    tercero.save()
                else:
                    raise serializers.ValidationError(mensaje)

            mensaje = 'El registro de Salida para %s ha sido éxitoso' % (tercero.full_name_proxy)
            return Response({'result': mensaje})
            # if tercero.estado_tercero != 0:
            #     raise serializers.ValidationError(
            #         'El usuario se encuentra Ocupado, no es posible generar el registro de salida')
            # else:
            #     tercero.presente = False
            #     tercero.save()
            #     mensaje = 'El registro de Salida para %s ha sido éxitoso' % (tercero.get_nombre())
            #     return Response({'result': mensaje})
