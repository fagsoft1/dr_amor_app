from rest_framework.exceptions import ValidationError
from django.test import TestCase
from empresas.factories import EmpresaFactory
from empresas.models import Empresa

from faker import Faker

faker = Faker()


class EmpresaTests(TestCase):
    def test_crear_empresa(self):
        user_count = Empresa.objects.count()
        EmpresaFactory()
        self.assertEqual(user_count + 1, Empresa.objects.count())
