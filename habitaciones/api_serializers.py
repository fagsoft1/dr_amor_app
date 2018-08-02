from channels.binding.websockets import WebsocketBinding
from rest_framework import serializers

from .models import Habitacion, TipoHabitacion


class TipoHabitacionSerializer(serializers.ModelSerializer):
    # valor_antes_impuestos = serializers.DecimalField(read_only=True, decimal_places=2, max_digits=10)
    # impuesto = serializers.DecimalField(read_only=True, decimal_places=2, max_digits=10)

    class Meta:
        model = TipoHabitacion
        fields = (
            'id',
            'nombre',
            'valor',
            'porcentaje_impuesto',
            'valor_antes_impuestos',
            'impuesto',
        )
        extra_kwargs = {
            'valor_antes_impuestos': {'read_only': True},
            'impuesto': {'read_only': True},
        }


class HabitacionSerializer(serializers.ModelSerializer):
    tipo_habitacion_nombre = serializers.CharField(source='tipo.nombre', read_only=True)
    valor = serializers.DecimalField(source='tipo.valor', max_digits=10, decimal_places=0, read_only=True)
    porcentaje_impuesto = serializers.DecimalField(
        source='tipo.porcentaje_impuesto',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)
    tiempo_final_servicio = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Habitacion
        fields = [
            'url',
            'id',
            'activa',
            'nombre',
            'tipo',
            'tipo_habitacion_nombre',
            'porcentaje_impuesto',
            'empresa',
            'empresa_nombre',
            'numero',
            'tiempo_final_servicio',
            'fecha_ultimo_estado',
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
