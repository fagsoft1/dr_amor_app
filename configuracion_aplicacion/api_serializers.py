from rest_framework import serializers
from .models import DatoGeneral


class DatoGeneralSerializer(serializers.ModelSerializer):
    icon_small = serializers.ImageField(read_only=True)
    icon_medium = serializers.ImageField(read_only=True)
    logo_small = serializers.ImageField(read_only=True)
    logo_medium = serializers.ImageField(read_only=True)

    def update(self, instance, validated_data):
        logo = validated_data.get('logo', None)
        from .services import dato_general_crear_actualizar
        configuracion = dato_general_crear_actualizar(logo=logo)
        return configuracion

    class Meta:
        model = DatoGeneral
        fields = [
            'url',
            'id',
            'logo',
            'icon_small',
            'icon_medium',
            'logo_small',
            'logo_medium',
        ]
