from django.test import TestCase
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from ..services import (
    servicio_crear_nuevo,
    servicio_iniciar,
    servicio_terminar
)
from faker import Faker

faker = Faker()


# TODO: Faltan hacer las pruebas de los movimientos de dinero y bitacora en cada servicio

class ServiciosServicesTests(TestCase):
    def setUp(self):
        from usuarios.factories import UserFactory
        from terceros.factories import AcompananteFactory, ColaboradorFactory
        from terceros.services import acompanante_crear, tercero_set_new_pin, tercero_registra_entrada
        from terceros_acompanantes.factories import (
            CategoriaFraccionTiempoFactory,
            FraccionTiempoFactory,
            CategoriaAcompananteFactory
        )
        from puntos_venta.factories import PuntoVentaFactory
        from puntos_venta.services import punto_venta_abrir
        from habitaciones.factories import HabitacionFactory

        self.colaborador = ColaboradorFactory()
        self.colaborador, pin = tercero_set_new_pin(tercero_id=self.colaborador.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=self.colaborador.id, raw_pin='0000')
        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)

        self.punto_venta, self.punto_venta_turno = punto_venta_abrir(
            punto_venta_id=self.punto_venta.id,
            usuario_pv_id=self.colaborador.usuario.id
        )

        self.habitacion_uno = HabitacionFactory()
        self.habitacion_dos = HabitacionFactory()
        self.usuario = UserFactory()
        self.tercero_base = AcompananteFactory.stub()
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
        self.acompanante_base = AcompananteFactory.build(
            categoria_modelo=self.categoria_modelo
        )
        self.acompanante_base.pop('es_acompanante')
        self.acompanante_base.pop('usuario')
        self.acompanante = acompanante_crear(self.acompanante_base)
        self.acompanante, pin = tercero_set_new_pin(tercero_id=self.acompanante.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=self.acompanante.id, raw_pin='0000')

    # region servicio_crear_nuevo
    def test_servicio_crear_nuevo(self):
        from servicios.models import Servicio
        self.assertTrue(self.habitacion_uno.estado == 0)
        self.punto_venta.abierto = True
        self.punto_venta.save()

        count = Servicio.objects.filter(estado=0).count()
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.assertEqual(servicio.comision, 0)
        self.assertEqual(
            int(servicio.valor_habitacion),
            int(self.habitacion_uno.tipo.valor_antes_impuestos)
        )
        self.assertEqual(int(servicio.valor_iva_habitacion), int(self.habitacion_uno.tipo.impuesto))
        count_dos = Servicio.objects.filter(estado=0).count()
        self.assertEqual(count + 1, count_dos)
        self.habitacion_uno.refresh_from_db()
        self.assertTrue(self.habitacion_uno.estado == 1)

    def test_servicio_crear_nuevo_con_comision(self):
        from servicios.models import Servicio
        self.assertTrue(self.habitacion_uno.estado == 0)
        self.punto_venta.abierto = True
        self.punto_venta.save()

        tipo_habitacion = self.habitacion_uno.tipo
        tipo_habitacion.comision = 5000
        tipo_habitacion.save()

        count = Servicio.objects.filter(estado=0).count()
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.assertEqual(servicio.comision, 5000)
        self.assertEqual(
            int(servicio.valor_habitacion),
            int(self.habitacion_uno.tipo.valor_antes_impuestos) - 5000
        )
        self.assertEqual(int(servicio.valor_iva_habitacion), int(self.habitacion_uno.tipo.impuesto))
        count_dos = Servicio.objects.filter(estado=0).count()
        self.assertEqual(count + 1, count_dos)
        self.habitacion_uno.refresh_from_db()
        self.assertTrue(self.habitacion_uno.estado == 1)

    def test_servicio_crear_nuevo_solo_acompanante(self):
        self.acompanante.es_acompanante = False
        self.acompanante.save()
        with self.assertRaisesMessage(
                ValidationError,
                'No se puede crear un servicio para un tercero que no sea acompanante'
        ):
            servicio_crear_nuevo(
                habitacion_id=self.habitacion_uno.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_crear_nuevo_solo_punto_venta_abierto(self):
        self.punto_venta.abierto = False
        self.punto_venta.save()
        with self.assertRaisesMessage(ValidationError, 'No se pueden crear servicios desde un punto de venta cerrado'):
            servicio_crear_nuevo(
                habitacion_id=self.habitacion_uno.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_crear_nuevo_misma_modelo_diferentes_habitaciones(self):
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_iniciar(
            servicio_id=servicio_inicial.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden crear servicios para una habitacion diferente a la que esta actualmente'
        ):
            servicio_crear_nuevo(
                habitacion_id=self.habitacion_dos.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_crear_nuevo_fraccion_tiempo_no_perteneciente(self):
        from terceros_acompanantes.factories import CategoriaFraccionTiempoFactory
        categoria_fraccion_tiempo_nueva = CategoriaFraccionTiempoFactory(fraccion_tiempo=self.fraccion_tiempo_45)
        with self.assertRaisesMessage(
                ValidationError,
                'La categoria de la tarifa seleccionada no coincide con la categoria de la modelo seleccionada'
        ):
            servicio_crear_nuevo(
                habitacion_id=self.habitacion_uno.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=categoria_fraccion_tiempo_nueva.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_crear_nuevo_sin_registro_acceso(self):
        # valida que no se pueda crear un servicio a menos que haya hecho registro de acceso
        from terceros.services import tercero_registra_salida
        tercero_registra_salida(self.acompanante.id, '0000')
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden crear servicios para acompanantes que no esten presentes'
        ):
            servicio_crear_nuevo(
                habitacion_id=self.habitacion_uno.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_crear_nuevo_habitacion_solo_estado_disponible_ocupada(self):
        self.habitacion_uno.estado = 0
        self.habitacion_uno.save()
        servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.habitacion_uno.estado = 1
        self.habitacion_uno.save()
        servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        self.habitacion_uno.estado = 4
        self.habitacion_uno.save()

        # Valida que no se puedan crear servicios en habitaciones con estados diferentes a disponible y ocupado
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden crear servicios para habitaciones con estados diferentes a ocupado y disponible'
        ):
            servicio_crear_nuevo(
                habitacion_id=self.habitacion_uno.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

        self.habitacion_uno.estado = 3
        self.habitacion_uno.save()

        # Valida que no se puedan crear servicios en habitaciones con estados diferentes a disponible y ocupado
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden crear servicios para habitaciones con estados diferentes a ocupado y disponible'
        ):
            servicio_crear_nuevo(
                habitacion_id=self.habitacion_uno.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_crear_nuevo_misma_modelo_habitaciones_iguales(self):
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_iniciar(
            servicio_id=servicio_inicial.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_siguiente = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_siguiente = servicio_iniciar(
            servicio_id=servicio_siguiente.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        # Valida que cuando se vaya a crear más de un servicio, para una misma modelo,
        # el segundo o siguente tenga como anterior a inmediatamente anterior
        self.assertEqual(servicio_inicial.id, servicio_siguiente.servicio_anterior.id)

    # endregion

    # region servicio_iniciar
    def test_servicio_iniciar(self):
        self.assertTrue(self.habitacion_uno.estado == 0)
        self.assertTrue(self.acompanante.estado == 0)
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.habitacion_uno.refresh_from_db()
        self.acompanante.refresh_from_db()
        self.assertTrue(self.habitacion_uno.estado == 1)
        self.assertTrue(self.acompanante.estado == 1)

    def test_servicio_iniciar_modelo_servicios_consecutivos(self):
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        # Revisa que las horas de inicio de los servicios futuros coincidan con los anteriores
        self.assertEqual(servicio2.hora_inicio, servicio2.servicio_anterior.hora_final)
        self.assertEqual(
            (int((servicio2.hora_final - servicio2.servicio_anterior.hora_final).seconds / 60)),
            self.categoria_fraccion_tiempo_30.fraccion_tiempo.minutos
        )
        self.habitacion_uno.refresh_from_db()
        self.acompanante.refresh_from_db()
        self.assertTrue(self.habitacion_uno.estado == 1)
        self.assertTrue(self.acompanante.estado == 1)

    def test_servicio_iniciar_solo_habitaciones_disponibles_o_ocupadas(self):
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.habitacion_uno.estado = 0
        self.habitacion_uno.save()
        servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        self.habitacion_uno.estado = 1
        self.habitacion_uno.save()
        servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        self.habitacion_uno.estado = 3
        self.habitacion_uno.save()
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden iniciar servicios en una habitacion en estados diferentes a ocupado y disponible'
        ):
            servicio_iniciar(
                servicio_id=servicio.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

        self.habitacion_uno.estado = 4
        self.habitacion_uno.save()
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden iniciar servicios en una habitacion en estados diferentes a ocupado y disponible'
        ):
            servicio_iniciar(
                servicio_id=servicio.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_iniciar_solo_punto_venta_abierto(self):
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.punto_venta.abierto = False
        self.punto_venta.save()
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden iniciar servicios desde un punto de venta cerrado'
        ):
            servicio_iniciar(
                servicio_id=servicio.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_iniciar_hora_final_adecuada(self):
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        diferencia = (servicio.hora_final - servicio.hora_inicio).seconds / 60

        self.assertEqual(diferencia, self.categoria_fraccion_tiempo_30.fraccion_tiempo.minutos)
        self.assertGreater(servicio.hora_final, servicio.hora_inicio)

    # endregion

    # region servicio_terminar

    def test_servicio_terminar(self):
        self.assertTrue(self.habitacion_uno.estado == 0)
        self.assertTrue(self.acompanante.estado == 0)
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_inicial = servicio_iniciar(
            servicio_id=servicio_inicial.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_inicial = servicio_terminar(
            servicio_id=servicio_inicial.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        # Validad que haya colocado estado 2, el cuál es terminado, en el registro terminado
        self.habitacion_uno.refresh_from_db()
        self.acompanante.refresh_from_db()
        self.assertTrue(servicio_inicial.estado == 2)
        self.assertTrue(self.habitacion_uno.estado == 2)
        self.assertTrue(self.acompanante.estado == 0)

    def test_servicio_terminar_solo_punto_venta_abierto(self):
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.punto_venta.abierto = False
        self.punto_venta.save()
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden terminar servicios desde un punto de venta cerrado'
        ):
            servicio_terminar(
                servicio_id=servicio.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_terminar_solo_servicios_estado_ocupado(self):
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden terminar el servicio en estado diferente a en servicio'
        ):
            servicio_terminar(
                servicio_id=servicio_inicial.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_terminar_sin_servicio_siguiente(self):
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_inicial = servicio_iniciar(
            servicio_id=servicio_inicial.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_iniciar(
            servicio_id=servicio_dos.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        # Evalua que no se pueda eliminar servicios teniendo servicios siguientes aún
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden terminar el servicio sin terminar los siguiente primero'
        ):
            servicio_terminar(
                servicio_id=servicio_inicial.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_terminar_elimina_el_actual_como_anterior(self):
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_iniciar(
            servicio_id=servicio_inicial.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_iniciar(
            servicio_id=servicio_dos.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_dos = servicio_terminar(
            servicio_id=servicio_dos.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        # Valida que haya eliminado el anterior de el terminado
        self.assertIsNone(servicio_dos.servicio_anterior)

    # endregion

    # region servicio_calcular_hora_final
    def test_servicio_calcular_hora_final(self):
        from ..services import servicio_calcular_hora_final
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_inicial = servicio_iniciar(
            servicio_id=servicio_inicial.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        hora_ahora = timezone.now()
        hora_final = servicio_calcular_hora_final(servicio_id=servicio_inicial.id, hora_inicio=hora_ahora)
        diferencia = (hora_final - hora_ahora).seconds / 60
        self.assertEqual(diferencia, self.categoria_fraccion_tiempo_30.fraccion_tiempo.minutos)

    # endregion

    # region servicio_cambiar_tiempo
    def test_servicio_cambiar_tiempo_aumento(self):
        from ..services import servicio_cambiar_tiempo
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_cambiar_tiempo(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            valor_efectivo=80000,
            valor_tarjeta=20000,
            nro_autorizacion='2545',
            franquicia='COSA'
        )

        self.assertEqual(servicio.hora_inicio, servicio2.hora_inicio)
        self.assertNotEqual(servicio.hora_final, servicio2.hora_final)
        cambio_minutos_reales = int((servicio2.hora_final - servicio.hora_final).seconds / 60)
        cambio_minutos_estimados = self.categoria_fraccion_tiempo_60.fraccion_tiempo.minutos - self.categoria_fraccion_tiempo_30.fraccion_tiempo.minutos
        self.assertEqual(cambio_minutos_reales, cambio_minutos_estimados)
        self.assertEqual(servicio2.tiempo_minutos, self.categoria_fraccion_tiempo_60.fraccion_tiempo.minutos)

    def test_servicio_cambiar_tiempo_solo_punto_venta_abierto(self):
        from ..services import servicio_cambiar_tiempo
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.punto_venta.abierto = False
        self.punto_venta.save()

        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden cambiar tiempo en un servicios desde un punto de venta cerrado'
        ):
            servicio_cambiar_tiempo(
                servicio_id=servicio.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
                valor_efectivo=120000,
                valor_tarjeta=0,
                nro_autorizacion='2545',
                franquicia='COSA'
            )

    def test_servicio_cambiar_tiempo_disminucion(self):
        from ..services import servicio_cambiar_tiempo
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_cambiar_tiempo(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            valor_efectivo=50000,
            valor_tarjeta=0,
            nro_autorizacion='2545',
            franquicia='COSA'
        )

        self.assertEqual(servicio.hora_inicio, servicio2.hora_inicio)
        self.assertNotEqual(servicio.hora_final, servicio2.hora_final)
        cambio_minutos_reales = int((servicio.hora_final - servicio2.hora_final).seconds / 60)
        cambio_minutos_estimados = self.categoria_fraccion_tiempo_60.fraccion_tiempo.minutos - self.categoria_fraccion_tiempo_45.fraccion_tiempo.minutos
        self.assertEqual(cambio_minutos_reales, cambio_minutos_estimados)
        self.assertEqual(servicio2.tiempo_minutos, self.categoria_fraccion_tiempo_45.fraccion_tiempo.minutos)

    def test_servicio_cambiar_tiempo_aumento_varios(self):
        from ..services import servicio_cambiar_tiempo
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_iniciar(
            servicio_id=servicio2.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio1_2 = servicio_cambiar_tiempo(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            valor_efectivo=70000,
            valor_tarjeta=30000,
            nro_autorizacion='2545',
            franquicia='COSA'
        )

        cambio_minutos_reales = int((servicio1_2.hora_final - servicio.hora_final).seconds / 60)
        cambio_minutos_estimados = self.categoria_fraccion_tiempo_60.fraccion_tiempo.minutos - self.categoria_fraccion_tiempo_30.fraccion_tiempo.minutos
        servicio2.refresh_from_db()
        self.assertEqual(
            int((servicio2.hora_final - servicio1_2.servicio_siguiente.hora_final).seconds / 60),
            cambio_minutos_estimados
        )
        self.assertEqual(servicio2.hora_inicio, servicio1_2.hora_final)
        self.assertEqual(servicio.hora_inicio, servicio1_2.hora_inicio)
        self.assertNotEqual(servicio.hora_final, servicio1_2.hora_final)
        self.assertEqual(cambio_minutos_reales, cambio_minutos_estimados)
        self.assertEqual(servicio1_2.tiempo_minutos, self.categoria_fraccion_tiempo_60.fraccion_tiempo.minutos)

    def test_servicio_cambiar_tiempo_disminucion_varios(self):
        from ..services import servicio_cambiar_tiempo
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_iniciar(
            servicio_id=servicio2.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio1_2 = servicio_cambiar_tiempo(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            valor_efectivo=100000,
            valor_tarjeta=0,
            nro_autorizacion='2545',
            franquicia='COSA'
        )

        cambio_minutos_reales = int((servicio.hora_final - servicio1_2.hora_final).seconds / 60)
        cambio_minutos_estimados = self.categoria_fraccion_tiempo_60.fraccion_tiempo.minutos - self.categoria_fraccion_tiempo_30.fraccion_tiempo.minutos
        servicio2.refresh_from_db()
        self.assertEqual(
            int((servicio1_2.servicio_siguiente.hora_final - servicio2.hora_final).seconds / 60),
            cambio_minutos_estimados
        )
        self.assertEqual(servicio2.hora_inicio, servicio1_2.hora_final)
        self.assertEqual(servicio.hora_inicio, servicio1_2.hora_inicio)
        self.assertNotEqual(servicio.hora_final, servicio1_2.hora_final)
        self.assertEqual(cambio_minutos_reales, cambio_minutos_estimados)
        self.assertEqual(servicio1_2.tiempo_minutos, self.categoria_fraccion_tiempo_30.fraccion_tiempo.minutos)

    # endregion

    # region servicio_solicitar_anular
    def test_servicio_solicitar_anular(self):
        from ..services import servicio_solicitar_anular
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_solicitar_anular(
            servicio_id=servicio.id,
            observacion_anulacion='La Razón',
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.assertEqual(servicio.estado, 4)

    def test_servicio_solicitar_anular_solo_punto_venta_abierto(self):
        from ..services import servicio_solicitar_anular
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.punto_venta.abierto = False
        self.punto_venta.save()
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden solicitar anular un servicios desde un punto de venta cerrado'
        ):
            servicio_solicitar_anular(
                servicio_id=servicio.id,
                observacion_anulacion='La Razón',
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_solicitar_anular_solo_en_servicio(self):
        from ..services import servicio_solicitar_anular
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        with self.assertRaisesMessage(ValidationError, 'Sólo se pueden anular servicios en estado en servicio'):
            servicio_solicitar_anular(
                servicio_id=servicio.id,
                observacion_anulacion='La Razón',
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_solicitar_anular_servicio_inicial_con_siguiente(self):
        from ..services import servicio_solicitar_anular
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_iniciar(
            servicio_id=servicio2.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_solicitar_anular(
            servicio_id=servicio.id,
            observacion_anulacion='La Razón',
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2.refresh_from_db()
        self.assertEqual(servicio.estado, 4)
        self.assertEqual(servicio.hora_inicio, servicio2.hora_inicio)

    def test_servicio_solicitar_anular_servicio_inicial_con_siguientes_varios(self):
        from ..services import servicio_solicitar_anular
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_iniciar(
            servicio_id=servicio2.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio3 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio3 = servicio_iniciar(
            servicio_id=servicio3.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio4 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio4 = servicio_iniciar(
            servicio_id=servicio4.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio.refresh_from_db()
        self.assertEqual(servicio.servicio_siguiente.id, servicio2.id)
        servicio = servicio_solicitar_anular(
            servicio_id=servicio.id,
            observacion_anulacion='La Razón',
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio2.refresh_from_db()
        self.assertIsNone(servicio2.servicio_anterior)
        servicio3.refresh_from_db()
        servicio4.refresh_from_db()
        self.assertEqual(servicio.estado, 4)
        self.assertEqual(servicio.hora_inicio, servicio2.hora_inicio)
        self.assertEqual(servicio3.hora_inicio, servicio2.hora_final)
        self.assertEqual(servicio4.hora_inicio, servicio3.hora_final)

    def test_servicio_solicitar_anular_servicio_final_con_anteriores_varios(self):
        from ..services import servicio_solicitar_anular
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_iniciar(
            servicio_id=servicio2.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio3 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio3 = servicio_iniciar(
            servicio_id=servicio3.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio4 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio4 = servicio_iniciar(
            servicio_id=servicio4.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.assertEqual(servicio4.servicio_anterior.id, servicio3.id)
        servicio4 = servicio_solicitar_anular(
            servicio_id=servicio4.id,
            observacion_anulacion='La Razón',
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.assertIsNone(servicio4.servicio_anterior)
        self.assertEqual(servicio4.estado, 4)

    def test_servicio_solicitar_anular_servicio_intermedio_con_siguientes_y_anteriores(self):
        from ..services import servicio_solicitar_anular
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_iniciar(
            servicio_id=servicio2.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio3 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio3 = servicio_iniciar(
            servicio_id=servicio3.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio4 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio4 = servicio_iniciar(
            servicio_id=servicio4.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio5 = servicio_crear_nuevo(
            habitacion_id=self.habitacion_uno.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio5 = servicio_iniciar(
            servicio_id=servicio5.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio3.refresh_from_db()
        self.assertEqual(servicio3.servicio_siguiente.id, servicio4.id)
        self.assertEqual(servicio3.servicio_anterior.id, servicio2.id)

        servicio3 = servicio_solicitar_anular(
            servicio_id=servicio3.id,
            observacion_anulacion='La Razón',
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        self.assertIsNone(servicio3.servicio_anterior)
        servicio4.refresh_from_db()
        self.assertEqual(servicio3.hora_inicio, servicio4.hora_inicio)
        self.assertEqual(servicio4.servicio_anterior.id, servicio2.id)
        servicio.refresh_from_db()
        servicio2.refresh_from_db()
        servicio5.refresh_from_db()
        self.assertEqual(servicio.hora_final, servicio2.hora_inicio)
        self.assertEqual(servicio2.hora_final, servicio4.hora_inicio)
        self.assertEqual(servicio4.hora_final, servicio5.hora_inicio)
        self.assertEqual(servicio5.servicio_anterior.id, servicio4.id)
        self.assertEqual(servicio4.servicio_anterior.id, servicio2.id)
        self.assertEqual(servicio2.servicio_anterior.id, servicio.id)
    # endregion
