from django.test import TestCase
from django.utils import timezone
from faker import Faker
from rest_framework.exceptions import ValidationError

faker = Faker()


class TransaccionesCajaServicesTests(TestCase):
    def setUp(self):
        from terceros.factories import AcompananteFactory, ColaboradorFactory
        from puntos_venta.factories import PuntoVentaFactory
        from puntos_venta.services import punto_venta_abrir
        from habitaciones.factories import (
            HabitacionFactory,
            TipoHabitacionFactory
        )
        from servicios.services import servicio_crear_nuevo, servicio_iniciar
        from terceros_acompanantes.factories import (
            CategoriaFraccionTiempoFactory,
            FraccionTiempoFactory,
            CategoriaAcompananteFactory
        )
        from terceros.services import (
            acompanante_crear,
            tercero_set_new_pin,
            tercero_registra_entrada,
            colaborador_crear
        )

        self.tipo_habitacion_uno = TipoHabitacionFactory(valor=40000)
        self.tipo_habitacion_dos = TipoHabitacionFactory(valor=60000)
        self.tipo_habitacion_tres = TipoHabitacionFactory(valor=30000)

        self.habitacion_uno = HabitacionFactory(tipo=self.tipo_habitacion_uno)
        self.habitacion_dos = HabitacionFactory(tipo=self.tipo_habitacion_dos)
        self.habitacion_tres = HabitacionFactory(tipo=self.tipo_habitacion_tres)

        # Colaborador para transacciones
        colaborador_base = ColaboradorFactory.build(usuario=None)
        colaborador_base.pop('es_colaborador')
        colaborador_base.pop('usuario')

        self.colaborador = colaborador_crear(colaborador_base)
        self.colaborador, pin_nuevo = tercero_set_new_pin(self.colaborador.id, '0000')
        tercero_registra_entrada(tercero_id=self.colaborador.id, raw_pin='0000')
        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)
        self.punto_venta, self.punto_venta_turno = punto_venta_abrir(
            punto_venta_id=self.punto_venta.id,
            usuario_pv_id=self.colaborador.usuario.id,
            base_inicial_efectivo=0
        )

        # Acompanante
        self.categoria_modelo = CategoriaAcompananteFactory()
        self.fraccion_tiempo_30 = FraccionTiempoFactory(minutos=30)
        self.fraccion_tiempo_45 = FraccionTiempoFactory(minutos=45)
        self.fraccion_tiempo_60 = FraccionTiempoFactory(minutos=60)
        self.categoria_modelo = CategoriaAcompananteFactory()
        self.categoria_fraccion_tiempo_30 = CategoriaFraccionTiempoFactory(
            categoria=self.categoria_modelo,
            fraccion_tiempo=self.fraccion_tiempo_30,
            valor=100000
        )
        self.categoria_fraccion_tiempo_45 = CategoriaFraccionTiempoFactory(
            categoria=self.categoria_modelo,
            fraccion_tiempo=self.fraccion_tiempo_45,
            valor=150000
        )
        self.categoria_fraccion_tiempo_60 = CategoriaFraccionTiempoFactory(
            categoria=self.categoria_modelo,
            fraccion_tiempo=self.fraccion_tiempo_60,
            valor=200000
        )
        acompanante_base = AcompananteFactory.build(
            usuario=None,
            categoria_modelo=self.categoria_modelo
        )
        acompanante_base.pop('es_acompanante')
        acompanante_base.pop('usuario')

        self.acompanante = acompanante_crear(acompanante_base)

        self.acompanante_base_dos = AcompananteFactory.build(
            usuario=None,
            categoria_modelo=self.categoria_modelo
        )
        self.acompanante_base_dos.pop('es_acompanante')
        self.acompanante_base_dos.pop('usuario')
        self.acompanante_dos = acompanante_crear(self.acompanante_base_dos)

        self.acompanante, pin = tercero_set_new_pin(tercero_id=self.acompanante.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=self.acompanante.id, raw_pin='0000')

        self.acompanante_dos, pin = tercero_set_new_pin(tercero_id=self.acompanante_dos.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=self.acompanante_dos.id, raw_pin='0000')

        self.array_servicios = [
            {'tercero_id': self.acompanante.id, 'categoria_fraccion_tiempo_id': self.categoria_fraccion_tiempo_30.id},
            {'tercero_id': self.acompanante_dos.id,
             'categoria_fraccion_tiempo_id': self.categoria_fraccion_tiempo_45.id},
            {'tercero_id': self.acompanante_dos.id,
             'categoria_fraccion_tiempo_id': self.categoria_fraccion_tiempo_60.id},
            {'tercero_id': self.acompanante.id, 'categoria_fraccion_tiempo_id': self.categoria_fraccion_tiempo_60.id},
            {'tercero_id': self.acompanante.id, 'categoria_fraccion_tiempo_id': self.categoria_fraccion_tiempo_45.id},
        ]

        self.array_servicios_id = []
        for servicio in self.array_servicios:
            tercero_id = servicio.pop('tercero_id')
            categoria_fraccion_tiempo_id = servicio.pop('categoria_fraccion_tiempo_id')

            servicio_adicionado = servicio_crear_nuevo(
                habitacion_id=self.habitacion_uno.id,
                acompanante_id=tercero_id,
                categoria_fraccion_tiempo_id=categoria_fraccion_tiempo_id,
                usuario_pdv_id=self.colaborador.usuario.id
            )
            self.array_servicios_id.append(servicio_adicionado.id)

        servicios_a_iniciar = self.habitacion_uno.servicios.filter(estado=0)
        [
            servicio_iniciar(servicio_id=servicio.id, usuario_pdv_id=self.colaborador.usuario.id) for
            servicio
            in servicios_a_iniciar.order_by('id').all()
        ]

    # region transaccion_caja_registrar_cambio_habitacion
    def test_transaccion_caja_registrar_cambio_habitacion_menor_valor(self):
        from ..services import transaccion_caja_registrar_cambio_habitacion_menor_valor
        array_servicios_id = list(self.habitacion_uno.servicios.values_list('id', flat=True).filter(estado=1))
        valor_habitacion_anterior = self.habitacion_uno.tipo.valor
        valor_habitacion_nueva = self.habitacion_tres.tipo.valor
        diferencia_valores = valor_habitacion_anterior - valor_habitacion_nueva
        valor_diferencia_total = diferencia_valores * len(array_servicios_id)
        transaccion_caja_registrar_cambio_habitacion_menor_valor(
            array_servicios_id=array_servicios_id,
            habitacion_anterior_id=self.habitacion_uno.id,
            usuario_pdv_id=self.colaborador.usuario.id,
            habitacion_nueva_id=self.habitacion_tres.id,
            valor_efectivo=valor_diferencia_total
        )

    def test_transaccion_caja_registrar_cambio_habitacion_menor_efectivo_valor_positivo(self):
        from ..services import transaccion_caja_registrar_cambio_habitacion_menor_valor
        array_servicios_id = list(self.habitacion_uno.servicios.values_list('id', flat=True).filter(estado=1))
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Los valores en efectivo debe ser igual o mayor a 0. El valor del efectivo es"
        ):
            transaccion_caja_registrar_cambio_habitacion_menor_valor(
                array_servicios_id=array_servicios_id,
                habitacion_anterior_id=self.habitacion_uno.id,
                usuario_pdv_id=self.colaborador.usuario.id,
                habitacion_nueva_id=self.habitacion_tres.id,
                valor_efectivo=-1000
            )

    def test_transaccion_caja_registrar_cambio_habitacion_menor_valor_efectivo_igual_valor_devolucion(self):
        from ..services import transaccion_caja_registrar_cambio_habitacion_menor_valor
        array_servicios_id = list(self.habitacion_uno.servicios.values_list('id', flat=True).filter(estado=1))
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El valor ingresado para la devolucion debe ser todo en efectivo. Valor devolucion:"
        ):
            transaccion_caja_registrar_cambio_habitacion_menor_valor(
                array_servicios_id=array_servicios_id,
                habitacion_anterior_id=self.habitacion_uno.id,
                usuario_pdv_id=self.colaborador.usuario.id,
                habitacion_nueva_id=self.habitacion_tres.id,
                valor_efectivo=3000
            )

    def test_transaccion_caja_registrar_cambio_habitacion_mayor_valor(self):
        from ..services import transaccion_caja_registrar_cambio_habitacion_mayor_valor
        array_servicios_id = list(self.habitacion_uno.servicios.values_list('id', flat=True).filter(estado=1))
        valor_habitacion_anterior = self.habitacion_uno.tipo.valor
        valor_habitacion_nueva = self.habitacion_dos.tipo.valor
        diferencia_valores = valor_habitacion_nueva - valor_habitacion_anterior
        valor_diferencia_total = diferencia_valores * len(array_servicios_id)
        transaccion_caja_registrar_cambio_habitacion_mayor_valor(
            array_servicios_id=array_servicios_id,
            habitacion_anterior_id=self.habitacion_uno.id,
            usuario_pdv_id=self.colaborador.usuario.id,
            habitacion_nueva_id=self.habitacion_dos.id,
            valor_efectivo=valor_diferencia_total / 2,
            valor_tarjeta=valor_diferencia_total / 2,
            nro_autorizacion='nroasd',
            franquicia='VISA'
        )

    def test_transaccion_caja_registrar_cambio_habitacion_mayor_valor_efectivo_tarjeta_positivo(self):
        from ..services import transaccion_caja_registrar_cambio_habitacion_mayor_valor
        array_servicios_id = list(self.habitacion_uno.servicios.values_list('id', flat=True).filter(estado=1))
        valor_habitacion_anterior = self.habitacion_uno.tipo.valor
        valor_habitacion_nueva = self.habitacion_dos.tipo.valor
        diferencia_valores = valor_habitacion_nueva - valor_habitacion_anterior
        valor_diferencia_total = diferencia_valores * len(array_servicios_id)
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es"
        ):
            transaccion_caja_registrar_cambio_habitacion_mayor_valor(
                array_servicios_id=array_servicios_id,
                habitacion_anterior_id=self.habitacion_uno.id,
                usuario_pdv_id=self.colaborador.usuario.id,
                habitacion_nueva_id=self.habitacion_dos.id,
                valor_efectivo=valor_diferencia_total / 2,
                valor_tarjeta=-1000,
                nro_autorizacion='nroasd',
                franquicia='VISA'
            )

    def test_transaccion_caja_registrar_cambio_habitacion_mayor_valor_efectivo_tarjeta_igual_excedente(self):
        from ..services import transaccion_caja_registrar_cambio_habitacion_mayor_valor
        array_servicios_id = list(self.habitacion_uno.servicios.values_list('id', flat=True).filter(estado=1))
        valor_habitacion_anterior = self.habitacion_uno.tipo.valor
        valor_habitacion_nueva = self.habitacion_dos.tipo.valor
        diferencia_valores = valor_habitacion_nueva - valor_habitacion_anterior
        valor_diferencia_total = diferencia_valores * len(array_servicios_id)
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El valor ingresado del pago del faltante, entre efectivo y tarjetas es diferente al requerido para cambiar de habitación. Valor requerido:"
        ):
            transaccion_caja_registrar_cambio_habitacion_mayor_valor(
                array_servicios_id=array_servicios_id,
                habitacion_anterior_id=self.habitacion_uno.id,
                usuario_pdv_id=self.colaborador.usuario.id,
                habitacion_nueva_id=self.habitacion_dos.id,
                valor_efectivo=(valor_diferencia_total / 2) + 2,
                valor_tarjeta=valor_diferencia_total / 2,
                nro_autorizacion='nroasd',
                franquicia='VISA'
            )

    # endregion

    # region transaccion_caja_registrar_anulacion_servicio
    def test_transaccion_caja_registrar_anulacion_servicio(self):
        from ..services import transaccion_caja_registrar_anulacion_servicio
        servicio_id = self.habitacion_uno.servicios.first().id
        transaccion = transaccion_caja_registrar_anulacion_servicio(
            servicio_id=servicio_id,
            usuario_pdv_id=self.colaborador.usuario.id,
            valor_efectivo=140000,
            concepto='Algo pasó'
        )
        self.assertTrue(transaccion.servicios.count() == 1)
        self.assertTrue(transaccion.servicios.filter(pk=servicio_id))
        self.assertTrue(-transaccion.valor_efectivo == 140000)

    def test_transaccion_caja_registrar_anulacion_servicio_efectivo_valor_positivo(self):
        from ..services import transaccion_caja_registrar_anulacion_servicio
        servicio_id = self.habitacion_uno.servicios.first().id
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Los valores en efectivo debe ser igual o mayor a 0. El valor del efectivo es"
        ):
            transaccion_caja_registrar_anulacion_servicio(
                servicio_id=servicio_id,
                usuario_pdv_id=self.colaborador.usuario.id,
                valor_efectivo=-140000,
                concepto='Algo pasó'
            )

    def test_transaccion_caja_registrar_anulacion_servicio_valor_efectivo_igual_valor_servicio(self):
        from ..services import transaccion_caja_registrar_anulacion_servicio
        servicio_id = self.habitacion_uno.servicios.first().id
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El valor ingresado de la devolucion es diferente al valor del servicio. El de la devolución es"
        ):
            transaccion_caja_registrar_anulacion_servicio(
                servicio_id=servicio_id,
                usuario_pdv_id=self.colaborador.usuario.id,
                valor_efectivo=14000,
                concepto='Algo pasó'
            )

    # endregion

    # region transaccion_caja_registrar_pago_nuevos_servicios_habitacion
    def test_transaccion_caja_registrar_pago_nuevos_servicios_habitacion(self):
        from ..services import transaccion_caja_registrar_pago_nuevos_servicios_habitacion

        transaccion = transaccion_caja_registrar_pago_nuevos_servicios_habitacion(
            array_servicios_id=self.array_servicios_id,
            habitacion_id=self.habitacion_uno.id,
            usuario_pdv_id=self.colaborador.usuario.id,
            valor_efectivo=700000,
            valor_tarjeta=300000,
            nro_autorizacion='',
            franquicia=''
        )
        self.assertTrue(transaccion.servicios.count() == len(self.array_servicios_id))
        self.assertTrue(transaccion.valor_efectivo == 700000)
        self.assertTrue(transaccion.valor_tarjeta == 300000)

    def test_transaccion_caja_registrar_pago_nuevos_servicios_habitacion_efectivo_valor_positivo(self):
        from ..services import transaccion_caja_registrar_pago_nuevos_servicios_habitacion

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es"
        ):
            transaccion_caja_registrar_pago_nuevos_servicios_habitacion(
                array_servicios_id=self.array_servicios_id,
                habitacion_id=self.habitacion_uno.id,
                usuario_pdv_id=self.colaborador.usuario.id,
                valor_efectivo=-12000,
                valor_tarjeta=300000,
                nro_autorizacion='',
                franquicia=''
            )

    def test_transaccion_caja_registrar_pago_nuevos_servicios_habitacion_valores_tarjeta_efectivo_igual_valor_servicios(
            self):
        from ..services import transaccion_caja_registrar_pago_nuevos_servicios_habitacion
        with self.assertRaisesMessage(
                ValidationError,
                "'_error': 'El valor ingresado de forma de pago es diferente al valor total de los servicios. El Valor de los servicios es"
        ):
            transaccion_caja_registrar_pago_nuevos_servicios_habitacion(
                array_servicios_id=self.array_servicios_id,
                habitacion_id=self.habitacion_uno.id,
                usuario_pdv_id=self.colaborador.usuario.id,
                valor_efectivo=500000,
                valor_tarjeta=300000,
                nro_autorizacion='',
                franquicia=''
            )

    # endregion

    # region transaccion_caja_registrar_cambio_tiempo_servicio
    def test_transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo(self):
        from ..services import transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo
        servicio_id = self.habitacion_uno.servicios.filter(tiempo_minutos=30).first().id

        transaccion = transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo(
            servicio_id=servicio_id,
            categoria_fraccion_tiempo_nueva_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.colaborador.usuario.id,
            valor_efectivo=30000,
            valor_tarjeta=20000,
            nro_autorizacion='',
            franquicia=''
        )

        self.assertTrue(transaccion.servicios.count() == 1)
        self.assertTrue(transaccion.servicios.filter(pk=servicio_id))
        self.assertTrue(transaccion.valor_efectivo == 30000)
        self.assertTrue(transaccion.valor_tarjeta == 20000)

    def test_transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo_efectivo_valor_positivo(self):
        from ..services import transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo
        servicio_id = self.habitacion_uno.servicios.filter(tiempo_minutos=30).first().id

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es"
        ):
            transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo(
                servicio_id=servicio_id,
                categoria_fraccion_tiempo_nueva_id=self.categoria_fraccion_tiempo_45.id,
                usuario_pdv_id=self.colaborador.usuario.id,
                valor_efectivo=-30000,
                valor_tarjeta=20000,
                nro_autorizacion='',
                franquicia=''
            )

    def test_transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo_valores_tarjeta_efectivo_igual_valor_excedente(
            self):
        from ..services import transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo
        servicio_id = self.habitacion_uno.servicios.filter(tiempo_minutos=30).first().id

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El valor ingresado de forma de pago es diferente al excedente pagado por el servicio. El Valor del excedente es"
        ):
            transaccion_caja_registrar_cambio_tiempo_servicio_mayor_tiempo(
                servicio_id=servicio_id,
                categoria_fraccion_tiempo_nueva_id=self.categoria_fraccion_tiempo_45.id,
                usuario_pdv_id=self.colaborador.usuario.id,
                valor_efectivo=20000,
                valor_tarjeta=10000,
                nro_autorizacion='',
                franquicia=''
            )

    def test_transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo(self):
        from ..services import transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo
        servicio_id = self.habitacion_uno.servicios.filter(tiempo_minutos=60).first().id

        transaccion = transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo(
            servicio_id=servicio_id,
            categoria_fraccion_tiempo_nueva_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.colaborador.usuario.id,
            valor_efectivo=100000
        )
        self.assertTrue(transaccion.servicios.count() == 1)
        self.assertTrue(transaccion.servicios.filter(pk=servicio_id))
        self.assertTrue(transaccion.valor_efectivo == -100000)

    def test_transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo_efectivo_valor_positivo(self):
        from ..services import transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo
        servicio_id = self.habitacion_uno.servicios.filter(tiempo_minutos=30).first().id

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Los valores en efectivo o tarjeta deben ser iguales o mayores a 0. El valor del efectivo es"
        ):
            transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo(
                servicio_id=servicio_id,
                categoria_fraccion_tiempo_nueva_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.colaborador.usuario.id,
                valor_efectivo=-100000
            )

    def test_transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo_valore_efectivo_igual_valor_devolucion(
            self):
        from ..services import transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo
        servicio_id = self.habitacion_uno.servicios.filter(tiempo_minutos=30).first().id

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El valor ingresado de forma de pago es diferente a la devolución por el servicio. El Valor de la devolucion es"
        ):
            transaccion_caja_registrar_cambio_tiempo_servicio_menor_tiempo(
                servicio_id=servicio_id,
                categoria_fraccion_tiempo_nueva_id=self.categoria_fraccion_tiempo_45.id,
                usuario_pdv_id=self.colaborador.usuario.id,
                valor_efectivo=110000
            )

    # endregion


class OperacionCajaServicesTests(TestCase):
    def setUp(self):
        from terceros.factories import AcompananteFactory, ColaboradorFactory, ProveedorFactory
        from puntos_venta.factories import PuntoVentaFactory
        from puntos_venta.services import punto_venta_abrir
        from terceros.services import (
            tercero_set_new_pin,
            tercero_registra_entrada
        )

        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)
        self.colaborador_pdv = ColaboradorFactory()
        tercero_set_new_pin(self.colaborador_pdv.id, '0000')
        tercero_registra_entrada(self.colaborador_pdv.id, '0000')
        punto_venta_abrir(
            usuario_pv_id=self.colaborador_pdv.usuario.id,
            punto_venta_id=self.punto_venta.id,
            base_inicial_efectivo=0
        )

        self.colaborador = ColaboradorFactory()
        tercero_set_new_pin(self.colaborador.id, '0000')
        tercero_registra_entrada(self.colaborador.id, '0000')

        self.acompanante = AcompananteFactory()
        tercero_set_new_pin(self.acompanante.id, '0000')
        tercero_registra_entrada(self.acompanante.id, '0000')

        self.proveedor = ProveedorFactory()

    def test_operacion_caja_acompanante(self):
        from ..factories import ConceptoOperacionCajaFactory
        from ..services import operacion_caja_crear, operacion_caja_generar_recibo
        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='I',
            grupo='A'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            tercero_id=self.acompanante.id,
            valor=23000,
            descripcion='hola',
        )
        self.assertEqual(operacion_caja.valor, 23000)
        self.assertIsNotNone(operacion_caja.cuenta)

        comprobante = operacion_caja_generar_recibo(operacion_caja.id)
        comprobante.write_pdf(
            target='media/pruebas_pdf/comprobante_operacion_caja_egreso_acompanante.pdf'
        )

        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='E',
            grupo='A'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            tercero_id=self.acompanante.id,
            valor=18500,
            descripcion='hola',
            observacion='hola'
        )

        comprobante = operacion_caja_generar_recibo(operacion_caja.id)
        comprobante.write_pdf(
            target='media/pruebas_pdf/comprobante_operacion_caja_ingreso_acompanante.pdf'
        )
        self.assertEqual(operacion_caja.valor, -18500)
        self.assertIsNotNone(operacion_caja.cuenta)

    def test_operacion_caja_transacciones(self):
        from ..factories import ConceptoOperacionCajaFactory
        from ..services import operacion_caja_crear
        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='I',
            grupo='A'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            tercero_id=self.acompanante.id,
            valor=1000,
            descripcion='hola',
            observacion='hola'
        )
        transaccion_caja = operacion_caja.transacciones_caja.last()
        self.assertEqual(transaccion_caja.tipo, 'I')
        self.assertEqual(transaccion_caja.tipo_dos, 'OPERA_CAJA')
        self.assertEqual(transaccion_caja.valor_efectivo, 1000)

        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='E',
            grupo='A'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            tercero_id=self.acompanante.id,
            valor=2000,
            descripcion='hola',
            observacion='hola'
        )
        self.assertEqual(operacion_caja.transacciones_caja.all().count(), 1)
        transaccion_caja = operacion_caja.transacciones_caja.last()
        self.assertEqual(transaccion_caja.tipo, 'E')
        self.assertEqual(transaccion_caja.tipo_dos, 'OPERA_CAJA')
        self.assertEqual(transaccion_caja.valor_efectivo, -2000)

    def test_operacion_caja_colaborador(self):
        from ..factories import ConceptoOperacionCajaFactory
        from ..services import operacion_caja_crear
        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='I',
            grupo='C'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            tercero_id=self.colaborador.id,
            valor=1000,
            descripcion='hola',
            observacion='hola'
        )
        self.assertEqual(operacion_caja.valor, 1000)
        self.assertIsNotNone(operacion_caja.cuenta)

        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='E',
            grupo='C'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            tercero_id=self.colaborador.id,
            valor=1000,
            descripcion='hola',
            observacion='hola'
        )
        self.assertEqual(operacion_caja.valor, -1000)
        self.assertIsNotNone(operacion_caja.cuenta)

    def test_operacion_caja_proveedor(self):
        from ..factories import ConceptoOperacionCajaFactory
        from ..services import operacion_caja_crear
        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='I',
            grupo='P'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            tercero_id=self.proveedor.id,
            valor=1000,
            descripcion='hola',
            observacion='hola'
        )
        self.assertEqual(operacion_caja.valor, 1000)
        self.assertIsNone(operacion_caja.cuenta)

        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='E',
            grupo='P'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            tercero_id=self.proveedor.id,
            valor=1000,
            descripcion='hola',
            observacion='hola'
        )
        self.assertEqual(operacion_caja.valor, -1000)
        self.assertIsNone(operacion_caja.cuenta)

    def test_operacion_caja_taxi(self):
        from ..factories import ConceptoOperacionCajaFactory
        from ..services import operacion_caja_crear
        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='I',
            grupo='T'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            valor=1000,
            descripcion='hola',
            observacion='hola'
        )
        self.assertEqual(operacion_caja.valor, 1000)
        self.assertIsNone(operacion_caja.cuenta)

        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='E',
            grupo='T'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            valor=1000,
            descripcion='hola',
            observacion='hola'
        )
        self.assertEqual(operacion_caja.valor, -1000)
        self.assertIsNone(operacion_caja.cuenta)

    def test_operacion_caja_otro(self):
        from ..factories import ConceptoOperacionCajaFactory
        from ..services import operacion_caja_crear
        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='I',
            grupo='O'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            valor=1000,
            descripcion='hola',
            observacion='hola'
        )
        self.assertEqual(operacion_caja.valor, 1000)
        self.assertIsNone(operacion_caja.cuenta)

        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='E',
            grupo='O'
        )
        operacion_caja = operacion_caja_crear(
            concepto_id=concepto_operacion.id,
            usuario_pdv_id=self.colaborador_pdv.usuario.id,
            valor=1000,
            descripcion='hola',
            observacion='hola'
        )
        self.assertEqual(operacion_caja.valor, -1000)
        self.assertIsNone(operacion_caja.cuenta)

    def test_operacion_caja_colaborador_creador_punto_venta_turno(self):
        from ..factories import ConceptoOperacionCajaFactory
        from ..services import operacion_caja_crear

        turno = self.colaborador_pdv.turno_punto_venta_abierto
        turno.finish = timezone.now()
        turno.save()

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Quien crea de la operación debe tener un turno de punto de venta abierto'}"
        ):
            concepto_operacion = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='A'
            )
            operacion_caja_crear(
                concepto_id=concepto_operacion.id,
                usuario_pdv_id=self.colaborador_pdv.usuario.id,
                tercero_id=self.acompanante.id,
                valor=1000,
                descripcion='hola',
                observacion='hola'
            )

    def test_operacion_caja_valor_solo_positivo(self):
        from ..factories import ConceptoOperacionCajaFactory
        from ..services import operacion_caja_crear
        concepto_operacion = ConceptoOperacionCajaFactory(
            tipo='E',
            grupo='T'
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El valor ingresado debe ser positivo mayor a cero'}"
        ):
            operacion_caja_crear(
                concepto_id=concepto_operacion.id,
                usuario_pdv_id=self.colaborador_pdv.usuario.id,
                valor=-1000,
                descripcion='hola',
                observacion='hola'
            )

    def test_operacion_caja_colaborador_acompanante_presentes(self):
        from ..factories import ConceptoOperacionCajaFactory
        from ..services import operacion_caja_crear
        from terceros.services import tercero_registra_salida, tercero_registra_entrada

        tercero_registra_salida(self.colaborador_pdv.id, '0000')
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Quien crea de la operación debe estar presente'}"
        ):
            concepto_operacion = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='A'
            )
            operacion_caja_crear(
                concepto_id=concepto_operacion.id,
                usuario_pdv_id=self.colaborador_pdv.usuario.id,
                tercero_id=self.acompanante.id,
                valor=1000,
                descripcion='hola',
                observacion='hola'
            )

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'A quien se le crea la operación debe estar presente.'}"
        ):
            tercero_registra_entrada(self.colaborador_pdv.id, '0000')
            tercero_registra_salida(self.acompanante.id, '0000')
            concepto_operacion = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='A'
            )
            operacion_caja_crear(
                concepto_id=concepto_operacion.id,
                usuario_pdv_id=self.colaborador_pdv.usuario.id,
                tercero_id=self.acompanante.id,
                valor=1000,
                descripcion='hola',
                observacion='hola'
            )

        usuario = self.colaborador_pdv.usuario
        self.colaborador_pdv.usuario = None
        self.colaborador_pdv.save()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Quien crea la operación debe tener un tercero'}"
        ):
            concepto_operacion = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='A'
            )
            operacion_caja_crear(
                concepto_id=concepto_operacion.id,
                usuario_pdv_id=usuario.id,
                tercero_id=self.colaborador_pdv.id,
                valor=1000,
                descripcion='hola',
                observacion='hola'
            )

    def test_operacion_caja_grupos(self):
        from ..factories import ConceptoOperacionCajaFactory
        from ..services import operacion_caja_crear
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Un tipo de operacion de caja para acompañante solo debe ser creada para un acompañante'}"
        ):
            concepto_operacion = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='A'
            )
            operacion_caja_crear(
                concepto_id=concepto_operacion.id,
                usuario_pdv_id=self.colaborador_pdv.usuario.id,
                tercero_id=self.proveedor.id,
                valor=1000,
                descripcion='hola',
                observacion='hola'
            )

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Un tipo de operacion de caja para colaborador solo debe ser creada para un colaborador'}"
        ):
            concepto_operacion = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='C'
            )
            operacion_caja_crear(
                concepto_id=concepto_operacion.id,
                usuario_pdv_id=self.colaborador_pdv.usuario.id,
                tercero_id=self.proveedor.id,
                valor=1000,
                descripcion='hola',
                observacion='hola'
            )

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Un tipo de operacion de caja para proveedor solo debe ser creada para un proveedor'}"
        ):
            concepto_operacion = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='P'
            )
            operacion_caja_crear(
                concepto_id=concepto_operacion.id,
                usuario_pdv_id=self.colaborador_pdv.usuario.id,
                tercero_id=self.acompanante.id,
                valor=1000,
                descripcion='hola',
                observacion='hola'
            )

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Para el concepto seleccionado se requiere un tercero'}"
        ):
            concepto_operacion = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='A'
            )
            operacion_caja_crear(
                concepto_id=concepto_operacion.id,
                usuario_pdv_id=self.colaborador_pdv.usuario.id,
                valor=1000,
                descripcion='hola',
                observacion='hola'
            )

        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'Para los conceptos Otro y Taxi no se utiliza tercero'}"
        ):
            concepto_operacion = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='O'
            )
            operacion_caja_crear(
                concepto_id=concepto_operacion.id,
                usuario_pdv_id=self.colaborador_pdv.usuario.id,
                tercero_id=self.acompanante.id,
                valor=1000,
                descripcion='hola',
                observacion='hola'
            )
