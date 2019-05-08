from rest_framework import serializers

from .models import (
    CuentaContable
)


class CuentaContableSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    cuenta_padre_nombre = serializers.CharField(source='cuenta_padre.descripcion', read_only=True)
    cuenta_padre_codigo = serializers.CharField(source='cuenta_padre.codigo', read_only=True)

    def get_to_string(self, instance):  # pragma: no cover
        return '%s - %s' % (instance.codigo, instance.descripcion)

    class Meta:
        model = CuentaContable
        fields = [
            'url',
            'id',
            'descripcion',
            'to_string',
            'codigo',
            'cuenta_padre',
            'cuenta_padre_nombre',
            'cuenta_padre_codigo',
            'naturaleza',
            'cuenta_nivel',
            'cuenta_nivel_1',
            'cuenta_nivel_2',
            'cuenta_nivel_3',
            'cuenta_nivel_4',
            'cuenta_nivel_5',
            'cuenta_nivel_6',
            'cuenta_nivel_7',
            'cuenta_nivel_8',
            'tipo'
        ]
