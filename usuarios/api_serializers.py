from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'is_active',
            'is_staff',
            'password',
            'username',
            'last_login',
            'date_joined',
            'is_superuser',
            'tercero',
            'groups'
        ]

    def create(self, validated_data):
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
                    {'error': 'Debes de hacer el ingreso de acceso primero!'})
            else:
                return user
        raise serializers.ValidationError({'error': 'El usuario y la contraseña no coinciden con ningún usuario!'})


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')
