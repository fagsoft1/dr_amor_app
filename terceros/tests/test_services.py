from django.utils import timezone

from django.test import TestCase
from rest_framework.exceptions import ValidationError

from ..models import Tercero
from faker import Faker

faker = Faker()


class TercerosServicesTests(TestCase):
    def setUp(self):
        from ..factories import ColaboradorFactory, AcompananteFactory
        from habitaciones.factories import HabitacionFactory
        from terceros_acompanantes.factories import CategoriaFraccionTiempoFactory, FraccionTiempoFactory
        from ..services import colaborador_crear, tercero_set_new_pin, acompanante_crear

        tercero_base = ColaboradorFactory.build(usuario=None)
        tercero_base.pop('es_colaborador')
        tercero_base.pop('usuario')

        self.colaborador = colaborador_crear(tercero_base)
        self.colaborador, pin_nuevo = tercero_set_new_pin(self.colaborador.id, '1111')

        self.fraccion_tiempo_45 = FraccionTiempoFactory(minutos=45)
        self.categoria_fraccion_tiempo = CategoriaFraccionTiempoFactory(fraccion_tiempo=self.fraccion_tiempo_45)

        tercero_base_acompanante = AcompananteFactory.build(
            usuario=None,
            categoria_modelo=self.categoria_fraccion_tiempo.categoria
        )
        tercero_base_acompanante.pop('es_acompanante')
        tercero_base_acompanante.pop('usuario')

        self.acompanante = acompanante_crear(tercero_base_acompanante)
        self.acompanante, pin_nuevo = tercero_set_new_pin(self.acompanante.id, '1111')
        self.habitacion = HabitacionFactory()

    def test_tercero_cambiar_pin(self):
        from ..services import tercero_cambiar_pin, tercero_is_pin_correct
        password = 'lac0ntr4sena'
        user = self.acompanante.usuario
        user.set_password(password)
        user.save()
        tercero_cambiar_pin(tercero_id=self.acompanante.id, password=password, pin='1111')
        cambio = tercero_is_pin_correct(user.tercero.id, '1111')
        self.assertTrue(cambio)

    def test_tercero_cambiar_pin_password_errado(self):
        from ..services import tercero_cambiar_pin
        with self.assertRaisesMessage(
                ValidationError,
                'La contraseña suministrada no coincide con el usuario, es necesario para cambiar el PIN'
        ):
            tercero_cambiar_pin(tercero_id=self.acompanante.id, password='diferente', pin='1111')

    def test_tercero_set_new_pin_cambia_pin(self):
        from ..services import tercero_set_new_pin
        colaborador, pin_anterior = tercero_set_new_pin(self.colaborador.id, '1111')
        colaborador, pin_nuevo = tercero_set_new_pin(self.colaborador.id, '0000')
        self.assertNotEqual(pin_anterior, pin_nuevo, 'Los pines al cambiarlos no pueden ser iguales')

    def test_tercero_registra_entrada_usuario_queda_presente(self):
        from ..services import tercero_registra_entrada
        colaborador = self.colaborador
        colaborador.presente = False
        colaborador.save()
        colaborador, registro_uno = tercero_registra_entrada(colaborador.id, '1111')
        self.assertTrue(colaborador.presente, 'El usuario debe quedar presente cuándo registra entrada')
        self.assertIsNone(registro_uno.fecha_fin, ' La fecha final, cuando se registra la entrada, debe ser nula')

    def test_tercero_registra_entrada_unico_registro_entrada_abierto_colaborador_estado_ausente(self):
        from ..services import tercero_registra_entrada
        colaborador = self.colaborador
        colaborador.presente = False
        colaborador.save()
        colaborador, registro_uno = tercero_registra_entrada(colaborador.id, '1111')
        colaborador.presente = False
        colaborador.save()
        colaborador, registro_dos = tercero_registra_entrada(colaborador.id, '1111')
        # Se valida que no se creen dos registros de entrada cuando aún se tiene alguno abierto
        self.assertEqual(
            registro_uno.id,
            registro_dos.id,
            'No deben existir dos registros de entrada abiertos para un mismo usuario'
        )
        self.assertIsNone(
            registro_dos.fecha_fin,
            'La fecha final, cuando se registra la entrada, debe ser nula'
        )

    def test_tercero_registra_entrada_nuevo_registro_acceso_si_sale_y_entra_mismo_dia(self):
        from ..services import tercero_registra_entrada
        colaborador = self.colaborador
        colaborador, registro_uno = tercero_registra_entrada(colaborador.id, '1111')
        registro_uno.fecha_fin = timezone.now()
        registro_uno.save()
        colaborador.presente = False
        colaborador.save()
        colaborador, registro_dos = tercero_registra_entrada(colaborador.id, '1111')
        self.assertNotEqual(
            registro_uno.id,
            registro_dos.id,
            'No deben existir dos registros de entrada abiertos para un mismo usuario'
        )
        self.assertIsNotNone(
            registro_uno.fecha_fin,
            'La fecha final, cuando se registra la salida, no debe ser nula'
        )
        self.assertIsNone(
            registro_dos.fecha_fin,
            'La fecha final, cuando se registra la entrada, debe ser nula'
        )

    def test_tercero_registra_entrada_pin_correcto(self):
        from ..services import tercero_registra_entrada
        colaborador = self.colaborador
        with self.assertRaisesMessage(ValidationError, 'Es un pin errado, no se puede registrar la entrada'):
            tercero_registra_entrada(colaborador.id, '1112')
        tercero_registra_entrada(colaborador.id, '1111')

    def test_tercero_registra_entrada_usuario_presente_no_genera_nuevo_registo_ingreso(self):
        from ..services import tercero_registra_entrada
        from accesos.models import RegistroIngreso
        tercero_registra_entrada(self.colaborador.id, '1111')
        RegistroIngreso.objects.all().delete()
        with self.assertRaisesMessage(
                ValidationError,
                'El usuario se encuentra actualmente presente, no nesesita registrar su entrada de nuevo'
        ):
            tercero_registra_entrada(self.colaborador.id, '1111')

    def test_tercero_registra_entrada_usuario_presente_sin_registro_acceso_abierto(self):
        # se valida que el usuario pueda registrar dos veces la entrada si ya se encuentra presente y tiene un acceso creado cerrado,
        # se hace por si hay algun error en la salida del usuario un no pone presente=False
        from ..services import tercero_registra_entrada
        colaborador = self.colaborador
        colaborador, registro_uno = tercero_registra_entrada(colaborador.id, '1111')
        registro_uno.fecha_fin = timezone.now()
        registro_uno.save()
        colaborador, registro_dos = tercero_registra_entrada(colaborador.id, '1111')
        self.assertNotEqual(registro_uno.id, registro_dos.id)
        self.assertIsNotNone(registro_uno.fecha_fin)
        self.assertIsNone(registro_dos.fecha_fin)

    def test_tercero_registra_salida_pin_correcto(self):
        from ..services import tercero_registra_entrada, tercero_registra_salida
        self.acompanante.presente = False
        self.acompanante.save()
        acompanante, registro_acceso = tercero_registra_entrada(self.acompanante.id, '1111')
        with self.assertRaisesMessage(ValidationError, 'Es un pin errado, no se pueda registrar la salida'):
            tercero_registra_salida(acompanante.id, '1112')

    def test_tercero_registra_salida_no_queda_presente(self):
        from ..services import tercero_registra_entrada, tercero_registra_salida
        self.acompanante.presente = False
        self.acompanante.save()
        acompanante, registro_acceso = tercero_registra_entrada(self.acompanante.id, '1111')

        # Valida que no quede presente a la salida
        self.assertTrue(acompanante.presente, 'El estado del usuario que registra entrada debe quedar PRESENTE')
        acompanante, registro_acceso_dos = tercero_registra_salida(acompanante.id, '1111')
        self.assertFalse(acompanante.presente, 'El estado del usuario que registra salida debe quedar AUSENTE')

    def test_tercero_registra_salida_no_queda_registro_acceso_abierto(self):
        from ..services import tercero_registra_entrada, tercero_registra_salida
        self.acompanante.presente = False
        self.acompanante.save()
        acompanante, registro_acceso = tercero_registra_entrada(self.acompanante.id, '1111')
        acompanante, registro_acceso_dos = tercero_registra_salida(acompanante.id, '1111')

        self.assertEqual(registro_acceso_dos.id, registro_acceso.id)
        self.assertIsNotNone(
            registro_acceso_dos.fecha_fin,
            'El resgistro de acceso debe quedar cerrado cuando se registra salida'
        )

    def test_tercero_registra_salida_modelo_solo_sin_servicios_pendientes(self):
        from ..services import tercero_registra_entrada, tercero_registra_salida
        from servicios.services import servicio_crear_nuevo, servicio_iniciar
        from habitaciones.services import habitacion_terminar_servicios
        from puntos_venta.factories import PuntoVentaFactory
        from puntos_venta.services import punto_venta_abrir

        self.acompanante.presente = False
        self.acompanante.save()
        tercero_registra_entrada(self.acompanante.id, '1111')
        tercero_registra_entrada(self.colaborador.id, '1111')

        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)

        self.punto_venta, self.punto_venta_turno = punto_venta_abrir(
            punto_venta_id=self.punto_venta.id,
            usuario_pv_id=self.colaborador.usuario.id,
            base_inicial_efectivo=0,
            saldo_cierre_caja_anterior=0
        )
        servicio_inicial = servicio_crear_nuevo(
            habitacion_id=self.habitacion.id,
            acompanante_id=self.acompanante.id,
            categoria_fraccion_tiempo_id=self.categoria_fraccion_tiempo.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        servicio_iniciar(
            servicio_id=servicio_inicial.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        with self.assertRaisesMessage(
                ValidationError,
                'No se puede registrar salida para este usuario, aún tiene servicios en proceso'
        ):
            tercero_registra_salida(self.acompanante.id, '1111')
        habitacion_terminar_servicios(
            habitacion_id=self.habitacion.id,
            usuario_pdv_id=self.punto_venta.usuario_actual.id
        )
        tercero_registra_salida(self.acompanante.id, '1111')

    def test_tercero_registra_salida_crea_registro_ingreso_en_salida_si_no_creo_a_entrada(self):
        from ..services import tercero_registra_entrada, tercero_registra_salida
        from accesos.models import RegistroIngreso
        self.acompanante.presente = False
        self.acompanante.save()
        tercero_registra_entrada(self.acompanante.id, '1111')
        RegistroIngreso.objects.all().delete()
        tercero_registra_salida(self.acompanante.id, '1111')
        self.assertTrue(RegistroIngreso.objects.count() == 1)


class AcompananteTests(TestCase):
    def setUp(self):
        from terceros_acompanantes.factories import CategoriaAcompananteFactory
        from ..factories import AcompananteFactory
        from usuarios.factories import UserFactory
        from ..services import acompanante_crear
        self.usuario = UserFactory()
        self.categoria_modelo = CategoriaAcompananteFactory()

        self.tercero_base = AcompananteFactory.build(
            usuario=None,
            categoria_modelo=self.categoria_modelo
        )
        self.tercero_base.pop('es_acompanante')
        self.tercero_base.pop('usuario')

        self.acompanante = acompanante_crear(self.tercero_base)

        self.categoria_modelo_dos = CategoriaAcompananteFactory()
        self.tercero_base_dos = AcompananteFactory.build(
            usuario=None,
            categoria_modelo=self.categoria_modelo_dos
        )
        self.tercero_base_dos.pop('es_acompanante')
        self.tercero_base_dos.pop('usuario')
        self.acompanante_dos = acompanante_crear(self.tercero_base_dos)

    def test_acompanante_crear(self):
        from ..services import acompanante_crear, acompanante_desencriptar
        from ..factories import AcompananteFactory
        tercero_base = AcompananteFactory.build(
            usuario=None,
            categoria_modelo=self.categoria_modelo
        )
        tercero_base.pop('es_acompanante')
        tercero_base.pop('usuario')
        count = Tercero.objects.count()
        acompanante = acompanante_crear(tercero_base)
        self.assertEqual(tercero_base['nombre'], acompanante_desencriptar(acompanante.nombre))
        self.assertEqual(tercero_base['nombre_segundo'], acompanante_desencriptar(acompanante.nombre_segundo))
        self.assertEqual(tercero_base['apellido'], acompanante_desencriptar(acompanante.apellido))
        self.assertEqual(tercero_base['apellido_segundo'], acompanante_desencriptar(acompanante.apellido_segundo))
        self.assertEqual(tercero_base['nro_identificacion'], acompanante_desencriptar(acompanante.nro_identificacion))
        self.assertEqual(count + 1, Tercero.objects.count())

    def test_acompanante_crear_username_sin_apellido_segundo(self):
        from ..services import acompanante_crear
        from ..factories import AcompananteFactory
        tercero_base_dos = AcompananteFactory.build(
            usuario=None,
            categoria_modelo=self.categoria_modelo_dos
        )
        tercero_base_dos.pop('es_acompanante')
        tercero_base_dos.pop('usuario')
        tercero_base_dos.pop('apellido_segundo')
        count = Tercero.objects.count()
        acompanante_nueva = acompanante_crear(tercero_base_dos)
        self.assertEqual(count + 1, Tercero.objects.count())
        username = ('ac-%s%s' % (tercero_base_dos['nombre'][0:3], tercero_base_dos['apellido'][0:3])).lower()
        self.assertEqual(username, acompanante_nueva.usuario.username)

    def test_acompanante_crear_username_sin_nombre_segundo(self):
        from ..services import acompanante_crear
        from ..factories import AcompananteFactory
        tercero_base_dos = AcompananteFactory.build(
            usuario=None,
            categoria_modelo=self.categoria_modelo_dos
        )
        tercero_base_dos.pop('es_acompanante')
        tercero_base_dos.pop('usuario')
        tercero_base_dos.pop('nombre_segundo')
        count = Tercero.objects.count()
        acompanante_nueva = acompanante_crear(tercero_base_dos)
        self.assertEqual(count + 1, Tercero.objects.count())
        username = ('ac-%s%s%s' % (tercero_base_dos['nombre'][0:3], tercero_base_dos['apellido'][0:3],
                                   tercero_base_dos['apellido_segundo'][0:3])).lower()
        self.assertEqual(username, acompanante_nueva.usuario.username)

    def test_acompanante_crear_username_mas_uno_repetido(self):
        from ..services import acompanante_crear
        from ..factories import AcompananteFactory
        tercero_base_dos = AcompananteFactory.build(
            usuario=None,
            categoria_modelo=self.categoria_modelo_dos
        )
        tercero_base_dos.pop('es_acompanante')
        tercero_base_dos.pop('usuario')
        tercero_base_dos['nombre'] = self.tercero_base['nombre']
        tercero_base_dos['nombre_segundo'] = self.tercero_base['nombre_segundo']
        tercero_base_dos['apellido'] = self.tercero_base['apellido']
        tercero_base_dos['apellido_segundo'] = self.tercero_base['apellido_segundo']
        count = Tercero.objects.count()
        acompanante_nueva = acompanante_crear(tercero_base_dos)
        self.assertEqual(count + 1, Tercero.objects.count())
        username = ('ac-%s%s%s1' % (
            tercero_base_dos['nombre'][0:3],
            tercero_base_dos['apellido'][0:3],
            tercero_base_dos['apellido_segundo'][0:3])).lower()
        self.assertEqual(username, acompanante_nueva.usuario.username)

    def test_acompanante_crear_encripta_desencripta(self):
        from ..services import acompanante_desencriptar
        self.assertEqual(self.tercero_base['nombre'], acompanante_desencriptar(self.acompanante.nombre))
        self.assertEqual(self.tercero_base['nombre_segundo'], acompanante_desencriptar(self.acompanante.nombre_segundo))
        self.assertEqual(self.tercero_base['apellido'], acompanante_desencriptar(self.acompanante.apellido))
        self.assertEqual(self.tercero_base['apellido_segundo'],
                         acompanante_desencriptar(self.acompanante.apellido_segundo))
        self.assertEqual(self.tercero_base['nro_identificacion'],
                         acompanante_desencriptar(self.acompanante.nro_identificacion))

    def test_acompanante_crear_alias_diferentes(self):
        from ..services import acompanante_crear
        from ..factories import AcompananteFactory
        with self.assertRaisesMessage(
                ValidationError,
                "{'alias_modelo': 'El alias %s ya existe, escoger otro.'}" % self.tercero_base['alias_modelo']
        ):
            tercero_base_dos = AcompananteFactory.build(
                usuario=None,
                categoria_modelo=self.categoria_modelo_dos
            )
            tercero_base_dos.pop('es_acompanante')
            tercero_base_dos.pop('usuario')
            tercero_base_dos['alias_modelo'] = self.tercero_base['alias_modelo']
            acompanante_crear(tercero_base_dos)

    def test_acompanante_crear_alias_nro_identificacion_diferente(self):
        from ..services import acompanante_crear
        from ..factories import AcompananteFactory
        with self.assertRaisesMessage(
                ValidationError,
                "{'nro_identificacion': 'No se puede crear acompañante porque ya existe un numero de identidad"
        ):
            tercero_base_dos = AcompananteFactory.build(
                usuario=None,
                categoria_modelo=self.categoria_modelo_dos
            )
            tercero_base_dos.pop('es_acompanante')
            tercero_base_dos.pop('usuario')
            tercero_base_dos['nro_identificacion'] = self.tercero_base['nro_identificacion']
            acompanante_crear(tercero_base_dos)

    def test_acompanante_crear_mayor_de_edad(self):
        from ..services import acompanante_crear
        from ..factories import AcompananteFactory
        with self.assertRaisesMessage(
                ValidationError,
                "{'edad': 'Debe ser mayor de edad para ser acompañante, La edad registrada es de"
        ):
            tercero_base_dos = AcompananteFactory.build(
                usuario=None,
                categoria_modelo=self.categoria_modelo_dos
            )
            tercero_base_dos.pop('es_acompanante')
            tercero_base_dos.pop('usuario')
            tercero_base_dos['fecha_nacimiento'] = faker.date_of_birth(tzinfo=None, minimum_age=0, maximum_age=17)
            acompanante_crear(tercero_base_dos)

    def test_acompanante_update_alias_diferentes(self):
        from ..services import acompanante_update
        # Valida que no se pueda crear dos alias iguales
        with self.assertRaisesMessage(
                ValidationError,
                'Es alias %s ya existe, escoger otro.' % self.acompanante.alias_modelo
        ):
            self.tercero_base_dos['alias_modelo'] = self.acompanante.alias_modelo
            acompanante_update(
                self.acompanante_dos.id,
                self.tercero_base_dos
            )

    def test_acompanante_update_nro_identidad_diferentes(self):
        from ..services import acompanante_update
        # Valida que no se pueda crear dos alias iguales
        with self.assertRaisesMessage(
                ValidationError,
                "{'nro_identificacion': 'No se puede crear acompañante porque ya existe un numero de identidad"
        ):
            self.tercero_base_dos['nro_identificacion'] = self.tercero_base['nro_identificacion']
            acompanante_update(
                self.acompanante_dos.id,
                self.tercero_base_dos
            )

    def test_acompanante_update_encripta_desencripta(self):
        from ..services import acompanante_update, acompanante_desencriptar
        nuevo_nombre = 'nuevo nombre'
        nuevo_nombre_dos = 'nuevo nombre_dos'
        nuevo_apellido = 'Nuevo Apellido'
        nuevo_apellido_dos = 'nuevo Apellido dos'
        nuevo_nro_identificacion = '1234nc1324'
        self.tercero_base['nombre'] = nuevo_nombre
        self.tercero_base['nombre_segundo'] = nuevo_nombre_dos
        self.tercero_base['apellido'] = nuevo_apellido
        self.tercero_base['apellido_segundo'] = nuevo_apellido_dos
        self.tercero_base['nro_identificacion'] = nuevo_nro_identificacion
        acompanante2 = acompanante_update(
            self.acompanante.id,
            self.tercero_base
        )
        self.assertEqual(nuevo_nombre, acompanante_desencriptar(acompanante2.nombre))
        self.assertEqual(nuevo_apellido, acompanante_desencriptar(acompanante2.apellido))
        self.assertEqual(nuevo_nro_identificacion, acompanante_desencriptar(acompanante2.nro_identificacion))

    def test_acompanante_update_mayor_de_edad(self):
        from ..services import acompanante_update
        # Valida que no se puedan crear menores de edad
        with self.assertRaisesMessage(
                ValidationError,
                'Debe ser mayor de edad para ser acompañante. La edad registrada es de'
        ):
            self.tercero_base['fecha_nacimiento'] = faker.date_of_birth(tzinfo=None, minimum_age=0, maximum_age=17)
            acompanante_update(
                self.acompanante.id,
                self.tercero_base
            )

    def test_acompanante_encriptar_desencriptar(self):
        from ..services import acompanante_desencriptar, acompanante_encriptar
        secreto = 'esta es la frase que vamos a encriptar'
        texto_encriptado = acompanante_encriptar(secreto)
        self.assertNotEqual(texto_encriptado, secreto)
        texto_claro = acompanante_desencriptar(texto_encriptado)
        self.assertEqual(texto_claro, secreto)

    def test_acompanante_existe_alias(self):
        from ..services import tercero_existe_alias
        self.assertTrue(tercero_existe_alias(self.acompanante.alias_modelo))

    def test_tercero_existe_documento_acompanante(self):
        from ..services import tercero_existe_documento, acompanante_encriptar
        self.assertTrue(tercero_existe_documento(acompanante_encriptar(self.tercero_base['nro_identificacion'])))


class ColaboradorTests(TestCase):
    def setUp(self):
        from ..factories import ColaboradorFactory
        from usuarios.factories import UserFactory
        from ..services import colaborador_crear
        self.usuario = UserFactory()

        self.tercero_base = ColaboradorFactory.build(usuario=None)
        self.tercero_base.pop('es_colaborador')
        self.tercero_base.pop('usuario')
        self.colaborador = colaborador_crear(self.tercero_base)

    def test_colaborador_crear(self):
        from ..services import colaborador_crear
        from ..factories import ColaboradorFactory
        count = Tercero.objects.count()
        tercero_base = ColaboradorFactory.build(usuario=None)
        tercero_base.pop('es_colaborador')
        tercero_base.pop('usuario')
        colaborador_nuevo = colaborador_crear(tercero_base)
        self.assertEqual(count + 1, Tercero.objects.count())
        username = ('co-%s%s%s' % (colaborador_nuevo.nombre[0:3], colaborador_nuevo.apellido[0:3],
                                   colaborador_nuevo.apellido_segundo[0:3])).lower()
        self.assertEqual(username, colaborador_nuevo.usuario.username)

    def test_colaborador_crear_nro_identidad_diferente(self):
        from ..services import colaborador_crear
        from ..factories import ColaboradorFactory
        tercero_base = ColaboradorFactory.build(usuario=None)
        tercero_base.pop('es_colaborador')
        tercero_base.pop('usuario')
        tercero_base['nro_identificacion'] = self.tercero_base['nro_identificacion']
        with self.assertRaisesMessage(
                ValidationError,
                "{'nro_identificacion': 'No se puede crear colaborador porque ya existe un numero de identidad"
        ):
            colaborador_crear(tercero_base)

    def test_colaborador_crear_username_sin_apellido_segundo(self):
        from ..services import colaborador_crear
        from ..factories import ColaboradorFactory
        tercero_base = ColaboradorFactory.build(usuario=None)
        tercero_base.pop('es_colaborador')
        tercero_base.pop('usuario')
        tercero_base.pop('apellido_segundo')
        colaborador_nuevo = colaborador_crear(tercero_base)
        username = ('co-%s%s' % (tercero_base['nombre'][0:3], tercero_base['apellido'][0:3])).lower()
        self.assertEqual(username, colaborador_nuevo.usuario.username)

    def test_colaborador_crear_username_mas_uno_repetido(self):
        from ..services import colaborador_crear
        from ..factories import ColaboradorFactory
        tercero_base_dos = ColaboradorFactory.build(usuario=None)
        tercero_base_dos.pop('es_colaborador')
        tercero_base_dos['nombre'] = self.tercero_base['nombre']
        tercero_base_dos['apellido'] = self.tercero_base['apellido']
        tercero_base_dos['apellido_segundo'] = self.tercero_base['apellido_segundo']
        tercero_base_dos.pop('usuario')
        colaborador_nuevo = colaborador_crear(tercero_base_dos)
        username = ('co-%s%s%s1' % (tercero_base_dos['nombre'][0:3], tercero_base_dos['apellido'][0:3],
                                    tercero_base_dos['apellido_segundo'][0:3])).lower()
        self.assertEqual(username, colaborador_nuevo.usuario.username)

    def test_colaborador_update(self):
        from ..services import colaborador_update
        self.tercero_base['nombre'] = 'Carlos'
        self.tercero_base['apellido'] = 'Martinez'
        colaborador = colaborador_update(self.colaborador.id, self.tercero_base)
        self.assertEqual('Carlos', colaborador.nombre)
        self.assertEqual('Martinez', colaborador.apellido)

    def test_colaborador_update_nro_identidad_diferente(self):
        from ..services import colaborador_update, colaborador_crear
        from ..factories import ColaboradorFactory
        tercero_base_dos = ColaboradorFactory.build(usuario=None)
        tercero_base_dos.pop('es_colaborador')
        tercero_base_dos.pop('usuario')
        colaborador_crear(tercero_base_dos)

        with self.assertRaisesMessage(
                ValidationError,
                "{'nro_identificacion': 'No se puede actualizar colaborador porque ya existe un numero de identidad"
        ):
            self.tercero_base['nro_identificacion'] = tercero_base_dos['nro_identificacion']
            colaborador_update(self.colaborador.id, self.tercero_base)

    def test_tercero_existe_documento_colaborador(self):
        from ..services import tercero_existe_documento
        self.assertTrue(tercero_existe_documento(self.colaborador.nro_identificacion))
