from decimal import Decimal

from django.test import TestCase
from rest_framework.exceptions import ValidationError

from ..factories import TipoHabitacionFactory, HabitacionFactory
from ..services import habitacion_cambiar_estado

from faker import Faker

faker = Faker()


class HabitacionTests(TestCase):
    def setUp(self):
        from terceros.factories import AcompananteFactory, ColaboradorFactory
        from empresas.factories import EmpresaFactory
        from terceros.services import (
            acompanante_crear,
            tercero_set_new_pin,
            tercero_registra_entrada
        )
        from terceros_acompanantes.factories import (
            CategoriaFraccionTiempoFactory,
            FraccionTiempoFactory,
            CategoriaAcompananteFactory
        )
        from puntos_venta.services import punto_venta_abrir
        from puntos_venta.factories import PuntoVentaFactory
        from habitaciones.factories import HabitacionFactory
        self.tipo = TipoHabitacionFactory()
        self.empresa = EmpresaFactory()

        self.tipo_habitacion_uno = TipoHabitacionFactory(
            valor=40000,
            porcentaje_impuesto=19,
        )

        self.tipo_habitacion_dos = TipoHabitacionFactory(
            valor=60000,
            porcentaje_impuesto=19,
        )

        self.habitacion = HabitacionFactory(tipo=self.tipo_habitacion_uno)
        self.habitacion_dos = HabitacionFactory(tipo=self.tipo_habitacion_dos)

        self.colaborador = ColaboradorFactory()
        self.colaborador, pin = tercero_set_new_pin(tercero_id=self.colaborador.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=self.colaborador.id, raw_pin='0000')
        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)

        self.punto_venta, self.punto_venta_turno = punto_venta_abrir(
            punto_venta_id=self.punto_venta.id,
            usuario_pv_id=self.colaborador.usuario.id
        )

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

        self.acompanante_base_dos = AcompananteFactory.build(
            categoria_modelo=self.categoria_modelo
        )
        self.acompanante_base_dos.pop('es_acompanante')
        self.acompanante_base_dos.pop('usuario')
        self.acompanante_dos = acompanante_crear(self.acompanante_base_dos)

        self.acompanante_dos, pin = tercero_set_new_pin(tercero_id=self.acompanante_dos.id, raw_pin='0000')

        tercero_registra_entrada(tercero_id=self.acompanante.id, raw_pin='0000')
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
        from servicios.services import servicio_crear_nuevo, servicio_iniciar
        from ..services import habitacion_terminar_servicios

        servicio_uno = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_uno = servicio_iniciar(
            servicio_id=servicio_uno.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_iniciar(
            servicio_id=servicio_dos.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_otra = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante_dos.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_otra = servicio_iniciar(
            servicio_id=servicio_otra.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        habitacion = habitacion_cambiar_estado(self.habitacion.id, 1)
        cantidad_servicios_iniciados = habitacion.servicios.filter(habitacion_id=habitacion.id, estado=1).count()
        habitacion = habitacion_terminar_servicios(
            habitacion_id=habitacion.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        cantidad_servicios_terminados = habitacion.servicios.filter(habitacion_id=habitacion.id, estado=2).count()
        cantidad_servicios_en_proceso = habitacion.servicios.filter(habitacion_id=habitacion.id, estado=1).count()
        servicio_uno.refresh_from_db()
        servicio_dos.refresh_from_db()
        servicio_otra.refresh_from_db()
        self.assertEqual(servicio_uno.estado, 2)
        self.assertEqual(servicio_dos.estado, 2)
        self.assertEqual(servicio_otra.estado, 2)
        self.assertEqual(habitacion.estado, 2)
        self.assertEqual(cantidad_servicios_iniciados, cantidad_servicios_terminados)
        self.acompanante.refresh_from_db()
        self.acompanante_dos.refresh_from_db()
        self.assertTrue(self.acompanante.estado == 0)
        self.assertTrue(cantidad_servicios_en_proceso == 0)
        self.assertTrue(self.acompanante_dos.estado == 0)

    def test_habitacion_terminar_servicios_solo_punto_venta_abierto(self):
        from servicios.services import servicio_crear_nuevo, servicio_iniciar
        from ..services import habitacion_terminar_servicios

        servicio_uno = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_iniciar(
            servicio_id=servicio_uno.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_iniciar(
            servicio_id=servicio_dos.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
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

    # region habitacion_cambiar_de_habitacion
    def test_habitacion_cambiar_de_habitacion_solo_punto_venta_abierto(self):
        from ..services import habitacion_cambiar_servicios_de_habitacion
        from servicios.services import servicio_crear_nuevo, servicio_iniciar

        habitacion_nueva_igual_tarifa = HabitacionFactory(tipo=self.habitacion.tipo)

        servicio_uno = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_uno = servicio_iniciar(
            servicio_id=servicio_uno.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_iniciar(
            servicio_id=servicio_dos.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        self.punto_venta.abierto = False
        self.punto_venta.save()

        with self.assertRaisesMessage(
                ValidationError,
                'No se puede cambiar servicios de habitación desde un punto de venta cerrado'
        ):
            habitacion_cambiar_servicios_de_habitacion(
                habitacion_anterior_id=self.habitacion.id,
                habitacion_nueva_id=habitacion_nueva_igual_tarifa.id,
                servicios_array_id=[servicio_uno.id, servicio_dos.id],
                punto_venta_id=self.punto_venta.id,
                usuario_id=self.punto_venta.usuario_actual.id,
                valor_efectivo=0,
                valor_tarjeta=0
            )

    def test_habitacion_cambiar_de_habitacion_igual_tarifa(self):
        from ..services import habitacion_cambiar_servicios_de_habitacion
        from servicios.services import servicio_crear_nuevo, servicio_iniciar

        habitacion_nueva_igual_tarifa = HabitacionFactory(tipo=self.habitacion.tipo, estado=0)

        servicio_uno = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_uno = servicio_iniciar(
            servicio_id=servicio_uno.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_iniciar(
            servicio_id=servicio_dos.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_otra = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante_dos.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_otra = servicio_iniciar(
            servicio_id=servicio_otra.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        habitacion_nueva, habitacion_anterior = habitacion_cambiar_servicios_de_habitacion(
            habitacion_anterior_id=self.habitacion.id,
            habitacion_nueva_id=habitacion_nueva_igual_tarifa.id,
            servicios_array_id=[servicio_uno.id, servicio_dos.id, servicio_otra.id],
            punto_venta_id=self.punto_venta.id,
            usuario_id=self.punto_venta.usuario_actual.id,
            valor_efectivo=0,
            valor_tarjeta=0
        )

        diferencia_valor = self.habitacion.tipo.valor - habitacion_nueva_igual_tarifa.tipo.valor
        valor_total_anterior = servicio_uno.valor_total
        servicio_uno.refresh_from_db()
        valor_total_nuevo = servicio_uno.valor_total
        self.assertEqual(valor_total_anterior - valor_total_nuevo, diferencia_valor)

        servicio_uno.refresh_from_db()
        servicio_dos.refresh_from_db()
        servicio_otra.refresh_from_db()
        self.assertEqual(habitacion_nueva, servicio_uno.habitacion)
        self.assertEqual(habitacion_nueva, servicio_dos.habitacion)
        self.assertEqual(habitacion_nueva, servicio_otra.habitacion)
        self.assertTrue(habitacion_anterior.estado == 2)
        self.assertTrue(habitacion_nueva.estado == 1)

    def test_habitacion_cambiar_de_habitacion_guarda_datos_bitacora(self):
        from ..services import habitacion_cambiar_servicios_de_habitacion
        from servicios.services import servicio_crear_nuevo, servicio_iniciar

        habitacion_nueva_igual_tarifa = HabitacionFactory(tipo=self.habitacion.tipo, estado=0)

        servicio_uno = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_uno = servicio_iniciar(
            servicio_id=servicio_uno.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_iniciar(
            servicio_id=servicio_dos.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_otra = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante_dos.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_otra = servicio_iniciar(
            servicio_id=servicio_otra.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        habitacion_nueva, habitacion_anterior = habitacion_cambiar_servicios_de_habitacion(
            habitacion_anterior_id=self.habitacion.id,
            habitacion_nueva_id=habitacion_nueva_igual_tarifa.id,
            servicios_array_id=[servicio_uno.id, servicio_dos.id, servicio_otra.id],
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
            habitacion_anterior_nombre__contains=habitacion_anterior.nombre
        ).all()
        bitacoras_con_habitacion_nueva = bitacoras_sin_observacion.filter(
            habitacion_nueva_nombre__contains=habitacion_nueva.nombre
        ).all()
        self.assertTrue(bitacoras_conceptos.count() == 3)
        self.assertTrue(bitacoras_sin_observacion.count() == 3)
        self.assertTrue(bitacoras_con_habitacion_anterior.count() == 3)
        self.assertTrue(bitacoras_con_habitacion_nueva.count() == 3)

    def test_habitacion_cambiar_de_habitacion_mayor_tarifa(self):
        from ..services import habitacion_cambiar_servicios_de_habitacion
        from servicios.services import servicio_crear_nuevo, servicio_iniciar

        habitacion_nueva_mayor_tarifa = HabitacionFactory(tipo=self.habitacion_dos.tipo, estado=0)

        servicio_uno = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_uno = servicio_iniciar(
            servicio_id=servicio_uno.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_iniciar(
            servicio_id=servicio_dos.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_otra = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante_dos.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_otra = servicio_iniciar(
            servicio_id=servicio_otra.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        with self.assertRaisesMessage(
                ValidationError,
                'El valor ingresado del pago del faltante, entre efectivo y tarjetas es diferente al requerido para cambiar de habitación. Valor requerido:'
        ):
            habitacion_cambiar_servicios_de_habitacion(
                habitacion_anterior_id=self.habitacion.id,
                habitacion_nueva_id=habitacion_nueva_mayor_tarifa.id,
                servicios_array_id=[servicio_uno.id, servicio_dos.id, servicio_otra.id],
                punto_venta_id=self.punto_venta.id,
                usuario_id=self.punto_venta.usuario_actual.id,
                valor_efectivo=0,
                valor_tarjeta=30000
            )

        habitacion_nueva, habitacion_anterior = habitacion_cambiar_servicios_de_habitacion(
            habitacion_anterior_id=self.habitacion.id,
            habitacion_nueva_id=habitacion_nueva_mayor_tarifa.id,
            servicios_array_id=[servicio_uno.id, servicio_dos.id, servicio_otra.id],
            punto_venta_id=self.punto_venta.id,
            usuario_id=self.punto_venta.usuario_actual.id,
            valor_efectivo=0,
            valor_tarjeta=(habitacion_nueva_mayor_tarifa.tipo.valor - self.habitacion.tipo.valor) * 3
        )

        iva_anterior_uno = servicio_uno.valor_iva_habitacion

        diferencia_valor = habitacion_nueva_mayor_tarifa.tipo.valor - self.habitacion.tipo.valor
        valor_total_anterior = servicio_uno.valor_total
        servicio_uno.refresh_from_db()
        valor_total_nuevo = servicio_uno.valor_total
        self.assertEqual(valor_total_nuevo - valor_total_anterior, diferencia_valor)
        servicio_dos.refresh_from_db()
        servicio_otra.refresh_from_db()
        self.assertEqual(habitacion_nueva, servicio_uno.habitacion)
        self.assertEqual(habitacion_nueva, servicio_dos.habitacion)
        self.assertEqual(habitacion_nueva, servicio_otra.habitacion)
        self.assertTrue(habitacion_anterior.estado == 2)
        self.assertTrue(habitacion_nueva.estado == 1)
        self.assertEqual(int(servicio_uno.valor_iva_habitacion), int(habitacion_nueva.tipo.impuesto))
        self.assertGreater(int(servicio_uno.valor_iva_habitacion), int(iva_anterior_uno))

    def test_habitacion_cambiar_de_habitacion_menor_tarifa(self):
        from ..services import habitacion_cambiar_servicios_de_habitacion
        from servicios.services import servicio_crear_nuevo, servicio_iniciar

        habitacion_nueva_menor_tarifa = HabitacionFactory(tipo=self.habitacion.tipo, estado=0)

        servicio_uno = servicio_crear_nuevo(
            habitacion_id=self.habitacion_dos.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_30.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_uno = servicio_iniciar(
            servicio_id=servicio_uno.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_crear_nuevo(
            habitacion_id=self.habitacion_dos.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_dos = servicio_iniciar(
            servicio_id=servicio_dos.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_otra = servicio_crear_nuevo(
            habitacion_id=self.habitacion_dos.id,
            acompanante_id=self.acompanante_dos.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo_60.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )

        servicio_otra = servicio_iniciar(
            servicio_id=servicio_otra.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        with self.assertRaisesMessage(
                ValidationError,
                'El valor ingresado para la devolucion debe ser todo en efectivo. Valor devolucion:'
        ):
            habitacion_cambiar_servicios_de_habitacion(
                habitacion_anterior_id=self.habitacion_dos.id,
                habitacion_nueva_id=habitacion_nueva_menor_tarifa.id,
                servicios_array_id=[servicio_uno.id, servicio_dos.id, servicio_otra.id],
                punto_venta_id=self.punto_venta.id,
                usuario_id=self.punto_venta.usuario_actual.id,
                valor_efectivo=-30000,
                valor_tarjeta=-30000
            )

        habitacion_nueva, habitacion_anterior = habitacion_cambiar_servicios_de_habitacion(
            habitacion_anterior_id=self.habitacion_dos.id,
            habitacion_nueva_id=habitacion_nueva_menor_tarifa.id,
            servicios_array_id=[servicio_uno.id, servicio_dos.id, servicio_otra.id],
            punto_venta_id=self.punto_venta.id,
            usuario_id=self.punto_venta.usuario_actual.id,
            valor_efectivo=-(self.habitacion_dos.tipo.valor - habitacion_nueva_menor_tarifa.tipo.valor) * 3,
            valor_tarjeta=0
        )
        iva_anterior_uno = servicio_uno.valor_iva_habitacion

        diferencia_valor = self.habitacion_dos.tipo.valor - habitacion_nueva_menor_tarifa.tipo.valor
        valor_total_anterior = servicio_uno.valor_total
        servicio_uno.refresh_from_db()
        valor_total_nuevo = servicio_uno.valor_total
        self.assertEqual(valor_total_anterior - valor_total_nuevo, diferencia_valor)

        servicio_uno.refresh_from_db()
        servicio_dos.refresh_from_db()
        servicio_otra.refresh_from_db()
        self.assertEqual(habitacion_nueva, servicio_uno.habitacion)
        self.assertEqual(habitacion_nueva, servicio_dos.habitacion)
        self.assertEqual(habitacion_nueva, servicio_otra.habitacion)
        self.assertTrue(habitacion_anterior.estado == 2)
        self.assertTrue(habitacion_nueva.estado == 1)

        self.assertEqual(int(servicio_uno.valor_iva_habitacion), int(habitacion_nueva.tipo.impuesto))
        self.assertGreater(int(iva_anterior_uno), int(servicio_uno.valor_iva_habitacion))

    # endregion

    # region habitacion_iniciar_servicios
    def test_habitacion_iniciar_servicios(self):
        from ..services import habitacion_iniciar_servicios
        from servicios.models import Servicio
        habitacion_iniciar_servicios(
            usuario_pdv_id=self.punto_venta.usuario_actual.id,
            habitacion_id=self.habitacion.id,
            valor_efectivo=800000,
            valor_tarjeta=200000,
            nro_autorizacion='asdfa',
            franquicia='visa',
            servicios=self.array_servicios
        )

        count_dos = Servicio.objects.filter(habitacion_id=self.habitacion.id, estado=1).count()
        count_tres = self.habitacion.servicios.filter(estado=1).count()
        self.assertEqual(len(self.array_servicios), count_dos)
        self.assertEqual(count_tres, count_dos)

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
