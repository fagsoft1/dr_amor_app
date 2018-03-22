from django.contrib.auth.models import User, Group
from rest_framework import serializers

from .models import Tercero


class AcompananteSerializer(serializers.ModelSerializer):
    categoria_modelo_nombre = serializers.CharField(source='categoria_modelo.nombre', read_only=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    fecha_nacimiento = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])

    class Meta:
        model = Tercero
        fields = [
            'id',
            'full_name',
            'full_name_proxy',
            'nombre',
            'nombre_segundo',
            'apellido',
            'apellido_segundo',
            'identificacion',
            'genero',
            'tipo_documento',
            'nro_identificacion',
            'fecha_nacimiento',
            'grupo_sanguineo',
            'alias_modelo',
            'categoria_modelo',
            'categoria_modelo_nombre',
            'usuario',
            'usuario_username'
        ]
        extra_kwargs = {
            'full_name': {'read_only': True},
            'usuario': {'read_only': True},
            'identificacion': {'read_only': True},
        }

    def create(self, validated_data):
        nombre = validated_data.get('nombre', None)
        nombre_segundo = validated_data.get('nombre_segundo', None)
        apellido = validated_data.get('apellido', None)
        apellido_segundo = validated_data.get('apellido_segundo', None)
        password = validated_data.get('nro_identificacion', None)
        first_name = '%s %s'.strip() % (nombre, nombre_segundo)
        last_name = '%s %s'.strip() % (apellido, apellido_segundo)
        if apellido_segundo:
            username = ('ac-%s%s%s' % (nombre[0:3], apellido[0:3], apellido_segundo[0:3])).lower()
        else:
            username = ('ac-%s%s' % (nombre[0:3], apellido[0:3])).lower()

        if User.objects.filter(username=username).exists():
            username = '%s%s' % (username, User.objects.filter(username__contains=username).count())
        user = User.objects.create_user(
            username=username.lower(),
            first_name=first_name,
            last_name=last_name,
            password=password,
            is_active=True
        )
        new_group, created = Group.objects.get_or_create(name='ACOMPAÑANTES')
        user.groups.add(new_group)
        validated_data.update(usuario=user, es_acompanante=True)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        nombre = validated_data.get('nombre', None)
        nombre_segundo = validated_data.get('nombre_segundo', None)
        apellido = validated_data.get('apellido', None)
        apellido_segundo = validated_data.get('apellido_segundo', None)

        if nombre and apellido:
            first_name = '%s %s'.strip() % (nombre, nombre_segundo)
            last_name = '%s %s'.strip() % (apellido, apellido_segundo)
            instance.usuario.first_name = first_name
            instance.usuario.last_name = last_name
        instance.usuario.save()

        return super().update(instance, validated_data)


class ColaboradorSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    fecha_nacimiento = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])

    class Meta:
        model = Tercero
        fields = [
            'id',
            'full_name',
            'nombre',
            'nombre_segundo',
            'apellido',
            'apellido_segundo',
            'genero',
            'tipo_documento',
            'nro_identificacion',
            'identificacion',
            'fecha_nacimiento',
            'grupo_sanguineo',
            'usuario',
            'usuario_username'
        ]
        extra_kwargs = {
            'full_name': {'read_only': True},
            'usuario': {'read_only': True},
            'identificacion': {'read_only': True},
        }

    def create(self, validated_data):
        nombre = validated_data.get('nombre', None)
        nombre_segundo = validated_data.get('nombre_segundo', None)
        apellido = validated_data.get('apellido', None)
        apellido_segundo = validated_data.get('apellido_segundo', None)
        password = validated_data.get('nro_identificacion', None)
        first_name = '%s %s'.strip() % (nombre, nombre_segundo)
        last_name = '%s %s'.strip() % (apellido, apellido_segundo)
        if apellido_segundo:
            username = ('co-%s%s%s' % (nombre[0:3], apellido[0:3], apellido_segundo[0:3])).lower()
        else:
            username = ('co-%s%s' % (nombre[0:3], apellido[0:3])).lower()

        if User.objects.filter(username=username).exists():
            username = '%s%s' % (username, User.objects.filter(username__contains=username).count())
        user = User.objects.create_user(
            username=username.lower(),
            first_name=first_name,
            last_name=last_name,
            password=password,
            is_active=True
        )
        new_group, created = Group.objects.get_or_create(name='COLABORADORES')
        user.groups.add(new_group)
        validated_data.update(usuario=user, es_colaborador=True)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        nombre = validated_data.get('nombre', None)
        nombre_segundo = validated_data.get('nombre_segundo', None)
        apellido = validated_data.get('apellido', None)
        apellido_segundo = validated_data.get('apellido_segundo', None)

        if nombre and apellido:
            first_name = '%s %s'.strip() % (nombre, nombre_segundo)
            last_name = '%s %s'.strip() % (apellido, apellido_segundo)
            instance.usuario.first_name = first_name
            instance.usuario.last_name = last_name
        instance.usuario.save()

        return super().update(instance, validated_data)


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tercero
        fields = [
            'id',
            'nombre',
            'tipo_documento',
            'es_proveedor',
            'nro_identificacion',
            'identificacion',
        ]
        extra_kwargs = {
            'identificacion': {'read_only': True},
        }
