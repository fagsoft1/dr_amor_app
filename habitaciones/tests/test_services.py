import json

from rest_framework.exceptions import ValidationError

from cajas.models import TransaccionCaja
from ..factories import HabitacionFactory
from ..services import habitacion_cambiar_estado
from dr_amor_app.utilities_tests.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class HabitacionServicesTests(BaseTestsApi):
    def setUp(self):
        super().setUp()
        self.acompanantesSetUp()
        self.colaboradoresSetUp()
        self.habitacionesSetUp()
        self.url = '/api/habitaciones/'

        self.array_servicios = [
            {'tercero_id': self.acompanante.id, 'categoria_fraccion_tiempo_id': self.categoria_fraccion_tiempo_30.id},
            {'tercero_id': self.acompanante_dos.id,
             'categoria_fraccion_tiempo_id': self.categoria_fraccion_tiempo_45.id},
            {'tercero_id': self.acompanante_dos.id,
             'categoria_fraccion_tiempo_id': self.categoria_fraccion_tiempo_60.id},
            {'tercero_id': self.acompanante.id, 'categoria_fraccion_tiempo_id': self.categoria_fraccion_tiempo_60.id},
            {'tercero_id': self.acompanante.id, 'categoria_fraccion_tiempo_id': self.categoria_fraccion_tiempo_45.id},
        ]

    # region habitacion_cambiar_estado
    def test_habitacion_cambiar_estado_desde_ocupada(self):
        self.habitacion.estado = 1
        self.habitacion.save()
        habitacion = habitacion_cambiar_estado(self.habitacion.id, 0)
        self.assertEqual(1, habitacion.estado)
        habitacion = habitacion_cambiar_estado(habitacion.id, 1)
        self.assertEqual(1, habitacion.estado)
        habitacion = habitacion_cambiar_estado(habitacion.id, 3)
        self.assertEqual(1, habitacion.estado)
        habitacion = habitacion_cambiar_estado(habitacion.id, 2)
        self.assertEqual(2, habitacion.estado)

    def test_habitacion_cambiar_estado_desde_disponible(self):
        self.habitacion.estado = 0
        self.habitacion.save()
        habitacion = habitacion_cambiar_estado(self.habitacion.id, 1)
        self.assertEqual(1, habitacion.estado)
        habitacion = habitacion_cambiar_estado(habitacion.id, 2)
        self.assertEqual(2, habitacion.estado)
        habitacion = habitacion_cambiar_estado(habitacion.id, 3)
        self.assertEqual(3, habitacion.estado)

    def test_habitacion_cambiar_estado_desde_sucia(self):
        self.habitacion.estado = 2
        self.habitacion.save()
        with self.assertRaisesMessage(
                ValidationError,
                'No se puede cambiar de un estado sucia a uno ocupado'
        ):
            habitacion_cambiar_estado(self.habitacion.id, 1)
        habitacion = habitacion_cambiar_estado(self.habitacion.id, 0)
        self.assertEqual(habitacion.estado, 0)
        habitacion = habitacion_cambiar_estado(self.habitacion.id, 3)
        self.assertEqual(habitacion.estado, 3)

    def test_habitacion_cambiar_estado_desde_mantenimiento(self):
        self.habitacion.estado = 3
        self.habitacion.save()
        with self.assertRaisesMessage(
                ValidationError,
                'No se puede cambiar de un estado de mantenimiento a uno ocupado'
        ):
            habitacion_cambiar_estado(self.habitacion.id, 1)
        habitacion = habitacion_cambiar_estado(self.habitacion.id, 0)
        self.assertEqual(habitacion.estado, 0)
        habitacion = habitacion_cambiar_estado(self.habitacion.id, 2)
        self.assertEqual(habitacion.estado, 2)

    # endregion

    # region habitacion_terminar_servicios
    def test_habitacion_terminar_servicios(self):
        from ..services import habitacion_terminar_servicios
        servicios = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            acompanante_dos=self.acompanante_dos,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            terminados=False,
            iniciados=True,
            nro_servicios=5,
        )
        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        for servicio in servicios_acompanante_1:
            self.assertTrue(servicio.estado == 1)

        for servicio in servicios_acompanante_2:
            self.assertTrue(servicio.estado == 1)

        habitacion = habitacion_terminar_servicios(
            habitacion_id=self.habitacion.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        for servicio in servicios_acompanante_1:
            self.assertTrue(servicio.estado == 1)
            servicio.refresh_from_db()
            self.assertTrue(servicio.estado == 2)

        for servicio in servicios_acompanante_2:
            self.assertTrue(servicio.estado == 1)
            servicio.refresh_from_db()
            self.assertTrue(servicio.estado == 2)

        self.assertEqual(habitacion.estado, 2)

        self.acompanante.refresh_from_db()
        self.acompanante_dos.refresh_from_db()
        self.assertTrue(self.acompanante.estado == 0)
        self.assertTrue(self.acompanante_dos.estado == 0)

    def test_habitacion_terminar_servicios_solo_punto_venta_abierto(self):
        from ..services import habitacion_terminar_servicios
        self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            terminados=False,
            iniciados=True,
            nro_servicios=5,
            acompanante_dos=self.acompanante_dos
        )
        self.punto_venta.abierto = False
        self.punto_venta.save()

        with self.assertRaisesMessage(
                ValidationError,
                'No se pueden terminar servicios desde un punto de venta cerrado'
        ):
            habitacion_terminar_servicios(
                habitacion_id=self.habitacion.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    def test_habitacion_terminar_servicios_sin_servicios(self):
        from ..services import habitacion_terminar_servicios
        with self.assertRaisesMessage(
                ValidationError,
                'No hay servicios para terminar en la habitación número'
        ):
            habitacion_terminar_servicios(
                habitacion_id=self.habitacion.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id
            )

    # endregion

    # region habitacion_iniciar_servicios
    def test_habitacion_iniciar_servicios_cambiar_habitacion_api(self):
        from habitaciones.factories import HabitacionFactory
        habitacion_nueva = HabitacionFactory(tipo=self.habitacion.tipo)
        self.cambiar_token_admin(self.punto_venta.usuario_actual)
        response = self.detail_route_post(
            'iniciar_servicios',
            {
                'pago': json.dumps(
                    {
                        'valor_efectivo': int(800000),
                        'valor_tarjeta': int(200000),
                        'nro_autorizacion': 'asdfa',
                        'franquicia': 'visa'
                    }
                ),
                'servicios': json.dumps(self.array_servicios)
            },
            self.habitacion.id
        )
        result = response.data.get('result')
        self.assertEqual('Los servicios se han iniciado correctamente', result)

        from servicios.models import Servicio
        servicios_array_id = Servicio.objects.values_list('id', flat=True).filter(habitacion=self.habitacion, estado=1)
        response = self.detail_route_post(
            'cambiar_habitacion',
            {
                'nueva_habitacion_id': habitacion_nueva.id,
                'pago': json.dumps(
                    {
                        'valor_efectivo': 0,
                        'valor_tarjeta': 0,
                    }),
                'servicios_array_id': json.dumps(list(servicios_array_id))
            },
            self.habitacion.id
        )
        result = response.data.get('result')
        self.assertTrue('Se han cambiado los servicios para' in result)

    def test_habitacion_iniciar_servicios(self):
        from ..services import habitacion_iniciar_servicios
        from servicios.models import Servicio
        habitacion = habitacion_iniciar_servicios(
            usuario_pdv_id=self.punto_venta.usuario_actual.id,
            habitacion_id=self.habitacion.id,
            valor_efectivo=800000,
            valor_tarjeta=200000,
            nro_autorizacion='asdfa',
            franquicia='visa',
            servicios=self.array_servicios
        )
        valor_total_servicios = 0
        for servicio in habitacion.servicios.all():
            valor_total_servicios += servicio.valor_total

        self.assertEqual(valor_total_servicios, 800000 + 200000)

        count_dos = Servicio.objects.filter(habitacion_id=self.habitacion.id, estado=1).count()
        count_tres = self.habitacion.servicios.filter(estado=1).count()
        self.assertEqual(len(self.array_servicios), count_dos)
        self.assertEqual(count_tres, count_dos)

        transaccion_caja = TransaccionCaja.objects.filter(
            tipo='I',
            tipo_dos='SERVICIO',
            concepto__contains='Pago de servicios habitación'
        ).last()
        self.assertIsNotNone(transaccion_caja)
        self.assertEqual(transaccion_caja.valor_efectivo + transaccion_caja.valor_tarjeta, valor_total_servicios)

        self.cambiar_token_admin(self.punto_venta.usuario_actual)
        response = self.detail_route_post('terminar_servicios', {}, habitacion.id)
        result = response.data.get('result')
        self.assertTrue('Los servicios para habitacion' in result)
        self.assertTrue('se han terminado' in result)

    def test_habitacion_iniciar_servicios_valor_ingresado_efectivo_credito_igual_al_valor_total_servicios(self):
        from ..services import habitacion_iniciar_servicios
        with self.assertRaisesMessage(
                ValidationError,
                "'_error': 'El valor ingresado de forma de pago es diferente al valor total de los servicios. El Valor de los servicios es"
        ):
            habitacion_iniciar_servicios(
                habitacion_id=self.habitacion.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id,
                valor_efectivo=800000,
                valor_tarjeta=100000,
                nro_autorizacion='asdfa',
                franquicia='visa',
                servicios=self.array_servicios
            )

    def test_habitacion_iniciar_servicios_punto_venta_abierto(self):
        from ..services import habitacion_iniciar_servicios
        self.punto_venta.abierto = False
        self.punto_venta.save()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No se puede inciar servicios de habitación desde un punto de venta cerrado'}"
        ):
            habitacion_iniciar_servicios(
                habitacion_id=self.habitacion.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id,
                valor_efectivo=800000,
                valor_tarjeta=200000,
                nro_autorizacion='asdfa',
                franquicia='visa',
                servicios=self.array_servicios
            )

    def test_habitacion_iniciar_servicios_habitacion_solo_habitacion_disponible_ocupada(self):
        from ..services import habitacion_iniciar_servicios
        self.habitacion.estado = 3
        self.habitacion.save()
        with self.assertRaisesMessage(
                ValidationError,
                "{'_error': 'No se puede cambiar de un estado de mantenimiento a uno ocupado'}"
        ):
            habitacion_iniciar_servicios(
                habitacion_id=self.habitacion.id,
                usuario_pdv_id=self.punto_venta.usuario_actual.id,
                valor_efectivo=800000,
                valor_tarjeta=200000,
                nro_autorizacion='asdfa',
                franquicia='visa',
                servicios=self.array_servicios
            )

    # endregion

    # region habitacion_cambiar_de_habitacion
    def habitacion_cambiar_de_habitacion_igual_tarifa(
            self,
            habitacion_inicial,
            habitacion_nueva_igual_tarifa,
            comision=0
    ):
        from ..services import habitacion_cambiar_servicios_de_habitacion

        servicios = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=habitacion_inicial,
            punto_venta=self.punto_venta,
            terminados=True,
            iniciados=True,
            nro_servicios=5,
            acompanante_dos=self.acompanante_dos,
            comision=comision
        )
        array_servicios_acompanante_1 = servicios['acompanante_1']['array_servicios']
        array_servicios_acompanante_2 = servicios['acompanante_2']['array_servicios']

        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        habitacion_nueva, habitacion_anterior = habitacion_cambiar_servicios_de_habitacion(
            habitacion_anterior_id=habitacion_inicial.id,
            habitacion_nueva_id=habitacion_nueva_igual_tarifa.id,
            servicios_array_id=array_servicios_acompanante_1 + array_servicios_acompanante_2,
            punto_venta_id=self.punto_venta.id,
            usuario_id=self.punto_venta.usuario_actual.id,
            valor_efectivo=0,
            valor_tarjeta=0
        )

        diferencia_valor = habitacion_inicial.tipo.valor - habitacion_nueva_igual_tarifa.tipo.valor

        for servicio in servicios_acompanante_1:
            iva_anterior = int(servicio.valor_iva_habitacion)
            valor_habitacion_anterior = int(servicio.valor_habitacion)
            valor_comision_anterior = int(servicio.comision)
            valor_servicio_anterior = int(servicio.valor_servicio)
            valor_total_anterior = int(servicio.valor_total)
            servicio.refresh_from_db()
            iva_nuevo = int(servicio.valor_iva_habitacion)
            valor_habitacion_nuevo = int(servicio.valor_habitacion)
            valor_comision_nuevo = int(servicio.comision)
            valor_total_nuevo = int(servicio.valor_total)
            valor_servicio_nuevo = int(servicio.valor_servicio)

            self.assertEqual(valor_servicio_anterior, valor_servicio_nuevo)
            self.assertEqual(valor_total_nuevo - valor_total_anterior, diferencia_valor)
            self.assertEqual(iva_nuevo, int(habitacion_nueva.tipo.impuesto))
            self.assertEqual(iva_anterior, int(habitacion_anterior.tipo.impuesto))
            self.assertEqual(valor_habitacion_anterior,
                             int(habitacion_anterior.tipo.valor_antes_impuestos - habitacion_anterior.tipo.comision))
            self.assertEqual(valor_habitacion_nuevo,
                             int(habitacion_nueva.tipo.valor_antes_impuestos - habitacion_nueva.tipo.comision))
            self.assertEqual(valor_comision_anterior, habitacion_anterior.tipo.comision)
            self.assertEqual(valor_comision_nuevo, habitacion_nueva.tipo.comision)

        for servicio in servicios_acompanante_2:
            iva_anterior = int(servicio.valor_iva_habitacion)
            valor_habitacion_anterior = int(servicio.valor_habitacion)
            valor_comision_anterior = int(servicio.comision)
            valor_servicio_anterior = int(servicio.valor_servicio)
            valor_total_anterior = int(servicio.valor_total)
            servicio.refresh_from_db()
            iva_nuevo = int(servicio.valor_iva_habitacion)
            valor_habitacion_nuevo = int(servicio.valor_habitacion)
            valor_comision_nuevo = int(servicio.comision)
            valor_total_nuevo = int(servicio.valor_total)
            valor_servicio_nuevo = int(servicio.valor_servicio)

            self.assertEqual(valor_servicio_anterior, valor_servicio_nuevo)
            self.assertEqual(valor_total_nuevo - valor_total_anterior, diferencia_valor)
            self.assertEqual(iva_nuevo, int(habitacion_nueva.tipo.impuesto))
            self.assertEqual(iva_anterior, int(habitacion_anterior.tipo.impuesto))
            self.assertEqual(valor_habitacion_anterior,
                             int(habitacion_anterior.tipo.valor_antes_impuestos - habitacion_anterior.tipo.comision))
            self.assertEqual(valor_habitacion_nuevo,
                             int(habitacion_nueva.tipo.valor_antes_impuestos - habitacion_nueva.tipo.comision))
            self.assertEqual(valor_comision_anterior, habitacion_anterior.tipo.comision)
            self.assertEqual(valor_comision_nuevo, habitacion_nueva.tipo.comision)

        self.assertTrue(habitacion_anterior.estado == 2)
        self.assertTrue(habitacion_nueva.estado == 1)

        transaccion_caja = TransaccionCaja.objects.filter(tipo_dos='SERVICIO').last()
        self.assertIsNone(transaccion_caja)

        return servicios

    def test_habitacion_cambiar_de_habitacion_igual_tarifa(self):
        habitacion_nueva_igual_tarifa = HabitacionFactory(tipo=self.habitacion.tipo, estado=0)
        self.habitacion_cambiar_de_habitacion_igual_tarifa(self.habitacion, habitacion_nueva_igual_tarifa)

    def test_habitacion_cambiar_de_habitacion_igual_tarifa_comision_en_ambas(self):
        habitacion_nueva_igual_tarifa = HabitacionFactory(tipo=self.tipo_habitacion_uno, estado=0)
        servicios = self.habitacion_cambiar_de_habitacion_igual_tarifa(
            self.habitacion,
            habitacion_nueva_igual_tarifa,
            comision=1000
        )
        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        for servicio in servicios_acompanante_1:
            self.assertEqual(servicio.comision, 1000)

        for servicio in servicios_acompanante_2:
            self.assertEqual(servicio.comision, 1000)

    def test_habitacion_cambiar_de_habitacion_igual_tarifa_comision_en_inicial(self):
        from ..factories import TipoHabitacionFactory
        tipo_habitacion_sin_comision = TipoHabitacionFactory(
            valor=self.tipo_habitacion_uno.valor,
            porcentaje_impuesto=self.tipo_habitacion_uno.porcentaje_impuesto
        )

        habitacion_nueva_igual_tarifa = HabitacionFactory(tipo=tipo_habitacion_sin_comision, estado=0)

        servicios = self.habitacion_cambiar_de_habitacion_igual_tarifa(
            self.habitacion,
            habitacion_nueva_igual_tarifa,
            comision=1000
        )
        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        for servicio in servicios_acompanante_1:
            self.assertEqual(servicio.comision, 0)

        for servicio in servicios_acompanante_2:
            self.assertEqual(servicio.comision, 0)

    def test_habitacion_cambiar_de_habitacion_igual_tarifa_comision_en_nueva(self):
        from ..factories import TipoHabitacionFactory
        tipo_habitacion_con_comision = TipoHabitacionFactory(
            valor=self.tipo_habitacion_uno.valor,
            porcentaje_impuesto=self.tipo_habitacion_uno.porcentaje_impuesto,
            comision=1000
        )
        habitacion_nueva_igual_tarifa = HabitacionFactory(tipo=tipo_habitacion_con_comision, estado=0)

        servicios = self.habitacion_cambiar_de_habitacion_igual_tarifa(
            self.habitacion,
            habitacion_nueva_igual_tarifa,
            comision=0
        )
        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        for servicio in servicios_acompanante_1:
            self.assertEqual(servicio.comision, 1000)

        for servicio in servicios_acompanante_2:
            self.assertEqual(servicio.comision, 1000)

    def habitacion_cambiar_de_habitacion_mayor_tarifa(
            self,
            habitacion_inicial,
            habitacion_nueva_mayor_tarifa,
            comision=0
    ):
        from ..services import habitacion_cambiar_servicios_de_habitacion

        servicios = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=habitacion_inicial,
            punto_venta=self.punto_venta,
            terminados=True,
            iniciados=True,
            nro_servicios=5,
            acompanante_dos=self.acompanante_dos,
            comision=comision
        )
        array_servicios_acompanante_1 = servicios['acompanante_1']['array_servicios']
        array_servicios_acompanante_2 = servicios['acompanante_2']['array_servicios']

        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        diferencia_valor = (habitacion_nueva_mayor_tarifa.tipo.valor - habitacion_inicial.tipo.valor)
        diferencia_valor_total = diferencia_valor * len(array_servicios_acompanante_1 + array_servicios_acompanante_2)

        with self.assertRaisesMessage(
                ValidationError,
                'El valor ingresado del pago del faltante, entre efectivo y tarjetas es diferente al requerido para cambiar de habitación. Valor requerido:'
        ):
            habitacion_cambiar_servicios_de_habitacion(
                habitacion_anterior_id=habitacion_inicial.id,
                habitacion_nueva_id=habitacion_nueva_mayor_tarifa.id,
                servicios_array_id=array_servicios_acompanante_1 + array_servicios_acompanante_2,
                punto_venta_id=self.punto_venta.id,
                usuario_id=self.punto_venta.usuario_actual.id,
                valor_efectivo=0,
                valor_tarjeta=30000
            )

        habitacion_nueva, habitacion_anterior = habitacion_cambiar_servicios_de_habitacion(
            habitacion_anterior_id=habitacion_inicial.id,
            habitacion_nueva_id=habitacion_nueva_mayor_tarifa.id,
            servicios_array_id=array_servicios_acompanante_1 + array_servicios_acompanante_2,
            punto_venta_id=self.punto_venta.id,
            usuario_id=self.punto_venta.usuario_actual.id,
            valor_efectivo=int(diferencia_valor_total / 2),
            valor_tarjeta=diferencia_valor_total - int(diferencia_valor_total / 2)
        )

        for servicio in servicios_acompanante_1:
            iva_anterior = int(servicio.valor_iva_habitacion)
            valor_habitacion_anterior = int(servicio.valor_habitacion)
            valor_comision_anterior = int(servicio.comision)
            valor_servicio_anterior = int(servicio.valor_servicio)
            valor_total_anterior = int(servicio.valor_total)
            servicio.refresh_from_db()
            iva_nuevo = int(servicio.valor_iva_habitacion)
            valor_habitacion_nuevo = int(servicio.valor_habitacion)
            valor_comision_nuevo = int(servicio.comision)
            valor_total_nuevo = int(servicio.valor_total)
            valor_servicio_nuevo = int(servicio.valor_servicio)

            self.assertEqual(valor_servicio_anterior, valor_servicio_nuevo)
            self.assertEqual(valor_total_nuevo - valor_total_anterior, diferencia_valor)
            self.assertEqual(iva_nuevo, int(habitacion_nueva.tipo.impuesto))
            self.assertEqual(iva_anterior, int(habitacion_anterior.tipo.impuesto))
            self.assertEqual(valor_habitacion_anterior,
                             int(habitacion_anterior.tipo.valor_antes_impuestos - habitacion_anterior.tipo.comision))
            self.assertEqual(valor_habitacion_nuevo,
                             int(habitacion_nueva.tipo.valor_antes_impuestos - habitacion_nueva.tipo.comision))
            self.assertEqual(valor_comision_anterior, habitacion_anterior.tipo.comision)
            self.assertEqual(valor_comision_nuevo, habitacion_nueva.tipo.comision)

        for servicio in servicios_acompanante_2:
            iva_anterior = int(servicio.valor_iva_habitacion)
            valor_habitacion_anterior = int(servicio.valor_habitacion)
            valor_comision_anterior = int(servicio.comision)
            valor_servicio_anterior = int(servicio.valor_servicio)
            valor_total_anterior = int(servicio.valor_total)
            servicio.refresh_from_db()
            iva_nuevo = int(servicio.valor_iva_habitacion)
            valor_habitacion_nuevo = int(servicio.valor_habitacion)
            valor_comision_nuevo = int(servicio.comision)
            valor_total_nuevo = int(servicio.valor_total)
            valor_servicio_nuevo = int(servicio.valor_servicio)

            self.assertEqual(valor_servicio_anterior, valor_servicio_nuevo)
            self.assertEqual(valor_total_nuevo - valor_total_anterior, diferencia_valor)
            self.assertEqual(iva_nuevo, int(habitacion_nueva.tipo.impuesto))
            self.assertEqual(iva_anterior, int(habitacion_anterior.tipo.impuesto))
            self.assertEqual(valor_habitacion_anterior,
                             int(habitacion_anterior.tipo.valor_antes_impuestos - habitacion_anterior.tipo.comision))
            self.assertEqual(valor_habitacion_nuevo,
                             int(habitacion_nueva.tipo.valor_antes_impuestos - habitacion_nueva.tipo.comision))
            self.assertEqual(valor_comision_anterior, habitacion_anterior.tipo.comision)
            self.assertEqual(valor_comision_nuevo, habitacion_nueva.tipo.comision)

        self.assertTrue(habitacion_anterior.estado == 2)
        self.assertTrue(habitacion_nueva.estado == 1)

        transaccion_caja = TransaccionCaja.objects.filter(
            tipo='I',
            tipo_dos='SERVICIO',
            concepto__contains='Ingreso por cambio de la habitación'
        ).last()
        self.assertIsNotNone(transaccion_caja)
        self.assertEqual(transaccion_caja.valor_efectivo + transaccion_caja.valor_tarjeta, diferencia_valor_total)

        return servicios

    def test_habitacion_cambiar_de_habitacion_mayor_tarifa(self):
        self.habitacion_cambiar_de_habitacion_mayor_tarifa(self.habitacion, self.habitacion_dos)

    def test_habitacion_cambiar_de_habitacion_mayor_tarifa_comision_en_inicial(self):
        servicios = self.habitacion_cambiar_de_habitacion_mayor_tarifa(
            self.habitacion,
            self.habitacion_dos,
            comision=1000
        )
        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        for servicio in servicios_acompanante_1:
            self.assertEqual(servicio.comision, 0)

        for servicio in servicios_acompanante_2:
            self.assertEqual(servicio.comision, 0)

    def test_habitacion_cambiar_de_habitacion_mayor_tarifa_comision_en_nueva(self):
        self.tipo_habitacion_dos.comision = 1000
        self.tipo_habitacion_dos.save()
        servicios = self.habitacion_cambiar_de_habitacion_mayor_tarifa(
            self.habitacion,
            self.habitacion_dos,
        )
        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        for servicio in servicios_acompanante_1:
            self.assertEqual(servicio.comision, 1000)

        for servicio in servicios_acompanante_2:
            self.assertEqual(servicio.comision, 1000)

    def test_habitacion_cambiar_de_habitacion_mayor_tarifa_comision_en_ambas(self):
        self.tipo_habitacion_dos.comision = 1000
        self.tipo_habitacion_dos.save()

        self.tipo_habitacion_dos.comision = 1000
        self.tipo_habitacion_dos.save()
        servicios = self.habitacion_cambiar_de_habitacion_mayor_tarifa(
            self.habitacion,
            self.habitacion_dos,
            comision=1000
        )
        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        for servicio in servicios_acompanante_1:
            self.assertEqual(servicio.comision, 1000)

        for servicio in servicios_acompanante_2:
            self.assertEqual(servicio.comision, 1000)

    def habitacion_cambiar_de_habitacion_menor_tarifa(
            self,
            habitacion_inicial,
            habitacion_nueva_menor_tarifa,
            comision=0
    ):
        from ..services import habitacion_cambiar_servicios_de_habitacion
        servicios = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=habitacion_inicial,
            punto_venta=self.punto_venta,
            terminados=True,
            iniciados=True,
            nro_servicios=5,
            acompanante_dos=self.acompanante_dos,
            comision=comision
        )
        array_servicios_acompanante_1 = servicios['acompanante_1']['array_servicios']
        array_servicios_acompanante_2 = servicios['acompanante_2']['array_servicios']

        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        diferencia_valor = (habitacion_inicial.tipo.valor - habitacion_nueva_menor_tarifa.tipo.valor)
        diferencia_valor_total = diferencia_valor * len(array_servicios_acompanante_1 + array_servicios_acompanante_2)

        with self.assertRaisesMessage(
                ValidationError,
                'El valor ingresado para la devolucion debe ser todo en efectivo. Valor devolucion:'
        ):
            habitacion_cambiar_servicios_de_habitacion(
                habitacion_anterior_id=habitacion_inicial.id,
                habitacion_nueva_id=habitacion_nueva_menor_tarifa.id,
                servicios_array_id=array_servicios_acompanante_2 + array_servicios_acompanante_1,
                punto_venta_id=self.punto_venta.id,
                usuario_id=self.punto_venta.usuario_actual.id,
                valor_efectivo=-30000,
                valor_tarjeta=-30000
            )

        habitacion_nueva, habitacion_anterior = habitacion_cambiar_servicios_de_habitacion(
            habitacion_anterior_id=habitacion_inicial.id,
            habitacion_nueva_id=habitacion_nueva_menor_tarifa.id,
            servicios_array_id=array_servicios_acompanante_2 + array_servicios_acompanante_1,
            punto_venta_id=self.punto_venta.id,
            usuario_id=self.punto_venta.usuario_actual.id,
            valor_efectivo=-diferencia_valor_total,
            valor_tarjeta=0
        )

        for servicio in servicios_acompanante_1:
            iva_anterior = int(servicio.valor_iva_habitacion)
            valor_habitacion_anterior = int(servicio.valor_habitacion)
            valor_comision_anterior = int(servicio.comision)
            valor_servicio_anterior = int(servicio.valor_servicio)
            valor_total_anterior = int(servicio.valor_total)
            servicio.refresh_from_db()
            iva_nuevo = int(servicio.valor_iva_habitacion)
            valor_habitacion_nuevo = int(servicio.valor_habitacion)
            valor_comision_nuevo = int(servicio.comision)
            valor_total_nuevo = int(servicio.valor_total)
            valor_servicio_nuevo = int(servicio.valor_servicio)

            self.assertEqual(valor_servicio_anterior, valor_servicio_nuevo)
            self.assertEqual(valor_total_anterior - valor_total_nuevo, diferencia_valor)
            self.assertEqual(iva_nuevo, int(habitacion_nueva.tipo.impuesto))
            self.assertEqual(iva_anterior, int(habitacion_anterior.tipo.impuesto))
            self.assertEqual(valor_habitacion_anterior,
                             int(habitacion_anterior.tipo.valor_antes_impuestos - habitacion_anterior.tipo.comision))
            self.assertEqual(valor_habitacion_nuevo,
                             int(habitacion_nueva.tipo.valor_antes_impuestos - habitacion_nueva.tipo.comision))
            self.assertEqual(valor_comision_anterior, habitacion_anterior.tipo.comision)
            self.assertEqual(valor_comision_nuevo, habitacion_nueva.tipo.comision)

        for servicio in servicios_acompanante_2:
            iva_anterior = int(servicio.valor_iva_habitacion)
            valor_habitacion_anterior = int(servicio.valor_habitacion)
            valor_comision_anterior = int(servicio.comision)
            valor_servicio_anterior = int(servicio.valor_servicio)
            valor_total_anterior = int(servicio.valor_total)
            servicio.refresh_from_db()
            iva_nuevo = int(servicio.valor_iva_habitacion)
            valor_habitacion_nuevo = int(servicio.valor_habitacion)
            valor_comision_nuevo = int(servicio.comision)
            valor_total_nuevo = int(servicio.valor_total)
            valor_servicio_nuevo = int(servicio.valor_servicio)

            self.assertEqual(valor_servicio_anterior, valor_servicio_nuevo)
            self.assertEqual(valor_total_anterior - valor_total_nuevo, diferencia_valor)
            self.assertEqual(iva_nuevo, int(habitacion_nueva.tipo.impuesto))
            self.assertEqual(iva_anterior, int(habitacion_anterior.tipo.impuesto))
            self.assertEqual(valor_habitacion_anterior,
                             int(habitacion_anterior.tipo.valor_antes_impuestos - habitacion_anterior.tipo.comision))
            self.assertEqual(valor_habitacion_nuevo,
                             int(habitacion_nueva.tipo.valor_antes_impuestos - habitacion_nueva.tipo.comision))
            self.assertEqual(valor_comision_anterior, habitacion_anterior.tipo.comision)
            self.assertEqual(valor_comision_nuevo, habitacion_nueva.tipo.comision)

        self.assertTrue(habitacion_anterior.estado == 2)
        self.assertTrue(habitacion_nueva.estado == 1)

        transaccion_caja = TransaccionCaja.objects.filter(
            tipo='E',
            tipo_dos='SERVICIO',
            concepto__contains='Devolución por cambio de la habitación'
        ).last()
        self.assertIsNotNone(transaccion_caja)
        self.assertEqual(transaccion_caja.valor_efectivo, -diferencia_valor_total)
        return servicios

    def test_habitacion_cambiar_de_habitacion_menor_tarifa(self):
        self.habitacion_cambiar_de_habitacion_menor_tarifa(self.habitacion_dos, self.habitacion)

    def test_habitacion_cambiar_de_habitacion_menor_tarifa_comision_en_inicial(self):
        servicios = self.habitacion_cambiar_de_habitacion_menor_tarifa(
            self.habitacion_dos,
            self.habitacion,
            comision=1000
        )
        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        for servicio in servicios_acompanante_1:
            self.assertEqual(servicio.comision, 0)

        for servicio in servicios_acompanante_2:
            self.assertEqual(servicio.comision, 0)

    def test_habitacion_cambiar_de_habitacion_menor_tarifa_comision_en_nueva(self):
        self.tipo_habitacion_uno.comision = 1000
        self.tipo_habitacion_uno.save()

        servicios = self.habitacion_cambiar_de_habitacion_menor_tarifa(
            self.habitacion_dos,
            self.habitacion
        )
        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        for servicio in servicios_acompanante_1:
            self.assertEqual(servicio.comision, 1000)

        for servicio in servicios_acompanante_2:
            self.assertEqual(servicio.comision, 1000)

    def test_habitacion_cambiar_de_habitacion_menor_tarifa_comision_en_ambas(self):
        self.tipo_habitacion_uno.comision = 1000
        self.tipo_habitacion_uno.save()
        servicios = self.habitacion_cambiar_de_habitacion_menor_tarifa(
            self.habitacion_dos,
            self.habitacion,
            comision=1000
        )

        servicios_acompanante_1 = servicios['acompanante_1']['servicios']
        servicios_acompanante_2 = servicios['acompanante_2']['servicios']

        for servicio in servicios_acompanante_1:
            self.assertEqual(servicio.comision, 1000)

        for servicio in servicios_acompanante_2:
            self.assertEqual(servicio.comision, 1000)

    def test_habitacion_cambiar_de_habitacion_solo_punto_venta_abierto(self):
        from ..services import habitacion_cambiar_servicios_de_habitacion

        servicios = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            terminados=False,
            iniciados=True,
            nro_servicios=5,
            acompanante_dos=self.acompanante_dos
        )
        array_servicios_acompanante_1 = servicios['acompanante_1']['array_servicios']
        array_servicios_acompanante_2 = servicios['acompanante_2']['array_servicios']

        habitacion_nueva_igual_tarifa = HabitacionFactory(tipo=self.habitacion.tipo)

        self.punto_venta.abierto = False
        self.punto_venta.save()

        with self.assertRaisesMessage(
                ValidationError,
                'No se puede cambiar servicios de habitación desde un punto de venta cerrado'
        ):
            habitacion_cambiar_servicios_de_habitacion(
                habitacion_anterior_id=self.habitacion.id,
                habitacion_nueva_id=habitacion_nueva_igual_tarifa.id,
                servicios_array_id=array_servicios_acompanante_1 + array_servicios_acompanante_2,
                punto_venta_id=self.punto_venta.id,
                usuario_id=self.punto_venta.usuario_actual.id,
                valor_efectivo=0,
                valor_tarjeta=0
            )

    def test_habitacion_cambiar_de_habitacion_guarda_datos_bitacora(self):
        from ..services import habitacion_cambiar_servicios_de_habitacion

        servicios = self.hacer_servicios_dos(
            acompanante=self.acompanante,
            habitacion=self.habitacion,
            punto_venta=self.punto_venta,
            terminados=False,
            iniciados=True,
            nro_servicios=5,
            acompanante_dos=self.acompanante_dos
        )
        array_servicios_acompanante_1 = servicios['acompanante_1']['array_servicios']
        array_servicios_acompanante_2 = servicios['acompanante_2']['array_servicios']

        habitacion_nueva_igual_tarifa = HabitacionFactory(tipo=self.habitacion.tipo)

        habitacion_cambiar_servicios_de_habitacion(
            habitacion_anterior_id=self.habitacion.id,
            habitacion_nueva_id=habitacion_nueva_igual_tarifa.id,
            servicios_array_id=array_servicios_acompanante_1 + array_servicios_acompanante_2,
            punto_venta_id=self.punto_venta.id,
            usuario_id=self.punto_venta.usuario_actual.id,
            valor_efectivo=0,
            valor_tarjeta=0
        )

        self.punto_venta.refresh_from_db()

        from servicios.models import BitacoraServicio
        bitacoras = BitacoraServicio.objects.filter(punto_venta_turno__punto_venta=self.punto_venta).all()
        bitacoras_conceptos = bitacoras.filter(concepto='Cambio de habitación').all()

        bitacoras_sin_observacion = bitacoras_conceptos.filter(observacion__isnull=True).all()
        bitacoras_con_habitacion_anterior = bitacoras_sin_observacion.filter(
            habitacion_anterior_nombre__contains=self.habitacion.nombre
        ).all()
        bitacoras_con_habitacion_nueva = bitacoras_sin_observacion.filter(
            habitacion_nueva_nombre__contains=habitacion_nueva_igual_tarifa.nombre
        ).all()
        self.assertTrue(
            bitacoras_conceptos.count() == len(array_servicios_acompanante_1 + array_servicios_acompanante_2))
        self.assertTrue(
            bitacoras_sin_observacion.count() == len(array_servicios_acompanante_1 + array_servicios_acompanante_2))
        self.assertTrue(bitacoras_con_habitacion_anterior.count() == len(
            array_servicios_acompanante_1 + array_servicios_acompanante_2))
        self.assertTrue(bitacoras_con_habitacion_nueva.count() == len(
            array_servicios_acompanante_1 + array_servicios_acompanante_2))
    # endregion
