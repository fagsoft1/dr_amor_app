from rest_framework import serializers

from .models import PuntoVenta


class PuntoVentaSerializer(serializers.ModelSerializer):
    bodega_nombre = serializers.CharField(source='bodega.nombre', read_only=True)
    tipo_nombre = serializers.SerializerMethodField()

    class Meta:
        model = PuntoVenta
        fields = [
            'url',
            'id',
            'nombre',
            'bodega',
            'bodega_nombre',
            'tipo',
            'tipo_nombre',
        ]

    def get_tipo_nombre(self, obj):
        return obj.get_tipo_display()
