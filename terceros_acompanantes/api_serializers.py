from rest_framework import serializers

from .models import CategoriaAcompanante


class CategoriaAcompananteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaAcompanante
        fields = [
            'id',
            'nombre',
            'orden',
        ]
