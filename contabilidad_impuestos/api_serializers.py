from rest_framework import serializers

from .models import (
    Impuesto,
    ImpuestoGrupo
)


class ImpuestoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = Impuesto
        fields = [
            'url',
            'id',
            'to_string',
            'nombre',
            'ambito',
            'tipo_calculo_impuesto',
            'cuenta_impuesto',
            'cuenta_impuesto_notas_credito',
            'importe',
        ]


class ImpuestoGrupoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = ImpuestoGrupo
        fields = [
            'url',
            'id',
            'to_string',
            'nombre',
        ]
