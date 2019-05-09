from rest_framework import serializers

from .models import (
    AsientoContable,
    ApunteContable
)


class AsientoContableSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    diario_contable_nombre = serializers.CharField(source='diario_contable.nombre', read_only=True)
    diario_contable_codigo = serializers.CharField(source='diario_contable.codigo', read_only=True)
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)

    def get_to_string(self, instance):  # pragma: no cover
        return instance.diario_contable.nombre

    class Meta:
        model = AsientoContable
        fields = [
            'url',
            'id',
            'to_string',
            'diario_contable',
            'diario_contable_nombre',
            'diario_contable_codigo',
            'empresa',
            'empresa_nombre',
            'tercero',
            'concepto',
            'fecha',
            'consolidada',
            'nota',
        ]


class ApunteContableSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.diario_contable.nombre

    class Meta:
        model = ApunteContable
        fields = [
            'url',
            'id',
            'to_string',
            'asiento_contable',
            'cuenta_contable',
            'debito',
            'credito',
        ]
