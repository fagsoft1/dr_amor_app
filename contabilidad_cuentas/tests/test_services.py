import sys

from django.test import TestCase
from django.utils import timezone
from faker import Faker
from rest_framework.exceptions import ValidationError

faker = Faker()


class CuentaContableServicesTests(TestCase):
    def test_cuenta_contable_crear(self):
        from ..services import cuenta_contable_crear
        cuenta = cuenta_contable_crear(
            descripcion='clase',
            codigo=1
        )
        cuenta_hija = cuenta_contable_crear(
            descripcion='grupo',
            codigo=13,
            cuenta_padre_id=cuenta.id
        )
        cuenta_hija2 = cuenta_contable_crear(
            descripcion='cuenta',
            codigo=1301,
            cuenta_padre_id=cuenta_hija.id
        )
        cuenta_hija3 = cuenta_contable_crear(
            descripcion='cuenta',
            codigo=130155,
            cuenta_padre_id=cuenta_hija2.id
        )
