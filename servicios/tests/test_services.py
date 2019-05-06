from django.test import TestCase
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from dr_amor_app.utilities_tests.test_base import BaseTest
from ..services import (
    servicio_crear_nuevo,
    servicio_iniciar,
    servicio_terminar
)
from faker import Faker

faker = Faker()


class ServiciosServicesTests(BaseTest):
    def setUp(self):
        self.acompanantesSetUp()
        self.colaboradoresSetUp()
        self.habitacionesSetUp()

    # region servicio_crear_nuevo
    def test_servicio_crear_nuevo(self):
        from servicios.models import Servicio
        self.assertTrue(self.habitacion.estado == 0)

        valor_comision = self.habitacion.tipo.comision
        valor_habitacion = self.habitacion.tipo.valor_antes_impuestos - valor_comision
        valor_impuesto = self.habitacion.tipo.impuesto
        valor_servicio = self.categoria_fraccion_tiempo_30.valor

        valor_esperado_servicio = valor_habitacion + valor_impuesto + valor_comision + valor_servicio

        count = Servicio.objects.filter(estado=0).count()
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        self.assertEqual(int(valor_esperado_servicio), int(servicio.valor_total))

        self.assertEqual(int(servicio.comision), 0)
        self.assertEqual(int(servicio.valor_habitacion), int(valor_habitacion))
        self.assertEqual(int(servicio.valor_iva_habitacion), int(valor_impuesto))
        count_dos = Servicio.objects.filter(estado=0).count()
        self.assertEqual(count + 1, count_dos)
        self.habitacion.refresh_from_db()
        self.assertTrue(self.habitacion.estado == 1)

    def test_servicio_crear_nuevo_con_comision(self):
        from servicios.models import Servicio
        self.assertTrue(self.habitacion.estado == 0)

        tipo_habitacion = self.habitacion.tipo
        tipo_habitacion.comision = 5000
        tipo_habitacion.save()

        valor_comision = self.habitacion.tipo.comision
        valor_habitacion = self.habitacion.tipo.valor_antes_impuestos - valor_comision
        valor_impuesto = self.habitacion.tipo.impuesto
        valor_servicio = self.categoria_fraccion_tiempo_30.valor

        valor_esperado_servicio = valor_habitacion + valor_impuesto + valor_comision + valor_servicio

        count = Servicio.objects.filter(estado=0).count()
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        self.assertEqual(int(valor_esperado_servicio), int(servicio.valor_total))

        self.assertEqual(int(servicio.comision), 5000)
        self.assertEqual(int(servicio.valor_habitacion), int(valor_habitacion))
        self.assertEqual(int(servicio.valor_iva_habitacion), int(valor_impuesto))
        count_dos = Servicio.objects.filter(estado=0).count()
        self.assertEqual(count + 1, count_dos)
        self.habitacion.refresh_from_db()
        self.assertTrue(self.habitacion.estado == 1)

    def test_servicio_crear_nuevo_solo_acompanante(self):
        self.acompanante.es_acompanante = False
        self.acompanante.save()
        with self.assertRaisesMessage(
                ValidationError,
                'No se puede crear un servicio para un tercero que no sea acompanante'
        ):
            servicio_crear_nuevo(
                habitacion_id=self.habitacion.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_crear_nuevo_solo_punto_venta_abierto(self):
        self.punto_venta.abierto = False
        self.punto_venta.save()
        with self.assertRaisesMessage(ValidationError, 'No se pueden crear servicios desde un punto de venta cerrado'):
            servicio_crear_nuevo(
                habitacion_id=self.habitacion.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_crear_nuevo_misma_modelo_diferentes_habitaciones(self):
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
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
                habitacion_id=self.habitacion.id,
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
                habitacion_id=self.habitacion.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_crear_nuevo_habitacion_solo_estado_disponible_ocupada(self):
        self.habitacion.estado = 0
        self.habitacion.save()
        servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        self.habitacion.estado = 1
        self.habitacion.save()
        servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        self.habitacion.estado = 4
        self.habitacion.save()

        # Valida que no se puedan crear servicios en habitaciones con estados diferentes a disponible y ocupado
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden crear servicios para habitaciones con estados diferentes a ocupado y disponible'
        ):
            servicio_crear_nuevo(
                habitacion_id=self.habitacion.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

        self.habitacion.estado = 3
        self.habitacion.save()

        # Valida que no se puedan crear servicios en habitaciones con estados diferentes a disponible y ocupado
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden crear servicios para habitaciones con estados diferentes a ocupado y disponible'
        ):
            servicio_crear_nuevo(
                habitacion_id=self.habitacion.id,
                acompanante_id=self.acompanante.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_crear_nuevo_misma_modelo_habitaciones_iguales(self):
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_iniciar(
            servicio_id=servicio_inicial.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_siguiente = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
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
        self.assertTrue(self.habitacion.estado == 0)
        self.assertTrue(self.acompanante.estado == 0)

        servicios = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            iniciados=False,
            terminados=False,
            nro_servicios=5
        )
        servicios = servicios['acompanante_1']['servicios']
        for servicio in servicios:
            servicio_iniciar(
                servicio_id=servicio.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

        self.habitacion.refresh_from_db()
        self.acompanante.refresh_from_db()
        self.assertTrue(self.habitacion.estado == 1)
        self.assertTrue(self.acompanante.estado == 1)

    def test_servicio_iniciar_modelo_servicios_consecutivos(self):
        servicios_iniciados = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            acompanante_dos=self.acompanante_dos,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            iniciados=True,
            terminados=False,
            nro_servicios=5
        )

        servicios = servicios_iniciados['acompanante_1']['servicios']
        servicios_2 = servicios_iniciados['acompanante_2']['servicios']

        for servicio in reversed(servicios):
            if servicio.servicio_anterior:
                self.assertEqual(servicio.hora_inicio, servicio.servicio_anterior.hora_final)
                if servicio.tiempo_minutos == 30:
                    self.assertEqual(
                        (int((servicio.hora_final - servicio.servicio_anterior.hora_final).seconds / 60)),
                        self.categoria_fraccion_tiempo_30.fraccion_tiempo.minutos
                    )
                elif servicio.tiempo_minutos == 45:
                    self.assertEqual(
                        (int((servicio.hora_final - servicio.servicio_anterior.hora_final).seconds / 60)),
                        self.categoria_fraccion_tiempo_45.fraccion_tiempo.minutos
                    )
                elif servicio.tiempo_minutos == 60:
                    self.assertEqual(
                        (int((servicio.hora_final - servicio.servicio_anterior.hora_final).seconds / 60)),
                        self.categoria_fraccion_tiempo_60.fraccion_tiempo.minutos
                    )
        for servicio in reversed(servicios_2):
            if servicio.servicio_anterior:
                self.assertEqual(servicio.hora_inicio, servicio.servicio_anterior.hora_final)
                if servicio.tiempo_minutos == 30:
                    self.assertEqual(
                        (int((servicio.hora_final - servicio.servicio_anterior.hora_final).seconds / 60)),
                        self.categoria_fraccion_tiempo_30.fraccion_tiempo.minutos
                    )
                elif servicio.tiempo_minutos == 45:
                    self.assertEqual(
                        (int((servicio.hora_final - servicio.servicio_anterior.hora_final).seconds / 60)),
                        self.categoria_fraccion_tiempo_45.fraccion_tiempo.minutos
                    )
                elif servicio.tiempo_minutos == 60:
                    self.assertEqual(
                        (int((servicio.hora_final - servicio.servicio_anterior.hora_final).seconds / 60)),
                        self.categoria_fraccion_tiempo_60.fraccion_tiempo.minutos
                    )

    def test_servicio_iniciar_solo_habitaciones_disponibles_o_ocupadas(self):
        servicios = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            iniciados=False,
            terminados=False,
            nro_servicios=5
        )
        servicios = servicios['acompanante_1']['servicios']

        self.habitacion.estado = 3
        self.habitacion.save()
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden iniciar servicios en una habitacion en estados diferentes a ocupado y disponible'
        ):
            for servicio in servicios:
                servicio_iniciar(
                    servicio_id=servicio.id,
                    usuario_pdv_id=self.punto_venta.usuario_actual.id
                )

        self.habitacion.estado = 4
        self.habitacion.save()
        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden iniciar servicios en una habitacion en estados diferentes a ocupado y disponible'
        ):
            for servicio in servicios:
                servicio_iniciar(
                    servicio_id=servicio.id,
                    usuario_pdv_id=self.punto_venta.usuario_actual.id
                )

    def test_servicio_iniciar_solo_punto_venta_abierto(self):
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
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
            habitacion_id=self.habitacion.id,
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
        self.assertTrue(self.habitacion.estado == 0)
        self.assertTrue(self.acompanante.estado == 0)
        servicios_iniciados = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            iniciados=True,
            terminados=False,
            nro_servicios=5
        )

        servicios = servicios_iniciados['acompanante_1']['servicios']
        for servicio in reversed(servicios):
            servicio = servicio_terminar(
                servicio_id=servicio.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )
            self.assertTrue(servicio.estado == 2)
            servicio.refresh_from_db()
            self.assertTrue(servicio.estado == 2)

        self.habitacion.refresh_from_db()
        self.acompanante.refresh_from_db()
        self.assertTrue(self.habitacion.estado == 2)
        self.assertTrue(self.acompanante.estado == 0)

    def test_servicio_terminar_solo_punto_venta_abierto(self):
        servicios_iniciados = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            iniciados=True,
            terminados=False,
            nro_servicios=5
        )
        self.punto_venta.abierto = False
        self.punto_venta.save()

        servicios = servicios_iniciados['acompanante_1']['servicios']
        for servicio in reversed(servicios):
            with self.assertRaisesMessage(
                    ValidationError,
                    'No se pueden terminar servicios desde un punto de venta cerrado'
            ):
                servicio_terminar(
                    servicio_id=servicio.id,
                    usuario_pdv_id=self.punto_venta.usuario_actual.id
                )

    def test_servicio_terminar_sin_servicio_siguiente(self):
        servicios_iniciados = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            iniciados=True,
            terminados=False,
            nro_servicios=5
        )

        servicios = servicios_iniciados['acompanante_1']['servicios']
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No se pueden terminar el servicio sin terminar los siguiente primero'}"
        ):
            servicio_terminar(
                servicio_id=servicios[1].id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_servicio_terminar_solo_servicios_estado_ocupado(self):
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
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

    def test_servicio_terminar_elimina_el_actual_como_anterior(self):
        servicios_iniciados = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            iniciados=True,
            terminados=False,
            nro_servicios=5
        )

        servicios = servicios_iniciados['acompanante_1']['servicios']
        for servicio in reversed(servicios):
            servicio = servicio_terminar(
                servicio_id=servicio.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )
            self.assertIsNone(servicio.servicio_anterior)

    # endregion

    # region servicio_calcular_hora_final
    def test_servicio_calcular_hora_final(self):
        from ..services import servicio_calcular_hora_final
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
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
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        valor_esperado_anterior_servicio = self.categoria_fraccion_tiempo_30.valor
        valor_esperado_nuevo_servicio = self.categoria_fraccion_tiempo_60.valor
        valor_a_pagar_esperado = valor_esperado_nuevo_servicio - valor_esperado_anterior_servicio

        valor_servicio_anterior_efectivo = servicio.valor_servicio

        servicio2 = servicio_cambiar_tiempo(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            valor_efectivo=int(valor_a_pagar_esperado / 2),
            valor_tarjeta=valor_a_pagar_esperado - int(valor_a_pagar_esperado / 2),
            nro_autorizacion='2545',
            franquicia='COSA'
        )
        valor_servicio_nuevo_efectivo = servicio2.valor_servicio

        diferencia_efectiva = valor_servicio_nuevo_efectivo - valor_servicio_anterior_efectivo

        self.assertEqual(servicio2.valor_servicio, servicio.valor_servicio + valor_a_pagar_esperado)

        self.assertEqual(servicio.hora_inicio, servicio2.hora_inicio)
        self.assertNotEqual(servicio.hora_final, servicio2.hora_final)
        cambio_minutos_reales = int((servicio2.hora_final - servicio.hora_final).seconds / 60)
        cambio_minutos_estimados = self.categoria_fraccion_tiempo_60.fraccion_tiempo.minutos - self.categoria_fraccion_tiempo_30.fraccion_tiempo.minutos
        self.assertEqual(cambio_minutos_reales, cambio_minutos_estimados)
        self.assertEqual(servicio2.tiempo_minutos, self.categoria_fraccion_tiempo_60.fraccion_tiempo.minutos)

        ultima_transaccion_caja = servicio.transacciones_caja.last()
        self.assertEqual(ultima_transaccion_caja.tipo, 'I')

        self.assertEqual(
            ultima_transaccion_caja.valor_efectivo + ultima_transaccion_caja.valor_tarjeta,
            diferencia_efectiva
        )

    def test_servicio_cambiar_tiempo_mismo(self):
        from ..services import servicio_cambiar_tiempo
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'El tiempo solicitado y el actual del servicio es el mismo'}"
        ):
            servicio_cambiar_tiempo(
                servicio_id=servicio.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id,
                categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
                valor_efectivo=0,
                valor_tarjeta=0,
                nro_autorizacion='2545',
                franquicia='COSA'
            )

    def test_servicio_cambiar_tiempo_disminucion(self):
        from ..services import servicio_cambiar_tiempo
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        valor_esperado_anterior_servicio = self.categoria_fraccion_tiempo_60.valor
        valor_esperado_nuevo_servicio = self.categoria_fraccion_tiempo_45.valor
        valor_a_devolver_esperado = valor_esperado_anterior_servicio - valor_esperado_nuevo_servicio

        valor_servicio_anterior_efectivo = servicio.valor_servicio

        servicio2 = servicio_cambiar_tiempo(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_45.id,
            valor_efectivo=valor_a_devolver_esperado,
            valor_tarjeta=0,
            nro_autorizacion='2545',
            franquicia='COSA'
        )

        valor_servicio_nuevo_efectivo = servicio2.valor_servicio

        diferencia_efectiva = valor_servicio_anterior_efectivo - valor_servicio_nuevo_efectivo

        self.assertEqual(servicio2.valor_servicio, servicio.valor_servicio - valor_a_devolver_esperado)

        self.assertEqual(servicio.hora_inicio, servicio2.hora_inicio)
        self.assertNotEqual(servicio.hora_final, servicio2.hora_final)
        cambio_minutos_reales = int((servicio.hora_final - servicio2.hora_final).seconds / 60)
        cambio_minutos_estimados = self.categoria_fraccion_tiempo_60.fraccion_tiempo.minutos - self.categoria_fraccion_tiempo_45.fraccion_tiempo.minutos
        self.assertEqual(cambio_minutos_reales, cambio_minutos_estimados)
        self.assertEqual(servicio2.tiempo_minutos, self.categoria_fraccion_tiempo_45.fraccion_tiempo.minutos)

        ultima_transaccion_caja = servicio.transacciones_caja.last()
        self.assertEqual(ultima_transaccion_caja.tipo, 'E')

        self.assertEqual(ultima_transaccion_caja.valor_efectivo, -diferencia_efectiva)

    def test_servicio_cambiar_tiempo_aumento_varios(self):
        from ..services import servicio_cambiar_tiempo
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
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

    def test_servicio_cambiar_tiempo_solo_punto_venta_abierto(self):
        from ..services import servicio_cambiar_tiempo
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
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

    def test_servicio_cambiar_tiempo_disminucion_varios(self):
        from ..services import servicio_cambiar_tiempo
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
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
        from cajas.models import TransaccionCaja
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
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
        self.habitacion.refresh_from_db()
        self.assertEqual(servicio.estado, 4)
        self.assertEqual(self.habitacion.estado, 2)
        self.assertEqual(servicio.valor_iva_habitacion, 0)
        self.assertEqual(servicio.valor_habitacion, 0)
        self.assertEqual(servicio.valor_servicio, 0)
        self.assertEqual(servicio.comision, 0)

        ultima_transaccion_caja = servicio.transacciones_caja.last()
        self.assertEqual(ultima_transaccion_caja.tipo, 'E')

        transaccion_caja = TransaccionCaja.objects.filter(
            tipo='E',
            tipo_dos='SERVICIO',
            concepto__contains='Anulación de servicio por'
        ).last()
        self.assertIsNotNone(transaccion_caja)
        self.assertEqual(ultima_transaccion_caja.valor_efectivo, servicio.valor_total * -1)

    def test_servicio_solicitar_anular_con_siguiente(self):
        from ..services import servicio_solicitar_anular
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio = servicio_iniciar(
            servicio_id=servicio.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio2 = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
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
        self.assertEqual(servicio2.hora_inicio, servicio.hora_inicio)
        self.assertIsNone(servicio2.servicio_anterior)

    def test_servicio_solicitar_anular_solo_punto_venta_abierto(self):
        from ..services import servicio_solicitar_anular
        servicio = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
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
            habitacion_id=self.habitacion.id,
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

    def test_servicio_solicitar_anular_servicio_inicial_con_siguientes_varios(self):
        from ..services import servicio_solicitar_anular
        servicios_iniciados = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            iniciados=True,
            terminados=False,
            nro_servicios=5
        )

        servicios = servicios_iniciados['acompanante_1']['servicios']

        servicio_1 = servicios[1]
        tiempo_minutos_anulado = servicio_1.tiempo_minutos
        servicio_2 = servicios[2]
        servicio_1 = servicio_solicitar_anular(
            servicio_id=servicio_1.id,
            observacion_anulacion='La Razón',
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_2.refresh_from_db()
        self.assertEqual(servicio_1.estado, 4)
        self.assertEqual(servicio_1.hora_inicio, servicio_2.hora_inicio)
        servicio_ultimo = servicios[-1]

        tiempo_final_anterior = servicio_ultimo.hora_final
        servicio_ultimo.refresh_from_db()
        tiempo_final_nueva = servicio_ultimo.hora_final
        minutos_cambios = (tiempo_final_anterior - tiempo_final_nueva).seconds / 60
        self.assertEqual(minutos_cambios, tiempo_minutos_anulado)

    def test_servicio_solicitar_anular_servicio_final_con_anteriores_varios(self):
        from ..services import servicio_solicitar_anular
        servicios_iniciados = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            iniciados=True,
            terminados=False,
            nro_servicios=5
        )

        servicios = servicios_iniciados['acompanante_1']['servicios']

        servicio_ultimo = servicios[-1]
        servicio_ultimo = servicio_solicitar_anular(
            servicio_id=servicio_ultimo.id,
            observacion_anulacion='La Razón',
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        self.assertIsNone(servicio_ultimo.servicio_anterior)
        self.assertEqual(servicio_ultimo.estado, 4)

        for servicio in servicios:
            if servicio.estado == 1:
                hora_inicial_anterior = servicio.hora_inicio
                hora_final_anterior = servicio.hora_final
                servicio.refresh_from_db()
                self.assertEqual(servicio.hora_inicio, hora_inicial_anterior)
                self.assertEqual(servicio.hora_final, hora_final_anterior)

    def test_servicio_solicitar_anular_servicio_intermedio_con_siguientes_y_anteriores(self):
        from ..services import servicio_solicitar_anular
        servicios_iniciados = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            iniciados=True,
            terminados=False,
            nro_servicios=6
        )

        servicios = servicios_iniciados['acompanante_1']['servicios']

        servicio_3 = servicios[3]
        tiempo_minutos_anulado = servicio_3.tiempo_minutos
        servicio_3 = servicio_solicitar_anular(
            servicio_id=servicio_3.id,
            observacion_anulacion='La Razón',
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_ultimo = servicios[-1]
        tiempo_final_anterior = servicio_ultimo.hora_final

        self.assertIsNone(servicio_3.servicio_anterior)
        self.assertEqual(servicio_3.estado, 4)

        servicio_1 = servicios[1]
        hora_final_1 = servicio_1.hora_final
        servicio_1.refresh_from_db()
        self.assertEqual(hora_final_1, servicio_1.hora_final)

        servicio_2 = servicios[2]
        hora_final_2 = servicio_2.hora_final
        servicio_2.refresh_from_db()
        self.assertEqual(hora_final_2, servicio_2.hora_final)

        servicio_2 = servicios[2]
        servicio_4 = servicios[4]
        servicio_5 = servicios[5]

        self.assertNotEqual(servicio_4.servicio_anterior, servicio_2)
        self.assertNotEqual(servicio_4.hora_inicio, servicio_2.hora_final)
        servicio_4.refresh_from_db()
        self.assertEqual(servicio_4.servicio_anterior, servicio_2)
        self.assertEqual(servicio_4.hora_inicio, servicio_2.hora_final)

        servicio_5.refresh_from_db()
        self.assertEqual(servicio_5.servicio_anterior, servicio_4)
        self.assertEqual(servicio_5.hora_inicio, servicio_4.hora_final)

        servicio_ultimo.refresh_from_db()
        tiempo_final_nueva = servicio_ultimo.hora_final
        minutos_cambios = (tiempo_final_anterior - tiempo_final_nueva).seconds / 60
        self.assertEqual(minutos_cambios, tiempo_minutos_anulado)

    # endregion
