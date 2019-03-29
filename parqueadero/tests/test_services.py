from django.test import TestCase
from faker import Faker
from rest_framework.exceptions import ValidationError

faker = Faker()


class ModalidadFraccionTiempoDetalleTests(TestCase):
    def setUp(self):
        from ..factories import ModalidadFraccionTiempoFactory
        self.modalidad_fraccion_tiempo = ModalidadFraccionTiempoFactory()

    def test_modalida_fraccion_tiempo_detalle_crear_actualizar(self):
        from ..services import modalida_fraccion_tiempo_detalle_crear_actualizar
        count = self.modalidad_fraccion_tiempo.fracciones.count()
        mft_uno = modalida_fraccion_tiempo_detalle_crear_actualizar(
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo.id,
            minutos=60,
            valor=3000
        )
        with self.assertRaisesMessage(
                ValidationError,
                "'_error': 'Ya existe un valor de tarifa definido para"
        ):
            modalida_fraccion_tiempo_detalle_crear_actualizar(
                modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo.id,
                minutos=60,
                valor=3000
            )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Existe un valor mayor a 2500 para una tarifa con minutos inferiores a 70. Revisar y asignar correctamente'}"
        ):
            modalida_fraccion_tiempo_detalle_crear_actualizar(
                modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo.id,
                minutos=70,
                valor=2500
            )

        modalida_fraccion_tiempo_detalle_crear_actualizar(
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo.id,
            minutos=70,
            valor=3500
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Existe un valor menor a 4000 para una tarifa con minutos mayores a 50. Revisar y asignar correctamente'}"
        ):
            modalida_fraccion_tiempo_detalle_crear_actualizar(
                modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo.id,
                minutos=50,
                valor=4000
            )

        mft_dos = modalida_fraccion_tiempo_detalle_crear_actualizar(
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo.id,
            minutos=50,
            valor=2000
        )

        count_dos = self.modalidad_fraccion_tiempo.fracciones.count()

        self.assertEqual(count + 3, count_dos)

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Existe un valor menor a 4500 para una tarifa con minutos mayores a 60. Revisar y asignar correctamente'}"
        ):
            modalida_fraccion_tiempo_detalle_crear_actualizar(
                modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo.id,
                minutos=60,
                valor=4500,
                modalidad_fraccion_tiempo_detalle_id=mft_uno.id
            )

        modalida_fraccion_tiempo_detalle_crear_actualizar(
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo.id,
            minutos=60,
            valor=3100,
            modalidad_fraccion_tiempo_detalle_id=mft_uno.id
        )

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Existe un valor menor a 4000 para una tarifa con minutos mayores a 50. Revisar y asignar correctamente'}"
        ):
            modalida_fraccion_tiempo_detalle_crear_actualizar(
                modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo.id,
                minutos=50,
                valor=4000,
                modalidad_fraccion_tiempo_detalle_id=mft_dos.id
            )

        modalida_fraccion_tiempo_detalle_crear_actualizar(
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo.id,
            minutos=50,
            valor=2200,
            modalidad_fraccion_tiempo_detalle_id=mft_dos.id
        )

        count_tres = self.modalidad_fraccion_tiempo.fracciones.count()
        self.assertEqual(count_dos, count_tres)
