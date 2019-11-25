from rest_framework import serializers

from dr_amor_app.general_mixins.custom_serializer_mixins import CustomSerializerMixin
from .models import PuntoVenta, PuntoVentaTurno
from cajas.api_serializers import ConceptoOperacionCajaPuntoVentaSerializer
from contabilidad_metodos_pago.api_serializers import MetodoPagoSerializerPuntoVentaSerializer


class PuntoVentaSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    usuario_actual_nombre = serializers.CharField(source='usuario_actual.username', read_only=True)
    bodega_nombre = serializers.CharField(source='bodega.nombre', read_only=True)
    tipo_nombre = serializers.SerializerMethodField()
    to_string = serializers.SerializerMethodField()
    cuenta_contable_caja_nombre = serializers.CharField(source='cuenta_contable_caja.descripcion', read_only=True)

    def create(self, validated_data):
        from .services import punto_venta_crear_actualizar
        bodega = validated_data.get('bodega', None)
        nombre = validated_data.get('nombre', None)
        tipo = validated_data.get('tipo', None)
        cuenta_contable_caja = validated_data.get('cuenta_contable_caja', None)
        instancia = punto_venta_crear_actualizar(
            bodega_id=bodega.id if bodega else None,
            cuenta_contable_caja_id=cuenta_contable_caja.id if cuenta_contable_caja else None,
            nombre=nombre,
            tipo=tipo
        )
        return instancia

    def update(self, instance, validated_data):
        from .services import punto_venta_crear_actualizar
        bodega = validated_data.get('bodega', None)
        nombre = validated_data.get('nombre', None)
        tipo = validated_data.get('tipo', None)
        cuenta_contable_caja = validated_data.get('cuenta_contable_caja', None)
        instancia = punto_venta_crear_actualizar(
            bodega_id=bodega.id if bodega else None,
            cuenta_contable_caja_id=cuenta_contable_caja.id if cuenta_contable_caja else None,
            nombre=nombre,
            tipo=tipo,
            punto_venta_id=instance.id
        )
        return instancia

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
            'cuenta_contable_caja',
            'cuenta_contable_caja_nombre',
            'tipo',
            'tipo_nombre',
            'abierto',
            'usuario_actual',
            'usuario_actual_nombre',
            'conceptos_operaciones_caja_punto_venta',
            'metodos_pagos_punto_venta',
        ]
        read_only_fields = ['conceptos_operaciones_caja_punto_venta', 'metodos_pagos_punto_venta']

    def get_tipo_nombre(self, obj):  # pragma: no cover
        return obj.get_tipo_display()


class PuntoVentaSerializerDetalle(PuntoVentaSerializer):
    conceptos_operaciones_caja_punto_venta = ConceptoOperacionCajaPuntoVentaSerializer(many=True, read_only=True)
    metodos_pagos_punto_venta = MetodoPagoSerializerPuntoVentaSerializer(many=True, read_only=True)


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
