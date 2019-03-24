from decimal import Decimal

from knox.models import AuthToken
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from rest_framework.utils import json

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from terceros.services import tercero_generarQR, tercero_existe_documento
from .models import Tercero
from rest_framework import viewsets, permissions, serializers

from .api_serializers import (
    AcompananteSerializer,
    AcompananteDesencriptadoSerializer,
    ColaboradorSerializer,
    ProveedorSerializer,
    TerceroSerializer
)
from .mixins import TerceroViewSetMixin

from liquidaciones.models import LiquidacionCuenta
from servicios.models import Servicio


class TerceroViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tercero.objects.select_related(
        'usuario',
        'categoria_modelo',
    ).all()
    serializer_class = TerceroSerializer

    @detail_route(methods=['post'])
    def cambiar_pin(self, request, pk=None):
        from terceros.services import tercero_cambiar_pin
        tercero = self.get_object()
        pin = request.POST.get('pin')
        password = request.POST.get('password')
        tercero_cambiar_pin(tercero_id=tercero.id, password=password, pin=pin)
        return Response({'result': 'El pin se ha cambiado correctamente'})

    @list_route(methods=['post'])
    def buscar_por_qr(self, request):
        codigo_qr = request.POST.get('codigo_qr')
        qs = Tercero.internos.presentes().filter(
            qr_acceso=codigo_qr
        ).first()
        if qs:
            serializer = self.get_serializer(qs)
        else:
            raise serializers.ValidationError({'_error': 'No se encuentra usuario con este codigo qr'})
        return Response(serializer.data)

    @list_route(methods=['get'])
    def listar_presentes(self, request) -> Response:
        qs = Tercero.internos.presentes()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def listar_ausentes(self, request) -> Response:
        qs = Tercero.internos.ausentes().activos()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def generar_qr(self, request, pk=None):
        tercero = self.get_object()
        tercero_generarQR(tercero.id)
        serializer = self.get_serializer(tercero)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def registrar_ingreso(self, request, pk=None):
        from terceros.services import tercero_registra_entrada
        tercero = self.get_object()
        pin = request.POST.get('pin')
        tercero_registra_entrada(tercero.id, pin)
        mensaje = 'El registro de Entrada para %s ha sido éxitoso' % (tercero.full_name_proxy)
        return Response({'result': mensaje})

    @detail_route(methods=['post'])
    def registrar_salida(self, request, pk=None):
        from terceros.services import tercero_registra_salida
        tercero = self.get_object()
        pin = request.POST.get('pin')
        tercero_registra_salida(tercero.id, pin)
        mensaje = 'El registro de Salida para %s ha sido éxitoso' % (tercero.full_name_proxy)
        return Response({'result': mensaje})

    # TODO: Hacer test
    # TODO: Hacer Función
    @detail_route(methods=['post'])
    def liquidar_cuenta(self, request, pk=None):
        # TODO: Hacer funcion
        tercero = self.get_object()
        pago = json.loads(request.POST.get('pago'))
        a_pagar = Decimal(pago.get('valor_a_pagar', 0))
        saldo = pago.get('saldo', 0)
        punto_venta_id = pago.get('punto_venta_id', None)
        cuenta = tercero.cuenta_abierta
        cuenta.liquidada = True
        liquidacion = LiquidacionCuenta.objects.create(
            cuenta=cuenta,
            pagado=a_pagar,
            saldo=saldo,
            punto_venta_id=punto_venta_id,
            creado_por=self.request.user
        )

        # TODO: Hacer lo correspondiente al registro en el nuevo TransaccionCaja
        # MovimientoDineroPDV.objects.create(
        #     tipo="E",
        #     tipo_dos='LIQ_ACOM',
        #     punto_venta_id=punto_venta_id,
        #     creado_por=request.user,
        #     concepto='Liquidación de cuenta a Acompañante %s' % tercero.full_name_proxy,
        #     valor_efectivo=-a_pagar,
        #     liquidacion=liquidacion
        # )
        cuenta.save()
        tercero.estado = 0
        tercero.presente = 0
        tercero.save()
        servicios = Servicio.objects.filter(estado=0)
        for servicio in servicios.all():
            servicio.delete()
        AuthToken.objects.filter(user=tercero.usuario).delete()
        return Response({'result': 'se ha retirado correctamente el punto de venta'})


class AcompananteViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Tercero.acompanantes.all()
    serializer_class = AcompananteSerializer
    search_fields = ['=nro_identificacion', 'nombre', 'nombre_segundo', 'apellido', 'apellido_segundo', 'alias_modelo']

    def get_serializer(self, *args, **kwargs):
        if self.request.user.has_perm('terceros.view_privado_terceroacompanante'):
            self.serializer_class = AcompananteDesencriptadoSerializer
        return super().get_serializer(*args, **kwargs)

    # TODO: Hacer test
    # TODO: Hacer Función
    def buscar_x_parametro(self, request) -> Response:
        from dr_amor_app.utils_queryset import query_varios_campos_or
        from terceros.services import acompanante_encriptar
        parametro = acompanante_encriptar(request.GET.get('parametro')) if request.GET.get('parametro') else ''

        qs = None
        if len(parametro) > 5:
            qs = query_varios_campos_or(self.queryset, self.search_fields, parametro)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def validar_documento_acompanante(self, request) -> Response:
        from terceros.services import acompanante_encriptar
        validacion_reponse = {}
        nro_identificacion = self.request.GET.get('nro_identificacion_1', None)
        alias_modelo = self.request.GET.get('alias_modelo', None)
        nro_identificacion = acompanante_encriptar(nro_identificacion) if nro_identificacion else nro_identificacion

        tipo_documento = self.request.GET.get('tipo_documento', None)

        if nro_identificacion and tercero_existe_documento(nro_identificacion):
            validacion_reponse.update({'nro_identificacion_1': 'Ya exite'})
        if alias_modelo and Tercero.objects.filter(alias_modelo=alias_modelo).exists():
            validacion_reponse.update({'alias_modelo': 'Ya exite'})
        return Response(validacion_reponse)

    @list_route(methods=['get'])
    def listar_presentes(self, request) -> Response:
        qs = Tercero.acompanantes.presentes()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ColaboradorViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Tercero.colaboradores.select_related('usuario').filter(es_colaborador=True).all()
    serializer_class = ColaboradorSerializer
    search_fields = ['=nro_identificacion', 'nombre', 'nombre_segundo', 'apellido', 'apellido_segundo']

    @detail_route(methods=['post'])
    def adicionar_punto_venta(self, request, pk=None):
        # TODO: Hacer funcion
        colaborador = self.get_object()
        punto_venta_id = self.request.POST.get('punto_venta_id')
        if hasattr(colaborador, 'usuario'):
            usuario = colaborador.usuario
            if not usuario.mis_puntos_venta.filter(id=punto_venta_id).exists():
                usuario.mis_puntos_venta.add(punto_venta_id)
        return Response({'result': 'se ha adicionado correctamente el punto de venta'})

    @detail_route(methods=['post'])
    def quitar_punto_venta(self, request, pk=None):
        # TODO: Hacer funcion
        colaborador = self.get_object()
        punto_venta_id = self.request.POST.get('punto_venta_id')
        if hasattr(colaborador, 'usuario'):
            usuario = colaborador.usuario
            if usuario.mis_puntos_venta.filter(id=punto_venta_id).exists():
                usuario.mis_puntos_venta.remove(punto_venta_id)
        return Response({'result': 'se ha retirado correctamente el punto de venta'})

    @detail_route(methods=['post'])
    def upload_archivo(self, request, pk=None):  # pragma: no cover
        colaborador = self.get_object()
        archivo = self.request.FILES['archivo']
        colaborador.imagen_perfil = archivo
        colaborador.save()
        serializer = self.get_serializer(colaborador)
        return Response(serializer.data)


class ProveedorViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tercero.proveedores.filter(es_proveedor=True).all()
    serializer_class = ProveedorSerializer
    search_fields = ['=nro_identificacion', 'nombre']
