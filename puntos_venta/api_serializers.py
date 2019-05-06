from rest_framework import serializers

from .models import PuntoVenta, PuntoVentaTurno


class PuntoVentaSerializer(serializers.ModelSerializer):
    usuario_actual_nombre = serializers.CharField(source='usuario_actual.username', read_only=True)
    bodega_nombre = serializers.CharField(source='bodega.nombre', read_only=True)
    tipo_nombre = serializers.SerializerMethodField()
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = PuntoVenta
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
            'bodega',
            'bodega_nombre',
            'tipo',
            'tipo_nombre',
            'abierto',
            'usuario_actual',
            'usuario_actual_nombre',
            'conceptos_operaciones_caja_cierre',
        ]

    def get_tipo_nombre(self, obj):  # pragma: no cover
        return obj.get_tipo_display()


class PuntoVentaTurnoSerializer(serializers.ModelSerializer):
    punto_venta_nombre = serializers.CharField(source='punto_venta.nombre', read_only=True)
    total_efectivo = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_tarjeta = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_tarjeta_cantidad = serializers.IntegerField()

    class Meta:
        model = PuntoVentaTurno
        fields = [
            'url',
            'id',
            'usuario',
            'punto_venta',
            'punto_venta_nombre',
            'turno_anterior',
            'diferencia_cierre_caja_anterior',
            'base_inicial_efectivo',
            'diferencia_cierre_caja',
            'finish',
            'total_efectivo',
            'total_tarjeta',
            'total_tarjeta_cantidad'
        ]
