from rest_framework import serializers

from .models import CategoriaAcompanante, FraccionTiempo, CategoriaFraccionTiempo


class CategoriaAcompananteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaAcompanante
        fields = [
            'id',
            'nombre',
            'orden',
        ]


class FraccionTiempoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FraccionTiempo
        fields = [
            'id',
            'nombre',
            'minutos',
        ]


class CategoriaFraccionTiempoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    fraccion_tiempo_nombre = serializers.CharField(source='fraccion_tiempo.nombre', read_only=True)
    fraccion_tiempo_minutos = serializers.IntegerField(source='fraccion_tiempo.minutos', read_only=True)

    class Meta:
        model = CategoriaFraccionTiempo
        fields = [
            'id',
            'categoria',
            'categoria_nombre',
            'fraccion_tiempo',
            'fraccion_tiempo_nombre',
            'fraccion_tiempo_minutos',
            'valor',
        ]
