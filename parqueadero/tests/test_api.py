from django.utils import timezone

from ..models import (
    TipoVehiculo,
    Vehiculo,
    ModalidadFraccionTiempo,
    ModalidadFraccionTiempoDetalle,
    RegistroEntradaParqueo
)
from dr_amor_app.utilities_tests.test_api_base import BaseTestsApi

from faker import Faker

faker = Faker()


class RegistroEntradaParqueoTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import (
            TipoVehiculoFactory,
            VehiculoFactory,
            RegistroEntradaParqueoFactory,
            ModalidadFraccionTiempoFactory
        )
        from puntos_venta.factories import PuntoVentaTurnoFactory
        super().setUp()
        self.punto_venta_turno = PuntoVentaTurnoFactory()
        self.tipo_vehiculo = TipoVehiculoFactory()
        self.vehiculo = VehiculoFactory()
        self.Factory = RegistroEntradaParqueoFactory
        self.url = '/api/parqueadero_registros_entradas_parqueos/'
        self.permiso = 'registroentradaparqueo'
        self.modelo = RegistroEntradaParqueo
        self.modalidad_fraccion_tiempo = ModalidadFraccionTiempoFactory()
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['modalidad_fraccion_tiempo'] = self.modalidad_fraccion_tiempo.id
        self.data_for_create_test['punto_venta_turno'] = self.punto_venta_turno.id
        self.data_for_create_test['vehiculo'] = self.vehiculo.id
        self.data_for_create_test['placa'] = self.vehiculo.placa
        self.data_for_create_test['hora_salida'] = timezone.now()
        self.data_for_update_test = {'hora_salida': timezone.now()}

    def test_ingreso_no_autorizado(self):
        self.ingreso_no_autorizado()

    def test_crear(self):
        self.crear()

    # def test_update(self):
    #     self.update()

    def test_delete(self):
        self.delete()

    def test_list(self):
        self.list()

    def test_por_salir(self):
        from ..factories import RegistroEntradaParqueoFactory
        RegistroEntradaParqueoFactory(hora_salida=timezone.now())
        RegistroEntradaParqueoFactory()
        RegistroEntradaParqueoFactory()
        response = self.list_route_get('por_salir/')
        self.assertEqual(len(response.data), 2)


class TipoVehiculoTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import TipoVehiculoFactory
        from empresas.factories import EmpresaFactory
        super().setUp()
        self.empresa = EmpresaFactory()
        self.Factory = TipoVehiculoFactory
        self.url = '/api/parqueadero_tipos_vehiculos/'
        self.permiso = 'tipovehiculo'
        self.modelo = TipoVehiculo
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['empresa'] = self.empresa.id
        self.data_for_update_test = {'nombre': 'probando'}

    def test_ingreso_no_autorizado(self):
        self.ingreso_no_autorizado()

    def test_crear(self):
        self.crear()

    def test_update(self):
        self.update()

    def test_delete(self):
        self.delete()

    def test_list(self):
        self.list()


class VehiculoTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import VehiculoFactory, TipoVehiculoFactory
        super().setUp()
        self.tipo_vehiculo = TipoVehiculoFactory()
        self.Factory = VehiculoFactory
        self.url = '/api/parqueadero_vehiculos/'
        self.permiso = 'vehiculo'
        self.modelo = Vehiculo
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['tipo_vehiculo'] = self.tipo_vehiculo.id
        self.data_for_update_test = {'placa': 'NNN'}

    def test_ingreso_no_autorizado(self):
        self.ingreso_no_autorizado()

    def test_crear(self):
        self.crear()

    def test_update(self):
        self.update()

    def test_delete(self):
        self.delete()

    def test_list(self):
        self.list()


class ModalidadFraccionTiempoTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import ModalidadFraccionTiempoFactory, TipoVehiculoFactory
        super().setUp()
        self.tipo_vehiculo = TipoVehiculoFactory()
        self.Factory = ModalidadFraccionTiempoFactory
        self.url = '/api/parqueadero_modalidades_fracciones_tiempos/'
        self.permiso = 'modalidadfracciontiempo'
        self.modelo = ModalidadFraccionTiempo
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['tipo_vehiculo'] = self.tipo_vehiculo.id
        self.data_for_update_test = {'placa': 'NNN'}

    def test_ingreso_no_autorizado(self):
        self.ingreso_no_autorizado()

    def test_crear(self):
        self.crear()

    def test_update(self):
        self.update()

    def test_delete(self):
        self.delete()

    def test_list(self):
        self.list()


class ModalidadFraccionTiempoDetalleTestsApi(BaseTestsApi):
    def setUp(self):
        from ..factories import ModalidadFraccionTiempoFactory, ModalidadFraccionTiempoDetalleFactory
        super().setUp()
        self.modalidad_fraccion_tiempo = ModalidadFraccionTiempoFactory()
        self.Factory = ModalidadFraccionTiempoDetalleFactory
        self.url = '/api/parqueadero_modalidades_fracciones_tiempos_detalles/'
        self.permiso = 'modalidadfracciontiempodetalle'
        self.modelo = ModalidadFraccionTiempoDetalle
        self.data_for_create_test = self.Factory.stub().__dict__
        self.data_for_create_test['modalidad_fraccion_tiempo'] = self.modalidad_fraccion_tiempo.id
        self.data_for_update_test = {'placa': 'NNN'}

    def test_ingreso_no_autorizado(self):
        self.ingreso_no_autorizado()

    def test_crear(self):
        self.crear()

    def test_update(self):
        self.update()

    def test_delete(self):
        self.delete()

    def test_list(self):
        self.list()

    def test_por_movimiento(self):
        from ..factories import ModalidadFraccionTiempoDetalleFactory
        mftd_uno = ModalidadFraccionTiempoDetalleFactory(minutos=60, valor=2000)
        ModalidadFraccionTiempoDetalleFactory(minutos=60, valor=2000)
        modalidad_fraccion_tiempo = mftd_uno.modalidad_fraccion_tiempo
        ModalidadFraccionTiempoDetalleFactory(
            modalidad_fraccion_tiempo=modalidad_fraccion_tiempo,
            minutos=70,
            valor=3000
        )
        response = self.list_route_get('por_movimiento/?modalidad_fraccion_tiempo_id=%s' % modalidad_fraccion_tiempo.id)
        self.assertEqual(len(response.data), 2)
