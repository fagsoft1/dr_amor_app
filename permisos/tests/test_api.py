from django.contrib.auth.models import Group

from dr_amor_app.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class PermisosTestsApi(BaseTestsApi):
    def setUp(self):
        super().setUp()
        self.url = '/api/permisos/'
        self.permiso = 'permission'
        from usuarios.services import adicionar_permiso
        from django.contrib.auth.models import Permission
        self.permisos = Permission.objects.all()[:4]
        [adicionar_permiso(user_id=self.user.id, permiso_id=x.id) for x in self.permisos.all()]

    def test_mis_permisos(self):
        response = self.list_route_get('mis_permisos/')
        from django.contrib.auth.models import Permission
        count = Permission.objects.all().count()
        self.assertEqual(len(response.data), count)

    def test_permiso_x_usuario(self):
        response = self.list_route_get('permiso_x_usuario/?user_id=%s' % self.user.id)
        self.assertEqual(len(response.data), 4)

    def test_permisos_activos(self):
        from permisos.models import PermissionPlus
        response = self.list_route_get('permisos_activos/')
        self.assertEqual(len(response.data), 0)
        for permiso in self.permisos:
            PermissionPlus.objects.create(
                permiso=permiso,
                nombre=permiso.codename,
                activo=True
            )
        response = self.list_route_get('permisos_activos/')
        self.assertEqual(len(response.data), 4)

    def test_tengo_permisos(self):
        permisos_string = ''
        for x in self.permisos.all():
            permisos_string = permisos_string + x.codename + ','
        response = self.list_route_get("tengo_permisos/?listado_permisos=%s" % permisos_string)
        self.assertEqual(len(response.data), 4)

    def test_por_grupo(self):
        grupo = Group.objects.create(name='Prueba')
        grupo_dos = Group.objects.create(name='Prueba2')
        [grupo.permissions.add(permiso) for permiso in self.permisos.all()]
        [grupo_dos.permissions.add(permiso) for permiso in self.permisos.all()[0:2]]
        response = self.list_route_get('por_grupo/?grupo_id=%s' % grupo.id)
        self.assertEqual(len(response.data), 4)
        response = self.list_route_get('por_grupo/?grupo_id=%s' % grupo_dos.id)
        self.assertEqual(len(response.data), 2)


class GruposTestsApi(BaseTestsApi):
    def setUp(self):
        super().setUp()
        self.url = '/api/grupos_permisos/'
        self.permiso = 'group'
        from django.contrib.auth.models import Permission
        self.permisos = Permission.objects.all()[:4]

    def test_adicionar_permiso(self):
        grupo = Group.objects.create(name='Prueba')
        response = self.detail_route_post('adicionar_permiso', {'id_permiso': self.permisos.first().id}, grupo.id)
        self.assertEqual(len(response.data.pop('permissions')), 1)
        response = self.detail_route_post('adicionar_permiso', {'id_permiso': self.permisos.first().id}, grupo.id)
        self.assertEqual(len(response.data.pop('permissions')), 0)

    def test_validar_nombre(self):
        response = self.list_route_get('validar_nombre/?name=Prueba')
        self.assertEqual(response.data, {})
        Group.objects.create(name='Prueba')
        response = self.list_route_get('validar_nombre/?name=Prueba')
        self.assertEqual(response.data, {'name': 'Ya exite'})
