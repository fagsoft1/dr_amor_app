from rest_framework import serializers

from .models import (
    DiarioContable
)


class DiarioContableSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    tipo_nombre = serializers.SerializerMethodField()
    cuenta_debito_defecto_nombre = serializers.CharField(source='cuenta_debito_defecto.descripcion', read_only=True)
    cuenta_credito_defecto_nombre = serializers.CharField(source='cuenta_credito_defecto.descripcion', read_only=True)
    banco_nombre = serializers.CharField(source='banco.nombre', read_only=True)
    cuenta_bancaria_nombre = serializers.CharField(source='cuenta_bancaria.nombre', read_only=True)

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    def get_tipo_nombre(self, instance):  # pragma: no cover
        return instance.get_tipo_display()

    class Meta:
        model = DiarioContable
        fields = [
            'url',
            'id',
            'to_string',
            'nombre',
            'codigo',
            'tipo',
            'tipo_nombre',
            'cuenta_debito_defecto',
            'cuenta_debito_defecto_nombre',
            'cuenta_credito_defecto',
            'cuenta_credito_defecto_nombre',
            'banco',
            'banco_nombre',
            'cuenta_bancaria',
            'cuenta_bancaria_nombre',
        ]
