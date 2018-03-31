from channels.binding.websockets import WebsocketBinding
from rest_framework import serializers

from .models import Habitacion, TipoHabitacion


class TipoHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoHabitacion
        fields = ('id', 'nombre', 'valor')


class HabitacionSerializer(serializers.ModelSerializer):
    tipo_habitacion_nombre = serializers.CharField(source='tipo.nombre', read_only=True)
    valor = serializers.DecimalField(source='tipo.valor', max_digits=10, decimal_places=0, read_only=True)
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)

    class Meta:
        model = Habitacion
        fields = [
            'url',
            'id',
            'activa',
            'tipo',
            'tipo_habitacion_nombre',
            'empresa',
            'empresa_nombre',
            'numero',
            'estado',
            'valor',
        ]


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
