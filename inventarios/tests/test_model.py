from django.db import transaction
from django.db.utils import IntegrityError
from django.test import TestCase
from rest_framework.exceptions import ValidationError

from ..factories import BodegaFactory
from ..models import Bodega

from faker import Faker

faker = Faker()


class BodegaTests(TestCase):
    def test_crear_bodega(self):
        count = Bodega.objects.count()
        bodega = BodegaFactory()
        self.assertEqual(count + 1, Bodega.objects.count())
        with self.assertRaisesMessage(
                IntegrityError,
                'duplicate key value violates unique constraint "inventarios_bodega_nombre_key'
        ):
            BodegaFactory(nombre=bodega.nombre)
