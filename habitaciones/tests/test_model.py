from django.db.utils import IntegrityError
from django.test import TestCase
from rest_framework.exceptions import ValidationError

from empresas.factories import EmpresaFactory
from ..factories import TipoHabitacionFactory, HabitacionFactory
from ..models import TipoHabitacion, Habitacion
from ..services import habitacion_cambiar_estado

from faker import Faker

faker = Faker()


class HabitacionTests(TestCase):
    def setUp(self):
        self.tipo = TipoHabitacionFactory()
        self.empresa = EmpresaFactory()

    def test_crear_habitacion(self):
        count = Habitacion.objects.count()
        HabitacionFactory()
        self.assertEqual(count + 1, Habitacion.objects.count())


class TipoHabitacionTests(TestCase):
    def test_crear_tipo_habitacion(self):
        user_count = TipoHabitacion.objects.count()
        tipo_habitacion = TipoHabitacionFactory()
        self.assertEqual(user_count + 1, TipoHabitacion.objects.count())
        with self.assertRaisesMessage(
                IntegrityError,
                'duplicate key value violates unique constraint "habitaciones_tipohabitacion_nombre_key'
        ):
            TipoHabitacionFactory(nombre=tipo_habitacion.nombre)
