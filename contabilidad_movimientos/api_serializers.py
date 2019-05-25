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
    tercero_nombre = serializers.CharField(source='tercero.full_name_proxy', read_only=True)
    apuntes_contables_asiento = serializers.CharField(write_only=True, max_length=1000)
    debitos = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True, default=0)
    creditos = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True, default=0)

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
            'apuntes_contables_asiento',
            'empresa',
            'empresa_nombre',
            'tercero_nombre',
            'tercero',
            'concepto',
            'fecha',
            'consolidada',
            'debitos',
            'creditos',
            'nota',
            'apuntes_contables',
        ]
        extra_kwargs = {
            'apuntes_contables': {'read_only': True}
        }


class ApunteContableSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    cuenta_nombre = serializers.CharField(source='cuenta_contable.descripcion', read_only=True)

    def get_to_string(self, instance):  # pragma: no cover
        return '%s en %s' % (instance.cuenta_contable.descripcion, instance.asiento_contable.concepto)

    class Meta:
        model = ApunteContable
        fields = [
            'url',
            'id',
            'to_string',
            'asiento_contable',
            'cuenta_contable',
            'cuenta_nombre',
            'debito',
            'credito',
        ]


class AsientoContableConDetalleSerializer(AsientoContableSerializer):
    apuntes_contables = ApunteContableSerializer(many=True, read_only=True)
