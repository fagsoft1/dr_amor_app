from rest_framework import serializers
from django.utils.timezone import now

from .models import Servicio, VentaServicio


class ServicioSerializer(serializers.ModelSerializer):
    acompanante = serializers.PrimaryKeyRelatedField(source='cuenta.propietario.tercero.id', read_only=True)
    acompanante_nombre = serializers.CharField(source='cuenta.propietario.tercero.full_name_proxy', read_only=True)
    habitacion_nombre = serializers.CharField(source='venta_servicio.habitacion.nombre', read_only=True)
    habitacion = serializers.PrimaryKeyRelatedField(source='venta_servicio.habitacion.id', read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(source='cuenta.propietario.tercero.categoria_modelo.id',
                                                      read_only=True)
    termino = serializers.SerializerMethodField()
    en_espera = serializers.SerializerMethodField()

    def get_termino(self, obj):
        if obj.estado == 1:
            return now() > obj.hora_final
        else:
            return False

    def get_en_espera(self, obj):
        if obj.estado == 1:
            return obj.hora_inicio > now()
        else:
            return False

    class Meta:
        model = Servicio
        fields = (
            'id',
            'servicio_siguiente',
            'venta_servicio',
            'cuenta',
            'empresa',
            'habitacion_nombre',
            'habitacion',
            'estado',
            'hora_inicio',
            'hora_final',
            'hora_final_real',
            'hora_anulacion',
            'tiempo_minutos',
            'termino',
            'en_espera',
            'categoria',
            'categoria_id',
            'acompanante',
            'acompanante_nombre',
            'valor_servicio',
            'valor_habitacion',
            'valor_iva_habitacion',
            'valor_total',
            'observacion_anulacion',
        )
        extra_kwargs = {
            'valor_total': {'read_only': True},
        }


class VentaServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = VentaServicio
        fields = (
            'id',
            'habitacion',
            'created_by',
            'estado',
        )
