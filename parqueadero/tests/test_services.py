from django.test import TestCase
from django.utils import timezone
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


class RegistroEntradaParqueoTests(TestCase):
    def setUp(self):
        from puntos_venta.factories import PuntoVentaFactory
        from puntos_venta.services import punto_venta_abrir
        from terceros.factories import ColaboradorFactory
        from ..factories import TipoVehiculoFactory, ModalidadFraccionTiempoFactory, VehiculoFactory
        punto_venta = PuntoVentaFactory(usuario_actual=None, abierto=False)
        colaborador = ColaboradorFactory(presente=True)
        punto_venta, self.punto_venta_turno = punto_venta_abrir(
            usuario_pv_id=colaborador.usuario.id,
            punto_venta_id=punto_venta.id,
            saldo_cierre_caja_anterior=0,
            base_inicial_efectivo=0
        )

        tipo_vehiculo_sin_placa = TipoVehiculoFactory(
            tiene_placa=False
        )
        self.vehiculo = VehiculoFactory()
        self.modalidad_fraccion_tiempo_sin_placa = ModalidadFraccionTiempoFactory(
            tipo_vehiculo=tipo_vehiculo_sin_placa
        )

        tipo_vehiculo_con_placa = TipoVehiculoFactory(
            tiene_placa=True
        )
        self.modalidad_fraccion_tiempo_con_placa = ModalidadFraccionTiempoFactory(
            tipo_vehiculo=tipo_vehiculo_con_placa
        )

    def crear_modalidades_tiempos_detalles(self):
        from ..factories import ModalidadFraccionTiempoDetalleFactory
        ModalidadFraccionTiempoDetalleFactory(
            modalidad_fraccion_tiempo=self.modalidad_fraccion_tiempo_sin_placa,
            minutos=60,
            valor=1000
        )
        ModalidadFraccionTiempoDetalleFactory(
            modalidad_fraccion_tiempo=self.modalidad_fraccion_tiempo_sin_placa,
            minutos=120,
            valor=1500
        )
        ModalidadFraccionTiempoDetalleFactory(
            modalidad_fraccion_tiempo=self.modalidad_fraccion_tiempo_sin_placa,
            minutos=180,
            valor=2000
        )
        ModalidadFraccionTiempoDetalleFactory(
            modalidad_fraccion_tiempo=self.modalidad_fraccion_tiempo_con_placa,
            minutos=60,
            valor=3000
        )
        ModalidadFraccionTiempoDetalleFactory(
            modalidad_fraccion_tiempo=self.modalidad_fraccion_tiempo_con_placa,
            minutos=120,
            valor=4500
        )
        ModalidadFraccionTiempoDetalleFactory(
            modalidad_fraccion_tiempo=self.modalidad_fraccion_tiempo_con_placa,
            minutos=180,
            valor=6000
        )

    def test_registro_entrada_parqueo_crear(self):
        from ..services import (
            registro_entrada_parqueo_crear,
            registro_entrada_parqueo_comprobante_entrada
        )
        registro_entrada = registro_entrada_parqueo_crear(
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_sin_placa.id
        )

        comprobante = registro_entrada_parqueo_comprobante_entrada(registro_entrada_id=registro_entrada.id)
        comprobante.write_pdf(
            target='media/pruebas_pdf/parqueadero_comprobante_entrada_sin_vehiculo.pdf'
        )

        registro_entrada = registro_entrada_parqueo_crear(
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_con_placa.id,
            placa='LLL000'
        )
        comprobante = registro_entrada_parqueo_comprobante_entrada(registro_entrada_id=registro_entrada.id)
        comprobante.write_pdf(
            target='media/pruebas_pdf/parqueadero_comprobante_entrada_con_vehiculo.pdf'
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Faltó digitar la placa del vehiculo'}"
        ):
            registro_entrada_parqueo_crear(
                punto_venta_turno_id=self.punto_venta_turno.id,
                modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_con_placa.id,
            )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Este tipo de vehiculo no requiere placa, seleccione el correcto'}"
        ):
            registro_entrada_parqueo_crear(
                punto_venta_turno_id=self.punto_venta_turno.id,
                modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_sin_placa.id,
                placa='LLL000'
            )

    def test_registro_entrada_parqueo_calcular_pago(self):
        from ..services import registro_entrada_parqueo_calcular_pago
        from ..models import RegistroEntradaParqueo
        self.crear_modalidades_tiempos_detalles()
        registro = RegistroEntradaParqueo.objects.create(
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_sin_placa.id,
            hora_ingreso=timezone.now() + timezone.timedelta(seconds=-60 * 30)
        )
        registro_uno = RegistroEntradaParqueo.objects.create(
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_sin_placa.id,
            hora_ingreso=timezone.now() + timezone.timedelta(seconds=-60 * 60)
        )
        registro_dos = RegistroEntradaParqueo.objects.create(
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_sin_placa.id,
            hora_ingreso=timezone.now() + timezone.timedelta(seconds=-60 * 60 * 2)
        )
        registro_dos_uno = RegistroEntradaParqueo.objects.create(
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_sin_placa.id,
            hora_ingreso=timezone.now() + timezone.timedelta(seconds=(-60 * 60 * 2) - 60)
        )
        registro_tres = RegistroEntradaParqueo.objects.create(
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_sin_placa.id,
            hora_ingreso=timezone.now() + timezone.timedelta(seconds=-60 * 60 * 3)
        )
        registro_cuatro = RegistroEntradaParqueo.objects.create(
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_sin_placa.id,
            hora_ingreso=timezone.now() + timezone.timedelta(seconds=-60 * 60 * 4)
        )

        minutos, tarifa, hora_actual = registro_entrada_parqueo_calcular_pago(
            registro_entrada_parqueo_id=registro.id
        )
        self.assertEqual(minutos, 30)
        self.assertEqual(tarifa.valor, 1000)

        minutos, tarifa, hora_actual = registro_entrada_parqueo_calcular_pago(
            registro_entrada_parqueo_id=registro_uno.id
        )
        self.assertEqual(minutos, 60)
        self.assertEqual(tarifa.valor, 1000)

        minutos, tarifa, hora_actual = registro_entrada_parqueo_calcular_pago(
            registro_entrada_parqueo_id=registro_dos.id
        )
        self.assertEqual(minutos, 120)
        self.assertEqual(tarifa.valor, 1500)

        minutos, tarifa, hora_actual = registro_entrada_parqueo_calcular_pago(
            registro_entrada_parqueo_id=registro_dos_uno.id
        )
        self.assertEqual(minutos, 121)
        self.assertEqual(tarifa.valor, 2000)

        minutos, tarifa, hora_actual = registro_entrada_parqueo_calcular_pago(
            registro_entrada_parqueo_id=registro_tres.id
        )
        self.assertEqual(minutos, 180)
        self.assertEqual(tarifa.valor, 2000)

        minutos, tarifa, hora_actual = registro_entrada_parqueo_calcular_pago(
            registro_entrada_parqueo_id=registro_cuatro.id
        )
        self.assertEqual(minutos, 240)
        self.assertEqual(tarifa.valor, 2000)

    def test_registro_entrada_parqueo_registrar_pago(self):
        from ..services import (
            registro_entrada_parqueo_registrar_pago,
            registro_entrada_parqueo_calcular_pago,
            registro_entrada_parqueo_factura
        )
        from ..models import RegistroEntradaParqueo
        self.crear_modalidades_tiempos_detalles()
        registro = RegistroEntradaParqueo.objects.create(
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_con_placa.id,
            vehiculo=self.vehiculo,
            hora_ingreso=timezone.now() + timezone.timedelta(seconds=-(60 * 30 * 1) - 1)
        )
        self.assertIsNone(registro.hora_pago)
        self.assertEqual(len(registro.transacciones_caja.all()), 0)
        minutos, tarifa, hora_actual = registro_entrada_parqueo_calcular_pago(
            registro_entrada_parqueo_id=registro.id
        )
        registro = registro_entrada_parqueo_registrar_pago(
            registro_entrada_parqueo_id=registro.id,
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_detalle_id=tarifa.id
        )
        factura = registro_entrada_parqueo_factura(
            registro_entrada_id=registro.id
        )
        factura.write_pdf(
            target='media/pruebas_pdf/parqueadero_factura.pdf'
        )
        self.assertEqual(len(registro.transacciones_caja.all()), 1)
        self.assertIsNotNone(registro.hora_pago)
        self.assertEqual(registro.transacciones_caja.all().first().valor_efectivo, registro.valor_total)
        self.assertEqual(registro.transacciones_caja.all().first().tipo, 'I')
        self.assertEqual(registro.transacciones_caja.all().first().tipo_dos, 'PARQUEADERO')

    def test_registro_entrada_parqueo_registrar_salida(self):
        from ..services import (
            registro_entrada_parqueo_registrar_pago,
            registro_entrada_parqueo_calcular_pago,
            registro_entrada_parqueo_registrar_salida
        )
        from ..models import RegistroEntradaParqueo
        self.crear_modalidades_tiempos_detalles()
        registro = RegistroEntradaParqueo.objects.create(
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=self.modalidad_fraccion_tiempo_con_placa.id,
            vehiculo=self.vehiculo,
            hora_ingreso=timezone.now() + timezone.timedelta(seconds=-(60 * 30 * 1) - 1)
        )
        minutos, tarifa, hora_actual = registro_entrada_parqueo_calcular_pago(
            registro_entrada_parqueo_id=registro.id
        )
        registro = registro_entrada_parqueo_registrar_pago(
            registro_entrada_parqueo_id=registro.id,
            punto_venta_turno_id=self.punto_venta_turno.id,
            modalidad_fraccion_tiempo_detalle_id=tarifa.id
        )
        self.assertIsNone(registro.hora_salida)
        registro = registro_entrada_parqueo_registrar_salida(
            registro_entrada_parqueo_id=registro.id
        )
        self.assertIsNotNone(registro.hora_salida)
