from django.test import TestCase
from faker import Faker
from rest_framework.exceptions import ValidationError

faker = Faker()


class PuntoVentaTests(TestCase):
    def setUp(self):
        from ..factories import PuntoVentaFactory
        from usuarios.factories import UserFactory
        from terceros.factories import AcompananteFactory, ColaboradorFactory
        from terceros.services import tercero_set_new_pin
        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)
        self.punto_venta_abierto = PuntoVentaFactory(abierto=True)

        self.user_sin_tercero = UserFactory()

        self.acompanante = AcompananteFactory(usuario=UserFactory())
        self.colaborador = ColaboradorFactory(usuario=UserFactory())
        self.colaborador_dos = ColaboradorFactory(usuario=UserFactory())
        tercero_set_new_pin(self.colaborador.id, '1111')
        tercero_set_new_pin(self.colaborador_dos.id, '1111')

    def test_punto_venta_abrir(self):
        from ..services import punto_venta_abrir
        from terceros.services import tercero_registra_entrada
        tercero_registra_entrada(self.colaborador.id, '1111')
        punto_venta, punto_venta_turno = punto_venta_abrir(
            usuario_pv_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id
        )
        self.assertTrue(punto_venta.abierto)
        self.assertEqual(punto_venta_turno.punto_venta, punto_venta)
        self.colaborador.refresh_from_db()
        self.assertEqual(self.colaborador.turno_punto_venta_abierto, punto_venta_turno)
        self.assertIsNone(punto_venta_turno.finish)
        self.assertEqual(punto_venta.usuario_actual.id, self.colaborador.usuario_id)

    def test_punto_venta_abrir_solo_punto_venta_cerrados(self):
        from ..services import punto_venta_abrir
        self.punto_venta.abierto = True
        self.punto_venta.save()
        with self.assertRaisesMessage(
                ValidationError,
                'Este punto de venta ya esta abierto'
        ):
            punto_venta_abrir(
                usuario_pv_id=self.colaborador.usuario.id,
                punto_venta_id=self.punto_venta.id
            )

    def test_punto_venta_abrir_solo_para_usuarios_con_tercero(self):
        from ..services import punto_venta_abrir
        with self.assertRaisesMessage(
                ValidationError,
                'No se puede abrir un punto de venta a un usuario sin tercero'
        ):
            punto_venta_abrir(
                usuario_pv_id=self.user_sin_tercero.id,
                punto_venta_id=self.punto_venta.id
            )

    def test_punto_venta_abrir_solo_para_colaboradores(self):
        from ..services import punto_venta_abrir
        with self.assertRaisesMessage(
                ValidationError,
                'No se puede abrir un punto de venta a alguien que no sea colaborador'
        ):
            punto_venta_abrir(
                usuario_pv_id=self.acompanante.usuario.id,
                punto_venta_id=self.punto_venta.id
            )

    def test_punto_venta_abrir_solo_sin_turno_abierto(self):
        from ..services import punto_venta_abrir, punto_venta_cerrar
        from terceros.services import tercero_registra_entrada
        tercero_registra_entrada(self.colaborador.id, '1111')
        punto_venta, punto_venta_turno = punto_venta_abrir(
            usuario_pv_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id
        )
        punto_venta_cerrar(
            usuario_pv_id=punto_venta.usuario_actual.id,
            punto_venta_id=punto_venta.id
        )
        punto_venta_turno.finish = None
        punto_venta_turno.save()

        with self.assertRaisesMessage(
                ValidationError,
                'Este usuario ya tiene un turno abierto y debe cerrarlo primero antes de abrir otro turno. El turno esta abierto en el punto'
        ):
            punto_venta_abrir(
                usuario_pv_id=self.colaborador.usuario.id,
                punto_venta_id=self.punto_venta.id
            )

    def test_punto_venta_cerrar(self):
        from ..services import punto_venta_cerrar, punto_venta_abrir
        from terceros.services import tercero_registra_entrada
        tercero_registra_entrada(self.colaborador.id, '1111')
        punto_venta, punto_venta_turno = punto_venta_abrir(
            usuario_pv_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id
        )

        punto_venta = punto_venta_cerrar(
            usuario_pv_id=punto_venta.usuario_actual.id,
            punto_venta_id=punto_venta.id
        )
        self.assertFalse(punto_venta.abierto)
        self.assertIsNone(punto_venta.usuario_actual)

    def test_punto_venta_cerrar_solo_mismo_usuario(self):
        from ..services import punto_venta_cerrar, punto_venta_abrir
        from terceros.services import tercero_registra_entrada
        tercero_registra_entrada(self.colaborador.id, '1111')
        punto_venta, punto_venta_turno = punto_venta_abrir(
            usuario_pv_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id
        )
        with self.assertRaisesMessage(
                ValidationError,
                'El usuario que intenta cerrar este punto de venta no es el mismo que lo tiene actualmente abierto. Quien lo tiene abierto es'
        ):
            punto_venta_cerrar(
                usuario_pv_id=self.acompanante.usuario.id,
                punto_venta_id=punto_venta.id
            )

    def test_punto_venta_cerrar_solo_abiertos(self):
        from ..services import punto_venta_cerrar, punto_venta_abrir
        from terceros.services import tercero_registra_entrada
        tercero_registra_entrada(self.colaborador.id, '1111')
        punto_venta, punto_venta_turno = punto_venta_abrir(
            usuario_pv_id=self.colaborador.usuario.id,
            punto_venta_id=self.punto_venta.id
        )
        punto_venta.abierto = False
        punto_venta.save()
        with self.assertRaisesMessage(
                ValidationError,
                'Este punto de venta ya esta cerrado'
        ):
            punto_venta_cerrar(
                usuario_pv_id=punto_venta.usuario_actual.id,
                punto_venta_id=punto_venta.id
            )
