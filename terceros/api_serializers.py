from channels.binding.websockets import WebsocketBinding
from .services import acompanante_desencriptar
from rest_framework import serializers

from terceros.services import (
    tercero_set_new_pin,
    colaborador_update,
    acompanante_update,
    acompanante_crear,
    colaborador_crear,
    acompanante_encriptar
)
from .models import Tercero, Cuenta
from servicios.api_serializers import ServicioSerializer
from cajas.api_serializers import OperacionCajaSerializer
from ventas.api_serializers import VentaProductoConDetalleSerializer


class CuentaSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(source='propietario.tercero.full_name_proxy', read_only=True)
    es_acompanante = serializers.BooleanField(source='propietario.tercero.es_acompanante', read_only=True)
    es_colaborador = serializers.BooleanField(source='propietario.tercero.es_colaborador', read_only=True)
    es_proveedor = serializers.BooleanField(source='propietario.tercero.es_proveedor', read_only=True)
    presente = serializers.BooleanField(source='propietario.tercero.presente', read_only=True)

    class Meta:
        model = Cuenta
        fields = [
            'id',
            'nombre',
            'es_acompanante',
            'es_colaborador',
            'es_proveedor',
            'presente',
            'liquidada',
            'tipo',
        ]


class CuentaAcompananteSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(source='propietario.tercero.full_name_proxy', read_only=True)
    es_acompanante = serializers.BooleanField(source='propietario.tercero.es_acompanante', read_only=True)
    es_colaborador = serializers.BooleanField(source='propietario.tercero.es_colaborador', read_only=True)
    es_proveedor = serializers.BooleanField(source='propietario.tercero.es_proveedor', read_only=True)
    presente = serializers.BooleanField(source='propietario.tercero.presente', read_only=True)

    saldo_anterior_cxp = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        read_only=True
    )
    saldo_anterior_cxc = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        read_only=True
    )
    pagado = serializers.DecimalField(
        source='liquidacion.pagado',
        max_digits=12,
        decimal_places=2,
        default=0,
        read_only=True
    )
    saldo = serializers.DecimalField(
        source='liquidacion.saldo',
        max_digits=12,
        decimal_places=2,
        default=0,
        read_only=True
    )

    cxp_por_servicios = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    cxp_por_comisiones_habitacion = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    cxp_por_operaciones_caja = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    cxc_por_compras_productos = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    cxc_por_operaciones_caja = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    cxc_total = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    cxp_total = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        model = Cuenta
        fields = [
            'id',
            'nombre',
            'es_acompanante',
            'es_colaborador',
            'es_proveedor',
            'presente',
            'compras_productos',
            'operaciones_caja',
            'servicios',
            'pagado',
            'saldo_anterior_cxc',
            'saldo_anterior_cxp',
            'saldo',
            'liquidada',
            'tipo',
            'cxp_por_servicios',
            'cxp_por_comisiones_habitacion',
            'cxp_por_operaciones_caja',
            'cxc_por_compras_productos',
            'cxc_por_operaciones_caja',
            'cxc_total',
            'cxp_total',
        ]


class CuentaAcompananteDetalleSerializer(CuentaAcompananteSerializer):
    servicios = ServicioSerializer(many=True)
    operaciones_caja = OperacionCajaSerializer(many=True)
    compras_productos = VentaProductoConDetalleSerializer(many=True)


class TerceroSerializer(serializers.ModelSerializer):
    categoria_modelo_nombre = serializers.CharField(source='categoria_modelo.nombre', read_only=True)

    class Meta:
        model = Tercero
        fields = [
            'id',
            'full_name_proxy',
            'es_acompanante',
            'es_colaborador',
            'categoria_modelo_nombre',
            'categoria_modelo',
            'presente',
            'estado',
        ]


class TercerosBinding(WebsocketBinding):
    model = Tercero
    stream = "terceros"
    fields = ["id", ]

    def serialize_data(self, instance):
        serializado = TerceroSerializer(instance, context={'request': None})
        return serializado.data

    @classmethod
    def group_names(cls, *args, **kwargs):
        return ["binding.pos_servicios"]

    def has_permission(self, user, action, pk):
        return True


class AcompananteSerializer(serializers.ModelSerializer):
    categoria_modelo_nombre = serializers.CharField(source='categoria_modelo.nombre', read_only=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    fecha_nacimiento = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])
    saldo_final = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    to_string = serializers.SerializerMethodField()
    identificacion = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    nombre_1 = serializers.SerializerMethodField()
    nombre_segundo_1 = serializers.SerializerMethodField()
    apellido_1 = serializers.SerializerMethodField()
    apellido_segundo_1 = serializers.SerializerMethodField()
    nro_identificacion_1 = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.full_name_proxy

    def get_nombre_1(self, instance):
        return None

    def get_nombre_segundo_1(self, instance):
        return None

    def get_apellido_1(self, instance):
        return None

    def get_apellido_segundo_1(self, instance):
        return None

    def get_nro_identificacion_1(self, instance):
        return None

    def get_full_name(self, instance):
        return None

    def get_identificacion(self, instance):
        return None

    class Meta:
        model = Tercero
        fields = [
            'id',
            'full_name',
            'full_name_proxy',
            'to_string',
            'nombre_1',
            'nombre_segundo_1',
            'apellido_1',
            'apellido_segundo_1',
            'nro_identificacion_1',
            'nombre',
            'nombre_segundo',
            'apellido',
            'apellido_segundo',
            'nro_identificacion',
            'identificacion',
            'genero',
            'tipo_documento',
            'fecha_nacimiento',
            'grupo_sanguineo',
            'es_acompanante',
            'alias_modelo',
            'categoria_modelo',
            'categoria_modelo_nombre',
            'usuario',
            'presente',
            'estado',
            'usuario_username',
            'saldo_final',
        ]
        extra_kwargs = {
            'usuario': {'read_only': True},
            'nombre': {'write_only': True},
            'nombre_segundo': {'write_only': True},
            'apellido': {'write_only': True},
            'apellido_segundo': {'write_only': True},
            'nro_identificacion': {'write_only': True},
        }

    def create(self, validated_data):
        acompanante = acompanante_crear(validated_data)
        return acompanante

    def update(self, instance, validated_data):
        acompanante = acompanante_update(instance.id, validated_data)
        return acompanante


class AcompananteDesencriptadoSerializer(AcompananteSerializer):
    def get_nombre_1(self, instance):
        return acompanante_desencriptar(instance.nombre)

    def get_nombre_segundo_1(self, instance):
        return acompanante_desencriptar(instance.nombre_segundo)

    def get_apellido_1(self, instance):
        return acompanante_desencriptar(instance.apellido)

    def get_apellido_segundo_1(self, instance):
        return acompanante_desencriptar(instance.apellido_segundo)

    def get_full_name(self, instance):
        return instance.full_name

    def get_identificacion(self, instance):
        return instance.identificacion

    def get_nro_identificacion_1(self, instance):
        return acompanante_desencriptar(instance.nro_identificacion)


class ColaboradorSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    fecha_nacimiento = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])
    to_string = serializers.SerializerMethodField()
    imagen_perfil_url = serializers.SerializerMethodField()

    def get_imagen_perfil_url(self, obj):
        if obj.imagen_perfil:
            return obj.imagen_perfil.url
        return None

    def get_to_string(self, instance):
        return instance.full_name_proxy

    class Meta:
        model = Tercero
        fields = [
            'id',
            'full_name',
            'full_name_proxy',
            'nombre',
            'imagen_perfil_url',
            'to_string',
            'nombre_segundo',
            'apellido',
            'apellido_segundo',
            'genero',
            'tipo_documento',
            'es_colaborador',
            'nro_identificacion',
            'identificacion',
            'fecha_nacimiento',
            'grupo_sanguineo',
            'usuario',
            'presente',
            'estado',
            'usuario_username'
        ]
        extra_kwargs = {
            'full_name': {'read_only': True},
            'usuario': {'read_only': True},
            'identificacion': {'read_only': True},
        }

    def create(self, validated_data):
        colaborador = colaborador_crear(validated_data)
        return colaborador

    def update(self, instance, validated_data):
        colaborador = colaborador_update(instance.id, validated_data)
        return colaborador


class ProveedorSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.full_name_proxy

    def create(self, validated_data):
        validated_data.update(es_proveedor=True)
        return super().create(validated_data)

    class Meta:
        model = Tercero
        fields = [
            'id',
            'nombre',
            'to_string',
            'full_name_proxy',
            'tipo_documento',
            'es_proveedor',
            'nro_identificacion',
            'identificacion',
        ]
        extra_kwargs = {
            'identificacion': {'read_only': True},
        }
