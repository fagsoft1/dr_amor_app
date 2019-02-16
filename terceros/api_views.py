from decimal import Decimal

from django.db.models import Q, OuterRef, ExpressionWrapper, Subquery, DecimalField
from knox.models import AuthToken
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from rest_framework.utils import json

from cajas.models import MovimientoDineroPDV
from .models import Tercero
from rest_framework import viewsets, permissions

from .api_serializers import AcompananteSerializer, ColaboradorSerializer, ProveedorSerializer, TerceroSerializer
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

    @list_route(methods=['get'])
    def listar_presentes(self, request) -> Response:
        qs = self.get_queryset().filter(
            Q(presente=True) &
            (
                    Q(es_acompanante=True) |
                    Q(es_colaborador=True)
            )
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def listar_ausentes(self, request) -> Response:
        qs = self.get_queryset().filter(
            Q(presente=False) & Q(usuario__is_active=True) & (Q(es_acompanante=True) | Q(es_colaborador=True))
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def liquidar_cuenta(self, request, pk=None):
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

        MovimientoDineroPDV.objects.create(
            tipo="E",
            tipo_dos='LIQ_ACOM',
            punto_venta_id=punto_venta_id,
            creado_por=request.user,
            concepto='Liquidación de cuenta a Acompañante %s' % tercero.full_name_proxy,
            valor_efectivo=-a_pagar,
            liquidacion=liquidacion
        )
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
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tercero.objects.select_related('usuario', 'categoria_modelo').filter(es_acompanante=True).all()
    serializer_class = AcompananteSerializer
    search_fields = ['=nro_identificacion', 'nombre', 'nombre_segundo', 'apellido', 'apellido_segundo', 'alias_modelo']

    @list_route(methods=['get'])
    def listar_presentes(self, request) -> Response:
        qs = self.get_queryset().filter(
            es_acompanante=True,
            presente=True
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ColaboradorViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tercero.objects.select_related('usuario').filter(es_colaborador=True).all()
    serializer_class = ColaboradorSerializer
    search_fields = ['=nro_identificacion', 'nombre', 'nombre_segundo', 'apellido', 'apellido_segundo']

    @detail_route(methods=['post'])
    def adicionar_punto_venta(self, request, pk=None):
        colaborador = self.get_object()
        punto_venta_id = self.request.POST.get('punto_venta_id')
        if hasattr(colaborador, 'usuario'):
            usuario = colaborador.usuario
            if not usuario.mis_puntos_venta.filter(id=punto_venta_id).exists():
                usuario.mis_puntos_venta.add(punto_venta_id)
        return Response({'result': 'se ha adicionado correctamente el punto de venta'})

    @detail_route(methods=['post'])
    def quitar_punto_venta(self, request, pk=None):
        colaborador = self.get_object()
        punto_venta_id = self.request.POST.get('punto_venta_id')
        if hasattr(colaborador, 'usuario'):
            usuario = colaborador.usuario
            if usuario.mis_puntos_venta.filter(id=punto_venta_id).exists():
                usuario.mis_puntos_venta.remove(punto_venta_id)
        return Response({'result': 'se ha retirado correctamente el punto de venta'})

    @detail_route(methods=['post'])
    def upload_archivo(self, request, pk=None):
        colaborador = self.get_object()
        archivo = self.request.FILES['archivo']
        colaborador.imagen_perfil = archivo
        colaborador.save()
        serializer = self.get_serializer(colaborador)
        return Response(serializer.data)


class ProveedorViewSet(TerceroViewSetMixin, viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tercero.objects.filter(es_proveedor=True).all()
    serializer_class = ProveedorSerializer
    search_fields = ['=nro_identificacion', 'nombre']
