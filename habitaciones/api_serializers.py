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
