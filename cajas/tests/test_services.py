from django.test import TestCase
from faker import Faker
from rest_framework.exceptions import ValidationError

faker = Faker()


class TransaccionesCajaServicesServiciosTests(TestCase):
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
            usuario_pv_id=self.colaborador.usuario.id
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
