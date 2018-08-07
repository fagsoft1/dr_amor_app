from rest_framework import serializers

from .models import Empresa


class EmpresaSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = Empresa
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
            'nit',
        ]
