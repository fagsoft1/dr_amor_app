from rest_framework import serializers

from dr_amor_app.general_mixins.custom_serializer_mixins import CustomSerializerMixin
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
            'nit',
            'nombre',
            'cuentas_bancarias',
        ]
        read_only_fields = ['cuentas_bancarias', ]


class CuentaBancariaBancoSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    banco_nombre = serializers.CharField(source='banco.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return '%s - %s (%s)' % (instance.banco.nombre, instance.nro_cuenta, instance.titular_cuenta)

    class Meta:
        model = CuentaBancariaBanco
        fields = [
            'url',
            'id',
            'to_string',
            'banco',
            'banco_nombre',
            'nro_cuenta',
            'titular_cuenta',
        ]


class BancoDetalleSerializer(BancoSerializer):
    cuentas_bancarias = CuentaBancariaBancoSerializer(
        many=True,
        read_only=True,
        context={
            'quitar_campos': [
                'banco_nombre'
            ]
        }
    )
