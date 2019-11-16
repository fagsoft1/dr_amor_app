import base64
from django.conf import settings
import random
import crypt

from django.contrib.auth.models import User, Group
from knox.models import AuthToken
from rest_framework import serializers, status

from .models import Tercero
from accesos.models import RegistroIngreso
from django.utils import timezone
from Crypto.Cipher import AES


def acompanante_encriptar(texto_plano: str) -> str:
    if not texto_plano:  # pragma: no cover
        return ''
    key = settings.KEY_ENCRY
    vector = settings.VECTOR_ENCRY
    if len(key) not in [16, 24, 32]:  # pragma: no cover
        raise serializers.ValidationError('La contraseña debe ser de 16,24 o 32 caracteres')
    if len(vector) != 16:  # pragma: no cover
        raise serializers.ValidationError('El vector debe tener 16 caracteres')
    obj = AES.new(key, AES.MODE_CFB, vector)
    ciphertext = base64.b64encode(obj.encrypt(texto_plano)).decode("utf-8")
    return ciphertext.strip()


def acompanante_desencriptar(enc: str) -> str:
    if not enc:  # pragma: no cover
        return ''
    key = settings.KEY_ENCRY
    vector = settings.VECTOR_ENCRY
    if len(key) not in [16, 24, 32]:  # pragma: no cover
        raise serializers.ValidationError('La contraseña debe ser de 16,24 o 32 caracteres')
    if len(vector) != 16:  # pragma: no cover
        raise serializers.ValidationError('El vector debe tener 16 caracteres')
    obj2 = AES.new(key, AES.MODE_CFB, vector)
    decrypted_text = obj2.decrypt(base64.b64decode(enc)).decode("utf-8")
    return decrypted_text


def acompanante_update(
        tercero_id,
        validated_data
) -> Tercero:
    acompanante = Tercero.objects.get(pk=tercero_id)
    nro_identificacion = validated_data.get('nro_identificacion', None)
    validaciones = {}
    if Tercero.objects.filter(nro_identificacion=acompanante_encriptar(nro_identificacion)).exclude(
            pk=tercero_id).exists():
        validaciones[
            'nro_identificacion'] = 'No se puede crear acompañante porque ya existe un numero de identidad %s.' % nro_identificacion

    for attr, value in validated_data.items():
        if hasattr(acompanante, attr):
            if attr in ['nombre', 'nombre_segundo', 'apellido', 'apellido_segundo', 'nro_identificacion']:
                setattr(acompanante, attr, acompanante_encriptar(value))
            else:
                setattr(acompanante, attr, value)

    fecha_nacimiento = validated_data.get('fecha_nacimiento', None)
    alias_modelo = validated_data.get('alias_modelo')

    today = timezone.now().date()
    edad = today.year - fecha_nacimiento.year - (
            (today.month, today.day) < (fecha_nacimiento.month, fecha_nacimiento.day))
    if edad < 18:
        validaciones['edad'] = 'Debe ser mayor de edad para ser acompañante. La edad registrada es de %s.' % edad

    qs = Tercero.objects.filter(alias_modelo=alias_modelo).exclude(pk=tercero_id)

    if qs.exists():
        validaciones['alias_modelo'] = 'Es alias %s ya existe, escoger otro.' % alias_modelo

    if validaciones:
        raise serializers.ValidationError(validaciones)
    acompanante.save()
    acompanante.usuario.first_name = acompanante.categoria_modelo.nombre
    acompanante.usuario.last_name = acompanante.alias_modelo
    acompanante.usuario.save()
    return acompanante


def acompanante_crear(validated_data) -> Tercero:
    nombre = validated_data.get('nombre', None)
    nombre_segundo = validated_data.get('nombre_segundo', None)
    apellido = validated_data.get('apellido', None)
    apellido_segundo = validated_data.get('apellido_segundo', None)
    nro_identificacion = validated_data.get('nro_identificacion', None)
    fecha_nacimiento = validated_data.get('fecha_nacimiento', None)
    alias_modelo = validated_data.get('alias_modelo', None)

    validaciones = {}

    if Tercero.objects.filter(nro_identificacion=acompanante_encriptar(nro_identificacion)).exists():
        validaciones[
            'nro_identificacion'] = 'No se puede crear acompañante porque ya existe un numero de identidad %s.' % nro_identificacion

    new_validated_data = {}
    for attr, value in validated_data.items():
        if attr in ['nombre', 'nombre_segundo', 'apellido', 'apellido_segundo', 'nro_identificacion']:
            new_validated_data[attr] = acompanante_encriptar(value)
        else:
            new_validated_data[attr] = value

    qs = Tercero.objects.filter(alias_modelo=alias_modelo)
    if qs.exists():
        validaciones['alias_modelo'] = 'El alias %s ya existe, escoger otro.' % alias_modelo
    today = timezone.now().date()
    edad = today.year - fecha_nacimiento.year - (
            (today.month, today.day) < (fecha_nacimiento.month, fecha_nacimiento.day))
    if edad < 18:
        validaciones['edad'] = 'Debe ser mayor de edad para ser acompañante, La edad registrada es de %s.' % edad

    first_name = '%s %s'.strip() % (nombre, nombre_segundo)
    last_name = '%s %s'.strip() % (apellido, apellido_segundo)

    if apellido_segundo is not None:
        username = ('ac-%s%s%s' % (nombre[0:3], apellido[0:3], apellido_segundo[0:3])).lower()
    else:
        username = ('ac-%s%s' % (nombre[0:3], apellido[0:3])).lower()

    if User.objects.filter(username=username).exists():
        username = '%s%s' % (username, User.objects.filter(username__contains=username).count())

    if validaciones:
        raise serializers.ValidationError(validaciones)

    user = User.objects.create_user(
        username=username.lower(),
        first_name=first_name,
        last_name=last_name,
        password=nro_identificacion,
        is_active=True
    )
    acompanante = Tercero.objects.create(
        usuario=user,
        **new_validated_data
    )
    acompanante.es_acompanante = True
    acompanante.es_colaborador = False
    acompanante.es_proveedor = False
    acompanante.save()
    user.first_name = acompanante.categoria_modelo.nombre
    user.last_name = acompanante.alias_modelo
    user.save()
    tercero_set_new_pin(acompanante.id, '0000')
    new_group, created = Group.objects.get_or_create(name='ACOMPAÑANTES')
    user.groups.add(new_group)
    return acompanante


def colaborador_update(
        tercero_id,
        validated_data
) -> Tercero:
    colaborador = Tercero.objects.get(pk=tercero_id)
    for attr, value in validated_data.items():
        if hasattr(colaborador, attr):
            setattr(colaborador, attr, value)

    nombre = validated_data.get('nombre', None)
    nombre_segundo = validated_data.get('nombre_segundo', None)
    apellido = validated_data.get('apellido', None)
    apellido_segundo = validated_data.get('apellido_segundo', None)
    nro_identificacion = validated_data.get('nro_identificacion', None)

    validaciones = {}

    if Tercero.objects.filter(nro_identificacion=nro_identificacion).exclude(
            pk=tercero_id).exists():
        validaciones[
            'nro_identificacion'] = 'No se puede actualizar colaborador porque ya existe un numero de identidad %s.' % nro_identificacion
    if validaciones:
        raise serializers.ValidationError(validaciones)

    first_name = '%s %s'.strip() % (nombre, nombre_segundo)
    last_name = '%s %s'.strip() % (apellido, apellido_segundo)
    colaborador.usuario.first_name = first_name
    colaborador.usuario.last_name = last_name
    colaborador.usuario.save()
    colaborador.save()
    return colaborador


def colaborador_crear(
        validated_data
) -> Tercero:
    nombre = validated_data.get('nombre', None)
    nombre_segundo = validated_data.get('nombre_segundo', None)
    apellido = validated_data.get('apellido', None)
    apellido_segundo = validated_data.get('apellido_segundo', None)
    nro_identificacion = validated_data.get('nro_identificacion', None)

    validaciones = {}

    if Tercero.objects.filter(nro_identificacion=nro_identificacion).exists():
        validaciones[
            'nro_identificacion'] = 'No se puede crear colaborador porque ya existe un numero de identidad %s.' % nro_identificacion

    first_name = '%s %s'.strip() % (nombre, nombre_segundo)
    last_name = '%s %s'.strip() % (apellido, apellido_segundo)

    if apellido_segundo is not None:
        username = ('co-%s%s%s' % (nombre[0:3], apellido[0:3], apellido_segundo[0:3])).lower()
    else:
        username = ('co-%s%s' % (nombre[0:3], apellido[0:3])).lower()

    if User.objects.filter(username=username).exists():
        username = '%s%s' % (username, User.objects.filter(username__contains=username).count())

    if validaciones:
        raise serializers.ValidationError(validaciones)

    user = User.objects.create_user(
        username=username.lower(),
        first_name=first_name,
        last_name=last_name,
        password=nro_identificacion,
        is_active=True
    )

    colaborador = Tercero.objects.create(
        usuario=user,
        **validated_data
    )
    colaborador.es_acompanante = False
    colaborador.es_colaborador = True
    colaborador.es_proveedor = False
    colaborador.save()
    tercero_set_new_pin(colaborador.id, '0000')
    new_group, created = Group.objects.get_or_create(name='COLABORADORES')
    user.groups.add(new_group)
    return colaborador


def tercero_existe_documento(nro_identificacion: str) -> bool:
    return Tercero.objects.filter(nro_identificacion=nro_identificacion).exists()


def tercero_existe_alias(alias: str) -> bool:
    return Tercero.objects.filter(alias_modelo=alias).exists()


def tercero_is_pin_correct(tercero_id: int, raw_pin: str) -> bool:
    tercero = Tercero.objects.get(pk=tercero_id)
    return crypt.crypt(raw_pin, tercero.pin) == tercero.pin


def tercero_set_new_pin(tercero_id: int, raw_pin: str) -> [Tercero, str]:
    tercero = Tercero.objects.get(pk=tercero_id)
    tercero.pin = crypt.crypt(raw_pin)
    tercero.save()
    return tercero, tercero.pin


# TODO: Revisar si el ValidationError del pin puede ser el campo pin del formulario
def tercero_registra_entrada(tercero_id: int, raw_pin: str) -> [Tercero, RegistroIngreso]:
    now = timezone.localtime(timezone.now())
    tercero = Tercero.objects.get(pk=tercero_id)
    if not tercero_is_pin_correct(tercero.id, raw_pin):
        raise serializers.ValidationError({'_error': 'Es un pin errado, no se puede registrar la entrada'})

    qs = tercero.usuario.regitros_ingresos.filter(
        created__date=now.date(),
        fecha_fin__isnull=False
    )

    if tercero.presente and not qs.exists():
        raise serializers.ValidationError(
            {'_error': 'El usuario se encuentra actualmente presente, no nesesita registrar su entrada de nuevo'})
    tercero.presente = True
    tercero.estado = 0
    qs = tercero.usuario.regitros_ingresos.filter(
        created__date=now.date(),
        fecha_fin__isnull=True
    )
    if not qs.exists():
        registro_acceso = tercero.usuario.regitros_ingresos.create()
    else:
        registro_acceso = qs.first()
    tercero.save()
    tercero_generarQR(tercero_id)
    return tercero, registro_acceso


# TODO: Revisar si el ValidationError del pin puede ser el campo pin del formulario
def tercero_registra_salida(tercero_id: int, raw_pin: str) -> [Tercero, RegistroIngreso]:
    now = timezone.localtime(timezone.now())
    tercero = Tercero.objects.get(pk=tercero_id)
    if not tercero_is_pin_correct(tercero.id, raw_pin):
        raise serializers.ValidationError({'_error': 'Es un pin errado, no se pueda registrar la salida'})
    servicios_abiertos = tercero.usuario.cuentas.filter(servicios__estado=1)
    if servicios_abiertos.exists():
        raise serializers.ValidationError(
            {'_error': 'No se puede registrar salida para este usuario, aún tiene servicios en proceso'}
        )

    tercero = tercero_cambiar_estado(tercero.id, 0)

    if not tercero.estado == 0:  # pragma: no cover
        raise serializers.ValidationError(
            {'_error': 'No se puede registrar salida para este usuario, seguramente aún tiene servicios abiertos'}
        )
    AuthToken.objects.filter(user=tercero.usuario).delete()
    tercero.presente = False
    tercero.qr_acceso = None
    tercero.save()
    ultimo_registro_acceso = tercero.usuario.regitros_ingresos.filter(
        created__date=now.date(),
        fecha_fin__isnull=True
    ).first()
    if ultimo_registro_acceso:
        ultimo_registro_acceso.fecha_fin = now
    else:
        ultimo_registro_acceso = tercero.usuario.regitros_ingresos.create(fecha_fin=now)
    return tercero, ultimo_registro_acceso


def tercero_cambiar_estado(
        tercero_id: int,
        nuevo_estado: int
) -> Tercero:
    tercero = Tercero.objects.get(pk=tercero_id)
    if tercero.estado != nuevo_estado:
        if nuevo_estado == 0:
            servicios = tercero.cuenta_abierta.servicios.filter(estado=1)
            if not servicios.exists():
                tercero.estado = 0
        if nuevo_estado == 1:
            if tercero.presente:
                tercero.estado = 1
        tercero.save()
    return tercero


def tercero_generarQR(tercero_id: int) -> Tercero:
    tercero = Tercero.objects.get(pk=tercero_id)
    now = timezone.now()
    nro_aleatorio = random.randint(1000, 9999)
    import secrets
    secure_random = secrets.SystemRandom()
    caracteres = ["a", "e", "i", "o", "u", "%", "&", "/", ")", "(", "=", "?", "¿", "{", "}", "*", "+", "¡", "!"]
    random_uno = random.randint(10, 99).__str__().join(secure_random.sample(caracteres, 3))
    random_dos = random.choice(caracteres).join(secure_random.sample(caracteres, 3))
    random_tres = random.randint(100, 999).__str__().join(secure_random.sample(caracteres, 3))

    qr_acceso = '%s%s%s%s%s%s(%s)%s$%s%s%s' % (
        tercero.id,
        random_uno,
        nro_aleatorio,
        random_dos,
        now.month,
        nro_aleatorio,
        tercero.usuario_id,
        now.year,
        random_tres,
        now.day,
        tercero.id,
    )
    tercero.qr_acceso = qr_acceso
    tercero.save()
    return tercero


def tercero_cambiar_pin(
        tercero_id: int,
        password: str,
        pin: str
) -> Tercero:
    tercero = Tercero.objects.get(pk=tercero_id)
    if not tercero.usuario.check_password(password):
        raise serializers.ValidationError(
            {'_error': 'La contraseña suministrada no coincide con el usuario, es necesario para cambiar el PIN'})
    tercero_set_new_pin(tercero.id, pin)
    return tercero
