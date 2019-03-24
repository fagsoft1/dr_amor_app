from django.contrib.auth.models import Permission, Group
from django.test import TestCase
from rest_framework.exceptions import ValidationError

from ..factories import UserFactory
from puntos_venta.factories import PuntoVentaFactory
from ..services import (
    user_cambiar_contrasena
)
from knox.models import AuthToken

from faker import Faker

faker = Faker()


class UserServicesTests(TestCase):
    def setUp(self):
        from terceros.factories import AcompananteFactory, ColaboradorFactory
        self.user_sin_tercero = UserFactory()
        self.user = UserFactory()

        self.user_acompanante = UserFactory()
        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)
        self.punto_venta_dos = PuntoVentaFactory(abierto=False, usuario_actual=None)
        self.acompanante = AcompananteFactory(usuario=self.user_acompanante)

        self.colaborador = ColaboradorFactory(usuario=UserFactory())
        self.colaborador_dos = ColaboradorFactory(usuario=UserFactory())

    def test_existe_username(self):
        from ..services import usuario_existe_username
        self.assertTrue(usuario_existe_username(self.colaborador.usuario.username))
        self.assertFalse(usuario_existe_username('otra_no_esta'))

    def test_adiccionar_permiso(self):
        from ..services import adicionar_permiso
        count_uno = self.user_acompanante.user_permissions.all().count()
        permiso = Permission.objects.first()
        usuario = adicionar_permiso(
            permiso_id=permiso.id,
            user_id=self.user_acompanante.id
        )
        self.user_acompanante.refresh_from_db()
        count_dos = self.user_acompanante.user_permissions.all().count()
        self.assertEqual(self.user_acompanante.id, usuario.id)
        self.assertEqual(count_uno + 1, count_dos)

        usuario = adicionar_permiso(
            permiso_id=permiso.id,
            user_id=self.user_acompanante.id
        )
        self.user_acompanante.refresh_from_db()
        count_tres = self.user_acompanante.user_permissions.all().count()
        self.assertEqual(self.user_acompanante.id, usuario.id)
        self.assertEqual(count_uno, count_tres)

    def test_adiccionar_grupo(self):
        from ..services import adicionar_grupo
        count_uno = self.user_acompanante.groups.all().count()
        new_group, created = Group.objects.get_or_create(name='new_group')
        usuario = adicionar_grupo(
            grupo_id=new_group.id,
            user_id=self.user_acompanante.id
        )
        self.user_acompanante.refresh_from_db()
        count_dos = self.user_acompanante.groups.all().count()
        self.assertEqual(self.user_acompanante.id, usuario.id)
        self.assertEqual(count_uno + 1, count_dos)

        usuario = adicionar_grupo(
            grupo_id=new_group.id,
            user_id=self.user_acompanante.id
        )
        self.user_acompanante.refresh_from_db()
        count_tres = self.user_acompanante.groups.all().count()
        self.assertEqual(self.user_acompanante.id, usuario.id)
        self.assertEqual(count_uno, count_tres)

    def test_usuario_obtener_token(self):
        from ..services import usuario_obtener_token
        from knox.models import AuthToken
        count = AuthToken.objects.filter(user=self.colaborador.usuario).count()
        token_anterior = AuthToken.objects.create(self.colaborador.usuario)
        count_dos = AuthToken.objects.filter(user=self.colaborador.usuario).count()
        self.assertNotEqual(count, count_dos)
        token_actual = usuario_obtener_token(self.colaborador.usuario.id)
        count_tres = AuthToken.objects.filter(user=self.colaborador.usuario).count()
        self.assertEqual(count_tres, count_dos)
        self.assertNotEqual(token_anterior, token_actual)

    def test_user_login_token(self):
        from ..services import usuario_login
        token = usuario_login(usuario_id=self.user.id, punto_venta_id=None)
        token2 = AuthToken.objects.get(user=self.user)
        token_key = token2.token_key
        tamano_token_key = len(token_key)
        self.assertEqual(token[0:tamano_token_key], token_key)

    def test_user_login_colaborador(self):
        from ..services import usuario_login
        from terceros.services import tercero_registra_entrada, tercero_set_new_pin
        from puntos_venta.models import PuntoVentaTurno
        self.assertFalse(self.punto_venta.abierto)
        self.assertIsNone(self.punto_venta.usuario_actual)
        count = PuntoVentaTurno.objects.filter(usuario=self.colaborador.usuario).count()
        tercero_set_new_pin(self.colaborador.id, '0000')
        tercero_registra_entrada(
            tercero_id=self.colaborador.id,
            raw_pin='0000'
        )
        usuario_login(usuario_id=self.colaborador.usuario.id, punto_venta_id=self.punto_venta.id)
        self.punto_venta.refresh_from_db()
        self.assertTrue(self.punto_venta.abierto)
        self.assertEqual(self.punto_venta.usuario_actual, self.colaborador.usuario)
        count_dos = PuntoVentaTurno.objects.filter(usuario=self.colaborador.usuario).count()
        self.assertEqual(count + 1, count_dos)

    def test_user_login_colaborador_no_presente(self):
        from ..services import usuario_login
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No se puede abrir un punto de venta a un colaborador que no este presente'}"
        ):
            usuario_login(usuario_id=self.colaborador.usuario.id, punto_venta_id=self.punto_venta.id)

    def test_user_login_usuario(self):
        from ..services import usuario_login
        from puntos_venta.models import PuntoVentaTurno
        count = PuntoVentaTurno.objects.filter(usuario=self.user).count()
        usuario_login(usuario_id=self.user.id, punto_venta_id=None)
        count_dos = PuntoVentaTurno.objects.filter(usuario=self.user).count()
        self.assertEqual(count, count_dos)

    def test_user_cambiar_contrasena(self):
        password_old = 'lac0ntr4sena'
        password_nuevo = 'lac0ntr4sena'
        self.user.set_password(password_old)
        self.user.save()
        usuario2 = user_cambiar_contrasena(self.user.id, password_old, password_nuevo, password_nuevo)
        self.assertNotEqual(self.user.password, usuario2.password)

    def test_user_cambiar_contrasena_contrasena_vieja_errada(self):
        password_nuevo = 'lac0ntr4sena'
        with self.assertRaisesMessage(
                ValidationError,
                'La contraseña suministrada no coincide con el usuario'
        ):
            user_cambiar_contrasena(self.user.id, 'otra_que_no_es', password_nuevo, password_nuevo)

    def test_user_cambiar_contrasena_confirmacion_errada(self):
        password_old = 'lac0ntr4sena'
        self.user.set_password(password_old)
        self.user.save()
        with self.assertRaisesMessage(
                ValidationError,
                'La contraseña nueva con su confirmación no coincide'
        ):
            user_cambiar_contrasena(self.user.id, password_old, 'una', 'dos')
