from django.contrib.auth.models import User, Permission, Group
from knox.models import AuthToken
from rest_framework import serializers


def usuario_obtener_token(
        usuario_id: int
) -> str:
    user = User.objects.get(pk=usuario_id)
    tokens = AuthToken.objects.filter(user=user)
    tokens.delete()
    token = AuthToken.objects.create(user)
    return token


def usuario_existe_username(
        username: str
) -> bool:
    if username and User.objects.filter(username=username).exists():
        return True
    return False


def usuario_login(
        usuario_id: int,
        punto_venta_id: int = None
) -> str:
    from puntos_venta.services import punto_venta_abrir
    token = usuario_obtener_token(usuario_id=usuario_id)
    if punto_venta_id is not None:
        punto_venta_abrir(
            punto_venta_id=punto_venta_id,
            usuario_pv_id=usuario_id
        )

    return token


def user_cambiar_contrasena(
        usuario_id: int,
        password_old: str,
        password_nuevo: str,
        password_nuevo_confirmacion: str
) -> User:
    user = User.objects.get(pk=usuario_id)
    if not user.check_password(password_old):
        raise serializers.ValidationError({'_error': 'La contraseña suministrada no coincide con el usuario'})
    if not password_nuevo == password_nuevo_confirmacion:
        raise serializers.ValidationError({'_error': 'La contraseña nueva con su confirmación no coincide'})
    user.set_password(password_nuevo)
    user.save()
    return user


def adicionar_permiso(
        permiso_id: int,
        user_id: int
) -> User:
    usuario = User.objects.get(pk=user_id)
    permiso = Permission.objects.get(id=permiso_id)
    tiene_permiso = usuario.user_permissions.filter(id=permiso_id).exists()
    if not tiene_permiso:
        usuario.user_permissions.add(permiso)
    else:
        usuario.user_permissions.remove(permiso)
    return usuario


def adicionar_grupo(
        grupo_id: int,
        user_id: int
) -> User:
    usuario = User.objects.get(pk=user_id)
    grupo = Group.objects.get(id=grupo_id)

    tiene_grupo = usuario.groups.filter(id=grupo_id).exists()
    if not tiene_grupo:
        usuario.groups.add(grupo)
    else:
        usuario.groups.remove(grupo)
    return usuario
