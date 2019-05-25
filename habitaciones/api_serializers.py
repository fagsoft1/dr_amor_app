from channels.binding.websockets import WebsocketBinding
from rest_framework import serializers

from .models import Habitacion, TipoHabitacion
from contabilidad_impuestos.api_serializers import ImpuestoSerializer


class TipoHabitacionSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = TipoHabitacion
        fields = (
            'id',
            'nombre',
            'to_string',
            'valor',
            'valor_antes_impuestos',
            'impuestos',
            'impuesto',
            'valor_adicional_servicio',
        )
        extra_kwargs = {
            'valor_antes_impuestos': {'read_only': True},
            'impuestos': {'read_only': True},
        }


class TipoHabitacionConDetalleSerializer(TipoHabitacionSerializer):
    impuestos = ImpuestoSerializer(many=True, read_only=True)


class HabitacionSerializer(serializers.ModelSerializer):
    tipo_habitacion_nombre = serializers.CharField(source='tipo.nombre', read_only=True)
    valor = serializers.DecimalField(source='tipo.valor', max_digits=10, decimal_places=0, read_only=True)
    valor_adicional_servicio = serializers.DecimalField(
        source='tipo.valor_adicional_servicio',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)
    tiempo_final_servicio = serializers.DateTimeField(read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return ('%s %s') % (instance.tipo.nombre, instance.numero)

    class Meta:
        model = Habitacion
        fields = [
            'url',
            'id',
            'activa',
            'nombre',
            'tipo',
            'tipo_habitacion_nombre',
            'empresa',
            'empresa_nombre',
            'numero',
            'to_string',
            'tiempo_final_servicio',
            'fecha_ultimo_estado',
            'valor_adicional_servicio',
            'estado',
            'valor',
        ]
        extra_kwargs = {
            'nombre': {'read_only': True},
        }


class HabitacionBinding(WebsocketBinding):
    model = Habitacion
    stream = "habitaciones"
    fields = ["id", ]

    def serialize_data(self, instance):
        serializado = HabitacionSerializer(instance, context={'request': None})
        return serializado.data

    @classmethod
    def group_names(cls, *args, **kwargs):
        return ["binding.pos_servicios"]

    def has_permission(self, user, action, pk):
        return True
