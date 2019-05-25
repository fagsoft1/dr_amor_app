from rest_framework import serializers

from .models import (
    Impuesto
)


class ImpuestoSerializer(serializers.ModelSerializer):
    cuenta_impuesto_descripcion = serializers.CharField(source='cuenta_impuesto.descripcion', read_only=True)
    cuenta_impuesto_notas_credito_descripcion = serializers.CharField(
        source='cuenta_impuesto_notas_credito.descripcion',
        read_only=True
    )
    to_string = serializers.SerializerMethodField()
    tipo_calculo_impuesto_display = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    def get_tipo_calculo_impuesto_display(self, instance):  # pragma: no cover
        return instance.get_tipo_calculo_impuesto_display()

    class Meta:
        model = Impuesto
        fields = [
            'url',
            'id',
            'to_string',
            'nombre',
            'tipo_calculo_impuesto',
            'cuenta_impuesto',
            'cuenta_impuesto_descripcion',
            'cuenta_impuesto_notas_credito',
            'cuenta_impuesto_notas_credito_descripcion',
            'tasa_importe_venta',
            'tasa_importe_compra',
            'tipo_calculo_impuesto_display',
        ]
