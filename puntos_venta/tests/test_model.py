from django.db.utils import IntegrityError
from django.test import TestCase

from ..factories import PuntoVentaFactory
from inventarios.factories import BodegaFactory
from usuarios.factories import UserFactory
from ..models import PuntoVenta

from faker import Faker

faker = Faker()


class PuntoVentaTests(TestCase):
    def setUp(self):
        self.bodega = BodegaFactory()
        self.usuario_actual = UserFactory()

    def test_crear_punto_venta(self):
        count = PuntoVenta.objects.count()
        PuntoVentaFactory()
        self.assertEqual(count + 1, PuntoVenta.objects.count())
