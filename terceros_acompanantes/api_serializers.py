from rest_framework import serializers

from .models import CategoriaAcompanante, FraccionTiempo, CategoriaFraccionTiempo


class CategoriaAcompananteSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = CategoriaAcompanante
        fields = [
            'id',
            'nombre',
            'to_string',
            'orden',
        ]


class FraccionTiempoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = FraccionTiempo
        fields = [
            'id',
            'nombre',
            'to_string',
            'minutos',
        ]


class CategoriaFraccionTiempoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    fraccion_tiempo_nombre = serializers.CharField(source='fraccion_tiempo.nombre', read_only=True)
    fraccion_tiempo_minutos = serializers.IntegerField(source='fraccion_tiempo.minutos', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.fraccion_tiempo.minutos

    class Meta:
        model = CategoriaFraccionTiempo
        fields = [
            'id',
            'categoria',
            'to_string',
            'categoria_nombre',
            'fraccion_tiempo',
            'fraccion_tiempo_nombre',
            'fraccion_tiempo_minutos',
            'valor',
        ]
