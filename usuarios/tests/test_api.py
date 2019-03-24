from django.contrib.auth.models import User, Permission, Group

from dr_amor_app.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class UsuariosTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import UserFactory
        super().setUp()
        self.Factory = UserFactory
        self.url = '/api/usuarios/'
        self.permiso = 'user'
        self.modelo = User
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_update_test = {'first_name': 'probando'}

    def test_ingreso_no_autorizado(self):
        self.ingreso_no_autorizado()

    def test_crear(self):
        self.crear()

    def test_update(self):
        self.update()

    def test_delete(self):
        self.delete()

    def test_mi_cuenta(self):
        response = self.list_route_get('mi_cuenta/')
        mi_cuenta = response.data
        self.assertEqual(mi_cuenta.get('id'), self.superuser.id)
        self.assertEqual(response.status_code, 200)

    def test_adicionar_permiso(self):
        permiso = Permission.objects.first()
        self.assertTrue(self.user.user_permissions.all().count() == 0)
        response = self.detail_route_post('adicionar_permiso', {'id_permiso': permiso.id}, self.user.id)
        usuario = response.data
        usuario = User.objects.get(pk=usuario.get('id'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(usuario.user_permissions.all().count() == 1)

    def test_detail_cambiar_contrasena(self):
        self.assertTrue(self.user.user_permissions.all().count() == 0)
        response = self.detail_route_post(
            'cambiar_contrasena',
            {'password': 'cosita', 'password_2': 'cosita', 'password_old': 'otro'},
            self.user.id
        )
        self.assertEqual({'result': 'La contraseña se ha cambiado correctamente'}, response.data)

    def test_validar_nuevo_usuario(self):
        self.list_route_get('validar_nuevo_usuario/?username=otro_que_no_esta')

    def test_validar_nuevo_usuario_existente(self):
        response = self.list_route_get(
            'validar_nuevo_usuario/?username=otro',
            True
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'username': 'Ya exite'})

    def test_validar_username_login_no_existente(self):
        response = self.list_route_get(
            'validar_username_login/?username=otro_jjj',
            True
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'username': 'Este usuario no existe'})

    def test_validar_username_login(self):
        self.list_route_get('validar_username_login/?username=otro')

    def test_detail_adicionar_grupo(self):
        self.assertTrue(self.user.groups.all().count() == 0)
        new_group, created = Group.objects.get_or_create(name='new_group')
        response = self.detail_route_post('adicionar_grupo', {'id_grupo': new_group.id}, self.user.id)
        usuario = response.data
        usuario = User.objects.get(pk=usuario.get('id'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(usuario.groups.all().count() == 1)


class AuthenticationTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import UserFactory
        super().setUp()
        self.Factory = UserFactory
        self.url = '/api/authentication/'
        self.permiso = 'user'
        self.modelo = User
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_update_test = {'first_name': 'probando'}

    def test_cargar_usuario(self):
        response = self.list_route_get('cargar_usuario/')
        respuesta = response.data
        username = respuesta.pop('username', None)
        first_name = respuesta.pop('first_name', None)
        last_name = respuesta.pop('last_name', None)
        self.assertIsNotNone(username)
        self.assertIsNotNone(first_name)
        self.assertIsNotNone(last_name)
        self.assertEqual(last_name, self.superuser.last_name)
        self.assertEqual(first_name, self.superuser.first_name)
        self.assertEqual(username, self.superuser.username)

    def test_login(self):
        response = self.list_route_post('login/', {'username': 'admin', 'password': 'admin'})
        respuesta = response.data
        token = respuesta.get('token', None)
        user = respuesta.get('user', None)
        self.assertIsNotNone(token)
        self.assertIsNotNone(user)
