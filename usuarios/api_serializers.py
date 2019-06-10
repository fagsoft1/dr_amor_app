from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from puntos_venta.api_serializers import PuntoVentaSerializer


class UsuarioSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    imagen_perfil_url = serializers.SerializerMethodField()
    punto_venta_actual = PuntoVentaSerializer(read_only=True)
    qr_acceso = serializers.CharField(source='tercero.qr_acceso', read_only=True)

    def get_imagen_perfil_url(self, obj):  # pragma: no cover
        if hasattr(obj, 'tercero'):
            if obj.tercero.imagen_perfil:
                return obj.tercero.imagen_perfil.url
        return None

    def get_to_string(self, instance):  # pragma: no cover
        return ('%s %s' % (instance.first_name, instance.last_name)).title()

    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'punto_venta_actual',
            'last_name',
            'email',
            'is_active',
            'is_staff',
            'password',
            'username',
            'last_login',
            'date_joined',
            'is_superuser',
            'imagen_perfil_url',
            'tercero',
            'to_string',
            'qr_acceso',
            'groups'
        ]
        extra_kwargs = {
            'tercero': {'read_only': True},
            'punto_venta_actual': {'read_only': True},
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        validated_data.pop('groups', None)
        user = User.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            if hasattr(user, 'tercero'):
                if user.tercero.presente:
                    return user
                raise serializers.ValidationError(
                    {'_error': 'Debes de hacer el ingreso de acceso primero!'})
            else:
                return user
        raise serializers.ValidationError({'_error': 'El usuario y la contraseña no coinciden con ningún usuario!'})
