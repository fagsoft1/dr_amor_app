from typing import Callable

from django.contrib.auth.models import Permission
from django.forms import model_to_dict
from knox.models import AuthToken
from django.test import TestCase
from rest_framework import status

from faker import Faker

from usuarios.factories import UserFactory

faker = Faker()


class BaseTestsApi(TestCase):
    def setUp(self):
        self.superuser = UserFactory(username='admin', is_superuser=True)
        self.superuser.set_password('admin')
        self.superuser.save()
        self.token_admin = AuthToken.objects.create(self.superuser)

        self.user = UserFactory(username='otro', is_superuser=False)
        self.user.set_password('otro')
        self.user.save()
        self.token_user = AuthToken.objects.create(self.user)

        self.url = ''

        self.Factory = None
        self.permiso = None
        self.instancia = None
        self.modelo = None
        self.data_for_create_test = None
        self.data_for_update_test = None

    def ingreso_no_autorizado(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def crear(self, callback_create: Callable = None):
        count = self.modelo.objects.count()

        data = self.data_for_create_test

        response = self.client.post(
            self.url,
            data,
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        permiso = Permission.objects.get(codename='add_%s' % self.permiso)
        self.user.user_permissions.add(permiso)
        response = self.client.post(
            self.url,
            data,
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        id = response.data.pop('id')
        self.assertTrue(self.modelo.objects.filter(pk=id).exists())

        count_2 = self.modelo.objects.count()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        if callback_create:
            callback_create(response)
        self.assertEqual(count + 1, count_2)

    def update(self, callback_update: Callable = None):
        data = self.data_for_create_test
        permiso = Permission.objects.get(codename='add_%s' % self.permiso)
        self.user.user_permissions.add(permiso)
        response = self.client.post(
            self.url,
            data,
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        id = response.data.pop('id')
        self.instancia = self.modelo.objects.get(id=id)

        instancia_diccionario = model_to_dict(self.instancia)
        for x in self.data_for_update_test:
            instancia_diccionario[x] = self.data_for_update_test[x]

        response = self.client.put(
            '%s%s/' % (self.url, self.instancia.id),
            instancia_diccionario,
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        permiso = Permission.objects.get(codename='change_%s' % self.permiso)
        self.user.user_permissions.add(permiso)
        response = self.client.put(
            '%s%s/' % (self.url, self.instancia.id),
            instancia_diccionario,
            content_type='application/json',
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if callback_update:
            callback_update(response)

    def delete(self, callback_delete: Callable = None):
        data = self.data_for_create_test
        permiso = Permission.objects.get(codename='add_%s' % self.permiso)
        self.user.user_permissions.add(permiso)
        response = self.client.post(
            self.url,
            data,
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        id = response.data.pop('id')
        self.assertTrue(self.modelo.objects.filter(pk=id).exists())

        count = self.modelo.objects.count()

        response = self.client.delete(
            '%s%s/' % (self.url, id),
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        permiso = Permission.objects.get(codename='delete_%s' % self.permiso)
        self.user.user_permissions.add(permiso)

        response = self.client.delete(
            '%s%s/' % (self.url, id),
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(self.modelo.objects.filter(pk=id).exists())
        if callback_delete:
            callback_delete(response)
        count_2 = self.modelo.objects.count()
        self.assertEqual(count - 1, count_2)

    def list(self, callback_view: Callable = None, callback_list: Callable = None):
        data = self.data_for_create_test
        permiso = Permission.objects.get(codename='add_%s' % self.permiso)
        self.user.user_permissions.add(permiso)
        response = self.client.post(
            self.url,
            data,
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        id = response.data.pop('id')

        response = self.client.get(
            self.url,
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        permiso = Permission.objects.get(codename='list_%s' % self.permiso)
        self.user.user_permissions.add(permiso)
        response = self.client.get(
            self.url,
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if callback_list:
            callback_list(response)

        response = self.client.get(
            '%s%s/' % (self.url, id),
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        permiso = Permission.objects.get(codename='view_%s' % self.permiso)
        self.user.user_permissions.add(permiso)
        response = self.client.get(
            '%s%s/' % (self.url, id),
            HTTP_AUTHORIZATION='Token ' + self.token_user
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if callback_view:
            callback_view(response)

    def list_route_get(self, url_list_route: str, espera_error=False):
        url = '%s%s' % (self.url, url_list_route)
        response = self.client.get(
            url,
            HTTP_AUTHORIZATION='Token ' + self.token_admin
        )
        if not espera_error:
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response

    def list_route_post(self, url_list_route: str, values, espera_error=False):
        url = '%s%s' % (self.url, url_list_route)
        response = self.client.post(
            url,
            values,
            HTTP_AUTHORIZATION='Token ' + self.token_admin
        )
        if not espera_error:
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response

    def detail_route_post(self, url_detail_route: str, values, id_detail, espera_error=False):
        url = '%s%s/%s/' % (self.url, id_detail, url_detail_route)

        response = self.client.post(
            url,
            values,
            HTTP_AUTHORIZATION='Token ' + self.token_admin
        )
        if not espera_error:
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response
