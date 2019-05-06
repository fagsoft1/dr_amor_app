from rest_framework import serializers
from empresas.models import Empresa
from servicios.api_serializers import ServicioSerializer
from ventas.api_serializers import VentaProductoConDetalleSerializer


class EmpresaResumenSerializer(serializers.ModelSerializer):
    servicios = ServicioSerializer(many=True)
    ventas_productos = VentaProductoConDetalleSerializer(many=True)

    class Meta:
        model = Empresa
        fields = [
            'id',
            'nit',
            'nombre',
            'servicios',
            'ventas_productos'
        ]
