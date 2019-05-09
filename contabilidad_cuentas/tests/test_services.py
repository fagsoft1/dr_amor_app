import sys

from django.test import TestCase
from django.utils import timezone
from faker import Faker
from rest_framework.exceptions import ValidationError

faker = Faker()


class CuentaContableServicesTests(TestCase):
    def test_cuenta_contable_cambiar_cuenta_padre(self):
        from ..services import (
            cuenta_contable_cambiar_cuenta_padre,
            cuenta_contable_crear_actualizar
        )
        cuenta = cuenta_contable_crear_actualizar(
            descripcion='clase',
            codigo='1',
            naturaleza='D'
        )
        cuenta_2 = cuenta_contable_crear_actualizar(
            descripcion='clase',
            codigo='2',
            naturaleza='D'
        )
        cuenta_hija = cuenta_contable_crear_actualizar(
            descripcion='grupo',
            codigo='13',
            cuenta_padre_id=cuenta.id,
            naturaleza='D'
        )
        cuenta_hija2_1 = cuenta_contable_crear_actualizar(
            descripcion='cuenta',
            codigo='1301',
            cuenta_padre_id=cuenta_hija.id,
            naturaleza='D'
        )
        cuenta_hija2_2 = cuenta_contable_crear_actualizar(
            descripcion='cuenta',
            codigo='1302',
            cuenta_padre_id=cuenta_hija.id,
            naturaleza='D'
        )
        cuenta_hija3_1 = cuenta_contable_crear_actualizar(
            descripcion='cuenta',
            codigo='130155',
            cuenta_padre_id=cuenta_hija2_1.id,
            naturaleza='D'
        )
        cuenta_hija3_2 = cuenta_contable_crear_actualizar(
            descripcion='cuenta',
            codigo='130156',
            cuenta_padre_id=cuenta_hija2_1.id,
            naturaleza='D'
        )

        resutl = cuenta_contable_cambiar_cuenta_padre(
            cuenta_contable_id=cuenta_hija3_1.id,
            cuenta_contable_padre_id=cuenta_hija2_2.id
        )
        print('Cambio 1')
        print(resutl.codigo)

        resutl = cuenta_contable_cambiar_cuenta_padre(
            cuenta_contable_id=cuenta_hija3_2.id,
            cuenta_contable_padre_id=cuenta_hija2_2.id
        )
        print('Cambio 2')
        print(resutl.codigo)

        resutl = cuenta_contable_cambiar_cuenta_padre(
            cuenta_contable_id=cuenta_hija2_2.id,
            cuenta_contable_padre_id=cuenta_2.id
        )
        print('Cambio 3')
        print('aqui cambió varias')
        print(resutl.codigo)
        for x in resutl.cuentas_hijas.all():
            print(x.codigo)

    def test_cuenta_contable_crear(self):
        from ..services import cuenta_contable_crear_actualizar
        cuenta = cuenta_contable_crear_actualizar(
            descripcion='clase',
            codigo='1',
            naturaleza='D'
        )
        cuenta_hija = cuenta_contable_crear_actualizar(
            descripcion='grupo',
            codigo='13',
            cuenta_padre_id=cuenta.id,
            naturaleza='D'
        )
        cuenta_hija2 = cuenta_contable_crear_actualizar(
            descripcion='cuenta',
            codigo='1301',
            cuenta_padre_id=cuenta_hija.id,
            naturaleza='D'
        )
        cuenta_hija3 = cuenta_contable_crear_actualizar(
            descripcion='cuenta',
            codigo='130155',
            cuenta_padre_id=cuenta_hija2.id,
            naturaleza='D'
        )
