from django.db.models import Q
from django.test import TestCase

from usuarios.factories import UserFactory
from ..models import Tercero
from ..factories import (
    AcompananteFactory,
    CategoriaAcompananteFactory,
    ColaboradorFactory,
    ProveedorFactory
)
from faker import Faker

faker = Faker()


class ManagerAcompananteTests(TestCase):
    def setUp(self):
        self.usuario = UserFactory()
        self.categoria_modelo = CategoriaAcompananteFactory()

    def test_acompanantes_queryset(self):
        AcompananteFactory()
        AcompananteFactory()
        ColaboradorFactory()
        count = Tercero.acompanantes.count()
        count2 = Tercero.objects.filter(es_acompanante=True).count()
        self.assertEqual(count, count2)

    def test_acompanantes_queryset_presentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory()
        AcompananteFactory(presente=True)
        AcompananteFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory()
        count = Tercero.acompanantes.presentes().count()
        count2 = Tercero.objects.filter(Q(es_acompanante=True) & Q(presente=True)).count()
        self.assertEqual(count, count2)

    def test_acompanantes_queryset_ausentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory(presente=True)
        AcompananteFactory(presente=False)
        AcompananteFactory(presente=False)
        AcompananteFactory(presente=False)
        ColaboradorFactory(presente=False)
        ColaboradorFactory(presente=True)
        count = Tercero.acompanantes.ausentes().count()
        count2 = Tercero.objects.filter(Q(es_acompanante=True) & Q(presente=False)).count()
        self.assertEqual(count, count2)


class ManagerColaboradorTests(TestCase):
    def setUp(self):
        self.usuario = UserFactory()
        self.categoria_modelo = CategoriaAcompananteFactory()

    def test_colaboradores_queryset(self):
        AcompananteFactory()
        AcompananteFactory()
        ColaboradorFactory()
        count = Tercero.colaboradores.count()
        count2 = Tercero.objects.filter(es_colaborador=True).count()
        self.assertEqual(count, count2)

    def test_colaboradores_queryset_ausentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        ColaboradorFactory(presente=True)
        AcompananteFactory(presente=False)
        ColaboradorFactory(presente=False)
        AcompananteFactory(presente=False)
        ColaboradorFactory(presente=False)
        ColaboradorFactory(presente=True)
        count = Tercero.colaboradores.ausentes().count()
        count2 = Tercero.objects.filter(Q(es_colaborador=True) & Q(presente=False)).count()
        self.assertEqual(count, count2)
        self.assertEqual(count, count2)

    def test_colaboradores_queryset_presentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory()
        AcompananteFactory(presente=False)
        AcompananteFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=False)
        count = Tercero.colaboradores.presentes().count()
        count2 = Tercero.objects.filter(Q(es_colaborador=True) & Q(presente=True)).count()
        self.assertEqual(count, count2)


class ManagerProveedorTests(TestCase):
    def setUp(self):
        self.usuario = UserFactory()
        self.categoria_modelo = CategoriaAcompananteFactory()

    def test_proveedores_queryset(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory()
        ColaboradorFactory()
        count = Tercero.proveedores.count()
        count2 = Tercero.objects.filter(es_proveedor=True).count()
        self.assertEqual(count, count2)


class ManagerInternosTests(TestCase):
    def setUp(self):
        self.usuario = UserFactory()
        self.categoria_modelo = CategoriaAcompananteFactory()

    def test_internos_queryset(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory()
        ColaboradorFactory()
        count = Tercero.internos.count()
        count2 = Tercero.objects.filter(
            Q(es_acompanante=True) |
            Q(es_colaborador=True)
        ).count()
        self.assertEqual(count, count2)

    def test_internos_queryset_presentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory()
        AcompananteFactory(presente=True)
        AcompananteFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=True)
        ColaboradorFactory()
        ColaboradorFactory()
        count = Tercero.internos.presentes().count()
        count2 = Tercero.objects.filter(
            (
                    Q(es_acompanante=True) |
                    Q(es_colaborador=True)
            )
            & Q(presente=True)
        ).count()
        self.assertEqual(count, count2)

    def test_internos_queryset_ausentes(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory(presente=True)
        AcompananteFactory(presente=False)
        AcompananteFactory(presente=False)
        ColaboradorFactory(presente=False)
        ColaboradorFactory(presente=False)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=True)
        count = Tercero.internos.ausentes().count()
        count2 = Tercero.objects.filter(
            (
                    Q(es_acompanante=True) |
                    Q(es_colaborador=True)
            )
            & Q(presente=False)
        ).count()
        self.assertEqual(count, count2)

    def test_internos_queryset_ausentes_activos(self):
        ProveedorFactory()
        ProveedorFactory()
        ProveedorFactory()
        AcompananteFactory(presente=True)
        AcompananteFactory(presente=False)
        ColaboradorFactory(presente=True)
        ColaboradorFactory(presente=False)

        interno1 = AcompananteFactory(presente=False)
        usuario1 = interno1.usuario
        usuario1.is_active = False
        usuario1.save()

        interno2 = ColaboradorFactory(presente=False)
        usuario2 = interno2.usuario
        usuario2.is_active = False
        usuario2.save()

        ColaboradorFactory(presente=True)
        count = Tercero.internos.ausentes().activos().count()
        count2 = Tercero.objects.filter(
            (
                    Q(es_acompanante=True) |
                    Q(es_colaborador=True)
            )
            &
            (
                    Q(presente=False)
                    &
                    Q(usuario__is_active=True)
            )
        ).count()
        self.assertEqual(count, count2)
