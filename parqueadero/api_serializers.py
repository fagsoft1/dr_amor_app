from rest_framework import serializers
from .models import TipoVehiculo, ModalidadFraccionTiempo, ModalidadFraccionTiempoDetalle, Vehiculo


class TipoVehiculoSerializer(serializers.ModelSerializer):
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = TipoVehiculo
        fields = [
            'url',
            'id',
            'to_string',
            'nombre',
            'empresa',
            'empresa_nombre'
        ]


class ModalidadFraccionTiempoSerializer(serializers.ModelSerializer):
    tipo_vehiculo_nombre = serializers.CharField(source='tipo_vehiculo.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = ModalidadFraccionTiempo
        fields = [
            'url',
            'id',
            'to_string',
            'nombre',
            'tipo_vehiculo',
            'tipo_vehiculo_nombre',
        ]


class ModalidadFraccionTiempoDetalleSerializer(serializers.ModelSerializer):
    modalidad_fraccion_tiempo_nombre = serializers.CharField(source='modalidad_fraccion_tiempo.nombre', read_only=True)
    tipo_vehiculo_nombre = serializers.CharField(source='modalidad_fraccion_tiempo.tipo_vehiculo.nombre',
                                                 read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = ModalidadFraccionTiempoDetalle
        fields = [
            'url',
            'id',
            'to_string',
            'minutos',
            'valor',
            'modalidad_fraccion_tiempo',
            'modalidad_fraccion_tiempo_nombre',
            'tipo_vehiculo_nombre',
        ]


class VehiculoSerializer(serializers.ModelSerializer):
    tipo_vehiculo_nombre = serializers.CharField(
        source='tipo_vehiculo.nombre',
        read_only=True
    )
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = Vehiculo
        fields = [
            'url',
            'id',
            'to_string',
            'placa',
            'tipo_vehiculo',
            'tipo_vehiculo_nombre',
        ]
