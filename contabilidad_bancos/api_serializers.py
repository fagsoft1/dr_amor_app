from rest_framework import serializers

from .models import (
    Banco,
    CuentaBancariaBanco
)


class BancoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = Banco
        fields = [
            'url',
            'id',
            'to_string',
            'nombre',
        ]


class CuentaBancariaBancoSerializer(serializers.ModelSerializer):
    banco_nombre = serializers.CharField(source='banco.')
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = CuentaBancariaBanco
        fields = [
            'url',
            'id',
            'to_string',
            'nombre',
            'banco',
            'banco_nombre',
            'nro_cuenta',
            'titular_cuenta',
        ]
