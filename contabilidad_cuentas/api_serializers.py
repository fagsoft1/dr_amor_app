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

    def create(self, validated_data):
        descripcion = validated_data.get('descripcion')
        codigo = validated_data.get('codigo')
        naturaleza = validated_data.get('naturaleza')
        cuenta_padre = validated_data.get('cuenta_padre', None)
        from .services import cuenta_contable_crear_actualizar
        return cuenta_contable_crear_actualizar(
            descripcion=descripcion,
            codigo=codigo,
            cuenta_padre_id=cuenta_padre.id if cuenta_padre else None,
            naturaleza=naturaleza
        )

    def update(self, instance, validated_data):
        descripcion = validated_data.get('descripcion')
        codigo = validated_data.get('codigo')
        naturaleza = validated_data.get('naturaleza')
        cuenta_padre = validated_data.get('cuenta_padre', None)
        tipo = validated_data.get('tipo')
        from .services import cuenta_contable_crear_actualizar
        return cuenta_contable_crear_actualizar(
            descripcion=descripcion,
            codigo=codigo,
            cuenta_padre_id=cuenta_padre.id if cuenta_padre else None,
            naturaleza=naturaleza,
            cuenta_contable_id=instance.id,
            tipo=tipo
        )

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
        extra_kwargs = {
            'cuenta_nivel': {'read_only': True},
            'cuenta_nivel_1': {'read_only': True},
            'cuenta_nivel_2': {'read_only': True},
            'cuenta_nivel_3': {'read_only': True},
            'cuenta_nivel_4': {'read_only': True},
            'cuenta_nivel_5': {'read_only': True},
            'cuenta_nivel_6': {'read_only': True},
            'cuenta_nivel_7': {'read_only': True},
            'cuenta_nivel_8': {'read_only': True},
        }
