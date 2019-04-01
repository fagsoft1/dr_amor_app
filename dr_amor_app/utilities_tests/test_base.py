import random

from django.db.models import Sum
from django.test import TestCase
from django.utils import timezone

from productos.models import Producto
from puntos_venta.models import PuntoVenta
from terceros.models import Tercero
from ventas.models import VentaProducto


class BaseTest(TestCase):
    def habitacionesSetUp(self):
        from empresas.factories import EmpresaFactory
        from habitaciones.factories import HabitacionFactory, TipoHabitacionFactory
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

    def acompanantesSetUp(self):
        # region Categorias Modelos
        from terceros_acompanantes.factories import (
            CategoriaFraccionTiempoFactory,
            FraccionTiempoFactory,
            CategoriaAcompananteFactory
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
        # endregion

        # region Acompanantes
        from terceros.factories import AcompananteFactory
        from terceros.services import (
            acompanante_crear,
            tercero_set_new_pin,
            tercero_registra_entrada
        )

        # region Acompañante uno
        self.acompanante_base = AcompananteFactory.build(
            categoria_modelo=self.categoria_modelo
        )
        self.acompanante_base.pop('es_acompanante')
        self.acompanante_base.pop('usuario')
        self.acompanante = acompanante_crear(self.acompanante_base)
        self.acompanante, pin = tercero_set_new_pin(tercero_id=self.acompanante.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=self.acompanante.id, raw_pin='0000')
        # endregion

        # region Acompañante dos
        self.acompanante_base_dos = AcompananteFactory.build(
            categoria_modelo=self.categoria_modelo
        )
        self.acompanante_base_dos.pop('es_acompanante')
        self.acompanante_base_dos.pop('usuario')
        self.acompanante_dos = acompanante_crear(self.acompanante_base_dos)

        self.acompanante_dos, pin = tercero_set_new_pin(tercero_id=self.acompanante_dos.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=self.acompanante_dos.id, raw_pin='0000')
        # endregion

        # endregion

    def colaboradoresSetUp(self):
        # region Puntos de Venta
        from puntos_venta.factories import PuntoVentaFactory
        from puntos_venta.services import punto_venta_abrir
        self.punto_venta = PuntoVentaFactory(abierto=False, usuario_actual=None)
        self.bodega = self.punto_venta.bodega
        self.bodega.es_principal = False
        self.bodega.save()
        # endregion

        # region Colaboradores
        from terceros.factories import ColaboradorFactory
        from terceros.services import tercero_registra_entrada, tercero_set_new_pin, colaborador_crear

        # region Colaborador Uno
        self.colaborador_base = ColaboradorFactory.build(usuario=None)
        self.colaborador_base.pop('es_colaborador')
        self.colaborador_base.pop('usuario')
        self.colaborador_cajero = colaborador_crear(self.colaborador_base)

        tercero_set_new_pin(
            tercero_id=self.colaborador_cajero.id,
            raw_pin='0000'
        )
        tercero_registra_entrada(
            tercero_id=self.colaborador_cajero.id,
            raw_pin='0000'
        )
        self.punto_venta, self.punto_venta_turno = punto_venta_abrir(
            usuario_pv_id=self.colaborador_cajero.usuario.id,
            punto_venta_id=self.punto_venta.id
        )
        # endregion

        # region Colaborador Dos

        self.colaborador_dos_base = ColaboradorFactory.build(usuario=None)
        self.colaborador_dos_base.pop('es_colaborador')
        self.colaborador_dos_base.pop('usuario')
        self.colaborador_dos = colaborador_crear(self.colaborador_dos_base)

        tercero_set_new_pin(
            tercero_id=self.colaborador_dos.id,
            raw_pin='0000'
        )
        tercero_registra_entrada(
            tercero_id=self.colaborador_dos.id,
            raw_pin='0000'
        )
        # endregion

        # region Colaborador Mesero

        self.colaborador_tres_base = ColaboradorFactory.build(usuario=None)
        self.colaborador_tres_base.pop('es_colaborador')
        self.colaborador_tres_base.pop('usuario')
        self.colaborador_mesero = colaborador_crear(self.colaborador_tres_base)

        tercero_set_new_pin(
            tercero_id=self.colaborador_mesero.id,
            raw_pin='0000'
        )
        tercero_registra_entrada(
            tercero_id=self.colaborador_mesero.id,
            raw_pin='0000'
        )
        # endregion

        # region Colaborador Mesero Dos

        self.colaborador_cuatro_base = ColaboradorFactory.build(usuario=None)
        self.colaborador_cuatro_base.pop('es_colaborador')
        self.colaborador_cuatro_base.pop('usuario')
        self.colaborador_mesero_dos = colaborador_crear(self.colaborador_cuatro_base)

        tercero_set_new_pin(
            tercero_id=self.colaborador_mesero_dos.id,
            raw_pin='0000'
        )
        tercero_registra_entrada(
            tercero_id=self.colaborador_mesero_dos.id,
            raw_pin='0000'
        )
        # endregion
        # endregion

    def ventasProductosInventarioInicialSetUp(self):
        from inventarios.factories import MovimientoInventarioDetalleFactory
        from inventarios.services import (
            movimiento_inventario_aplicar_movimiento,
            movimiento_inventario_saldo_inicial_crear
        )
        movimiento = movimiento_inventario_saldo_inicial_crear(
            fecha=timezone.now(),
            bodega_destino_id=self.bodega.id,
            usuario_id=self.colaborador_cajero.usuario.id

        )
        self.mid_uno = MovimientoInventarioDetalleFactory(
            movimiento=movimiento,
            entra_cantidad=100,
            entra_costo=100000
        )
        self.mid_dos = MovimientoInventarioDetalleFactory(
            movimiento=movimiento,
            entra_cantidad=80,
            entra_costo=70000
        )
        self.mid_tres = MovimientoInventarioDetalleFactory(
            movimiento=movimiento,
            entra_cantidad=85,
            entra_costo=120000
        )
        movimiento_inventario_aplicar_movimiento(
            movimiento_inventario_id=movimiento.id
        )

    def crear_inventarios_productos(self, nro_referencias: int = 5):
        from inventarios.factories import MovimientoInventarioDetalleFactory
        from inventarios.services import (
            movimiento_inventario_aplicar_movimiento,
            movimiento_inventario_saldo_inicial_crear
        )
        movimiento = movimiento_inventario_saldo_inicial_crear(
            fecha=timezone.now(),
            bodega_destino_id=self.bodega.id,
            usuario_id=self.colaborador_cajero.usuario.id

        )
        for i in range(nro_referencias):
            MovimientoInventarioDetalleFactory(
                movimiento=movimiento,
                entra_cantidad=random.randint(50, 300),
                entra_costo=random.randrange(20000, 50000)
            )
        movimiento_inventario_aplicar_movimiento(movimiento_inventario_id=movimiento.id)
        return movimiento.detalles.values_list('producto_id', flat=True)

    def hacer_venta_productos_dos(
            self,
            punto_venta: PuntoVenta,
            nro_referencias: int = 5,
            cliente: Tercero = None,
            mesero: Tercero = None
    ) -> [VentaProducto, dict]:
        from ventas.services import venta_producto_efectuar_venta
        from terceros.services import tercero_generarQR
        if not Producto.objects.exists():
            array_id_productos = self.crear_inventarios_productos(nro_referencias)
        else:
            array_id_productos = Producto.objects.values_list('pk', flat=True)

        pedido = []
        informacion = {
            'valor_venta': 0
        }

        for i in range(len(array_id_productos)):
            pedido.append({
                'producto_id': array_id_productos[i],
                'precio_total': random.randrange(20000, 50000),
                'cantidad': random.randint(2, 7)
            })

        if mesero:
            venta = venta_producto_efectuar_venta(
                usuario_pdv_id=self.colaborador_cajero.usuario.id,
                punto_venta_id=punto_venta.id,
                tipo_venta=2,
                pedidos=pedido,
                cliente_usuario_id=mesero.usuario.id,
                cliente_qr_codigo=tercero_generarQR(mesero.id).qr_acceso
            )
        else:
            venta = venta_producto_efectuar_venta(
                usuario_pdv_id=self.colaborador_cajero.usuario.id,
                punto_venta_id=punto_venta.id,
                tipo_venta=3,
                pedidos=pedido,
                cliente_usuario_id=cliente.usuario.id,
                cliente_qr_codigo=tercero_generarQR(cliente.id).qr_acceso
            )

        valor_venta = venta.productos.aggregate(valor=Sum('precio_total'))
        informacion['valor_venta'] = valor_venta['valor']
        return venta, informacion

    def hacer_operaciones_caja_dos(
            self, tercero: Tercero = None,
            cantidad_operaciones=5
    ) -> [float, float]:
        from cajas.factories import ConceptoOperacionCajaFactory
        from cajas.services import operacion_caja_crear
        if tercero.es_colaborador:
            concepto_ingreso = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='C'
            )
            concepto_egreso = ConceptoOperacionCajaFactory(
                tipo='E',
                grupo='C'
            )
        elif tercero.es_acompanante:
            concepto_ingreso = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='A'
            )
            concepto_egreso = ConceptoOperacionCajaFactory(
                tipo='E',
                grupo='A'
            )
        elif tercero.es_proveedor:
            concepto_ingreso = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='P'
            )
            concepto_egreso = ConceptoOperacionCajaFactory(
                tipo='E',
                grupo='P'
            )
        else:
            concepto_ingreso = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo=random.choice(['T', 'O'])
            )
            concepto_egreso = ConceptoOperacionCajaFactory(
                tipo='E',
                grupo=concepto_ingreso.grupo
            )

        valor_egresos = 0
        valor_ingresos = 0
        for i in range(cantidad_operaciones):
            valor_egreso = random.randrange(20000, 50000)
            valor_egresos += valor_egreso

            valor_ingreso = random.randrange(20000, 50000)
            valor_ingresos += valor_ingreso

            operacion_caja_crear(
                concepto_id=concepto_egreso.id,
                usuario_pdv_id=self.colaborador_cajero.usuario.id,
                descripcion='algo egreso %s' % i,
                valor=valor_egreso,
                tercero_id=tercero.id if tercero else None,
                observacion='probando'
            )

            operacion_caja_crear(
                concepto_id=concepto_ingreso.id,
                usuario_pdv_id=self.colaborador_cajero.usuario.id,
                descripcion='algo ingreso %s' % i,
                valor=valor_ingreso,
                tercero_id=tercero.id if tercero else None,
                observacion='probando'
            )
        return valor_ingresos, valor_egresos

    def hacer_servicios_dos(
            self,
            acompanante,
            habitacion,
            punto_venta,
            terminados=False,
            comision=0,
            iniciados=False,
            acompanante_dos=None,
            acompanante_tres=None,
            nro_servicios=5
    ):
        from servicios.services import servicio_crear_nuevo, servicio_iniciar
        from habitaciones.services import habitacion_terminar_servicios

        nro_servicios = nro_servicios if nro_servicios > 3 else 3

        tipo_habitacion = habitacion.tipo
        tipo_habitacion.comision = comision
        tipo_habitacion.save()
        valor_totat_todos_los_servicio = 0
        valor_totat_todos_los_ivas = 0
        valor_totat_habitaciones = 0

        array_servicios_1 = []
        array_servicios_2 = []
        array_servicios_3 = []

        array_categorias_fracciones_tiempo = [
            self.categoria_fraccion_tiempo_30.id,
            self.categoria_fraccion_tiempo_45.id,
            self.categoria_fraccion_tiempo_60.id
        ]

        valores_totales_servicios = {
            'valor_totat_todos_los_servicio': 0,
            'valor_totat_todos_los_ivas': 0,
            'valor_totat_habitaciones': 0,
            'acompanante_1': {
                'valor_servicio': 0,
                'valor_habitacion': 0,
                'valor_iva': 0,
                'comision': 0,
                'servicios': [],
                'array_servicios': [],
            },
            'acompanante_2': {
                'valor_servicio': 0,
                'valor_habitacion': 0,
                'valor_iva': 0,
                'comision': 0,
                'servicios': [],
                'array_servicios': [],
            },
            'acompanante_3': {
                'valor_servicio': 0,
                'valor_habitacion': 0,
                'valor_iva': 0,
                'comision': 0,
                'servicios': [],
                'array_servicios': [],
            },
        }

        for i in range(nro_servicios):
            servicio = servicio_crear_nuevo(
                habitacion_id=habitacion.id,
                acompanante_id=acompanante.id,
                categoria_fraccion_tiempo_id=random.choice(array_categorias_fracciones_tiempo),
                usuario_pdv_id=punto_venta.usuario_actual.id
            )
            array_servicios_1.append(servicio.pk)
        if acompanante_dos:
            for i in range(nro_servicios - 1):
                servicio = servicio_crear_nuevo(
                    habitacion_id=habitacion.id,
                    acompanante_id=acompanante_dos.id,
                    categoria_fraccion_tiempo_id=random.choice(array_categorias_fracciones_tiempo),
                    usuario_pdv_id=punto_venta.usuario_actual.id
                )
                array_servicios_2.append(servicio.pk)
        if acompanante_tres:
            for i in range(nro_servicios - 2):
                servicio = servicio_crear_nuevo(
                    habitacion_id=habitacion.id,
                    acompanante_id=acompanante_tres.id,
                    categoria_fraccion_tiempo_id=random.choice(array_categorias_fracciones_tiempo),
                    usuario_pdv_id=punto_venta.usuario_actual.id
                )
                array_servicios_3.append(servicio.pk)

        if iniciados:
            for i in range(nro_servicios):
                servicio = servicio_iniciar(
                    servicio_id=array_servicios_1[i],
                    usuario_pdv_id=punto_venta.usuario_actual.id
                )
                valor_iva = servicio.valor_iva_habitacion
                valor_habitacion = servicio.valor_habitacion
                valor_servicio = servicio.valor_servicio
                comision = servicio.comision
                valores_totales_servicios['acompanante_1']['valor_servicio'] += valor_servicio
                valores_totales_servicios['acompanante_1']['valor_iva'] += valor_iva
                valores_totales_servicios['acompanante_1']['valor_habitacion'] += valor_habitacion
                valores_totales_servicios['acompanante_1']['comision'] += comision
                valores_totales_servicios['acompanante_1']['servicios'].append(servicio)
                valor_totat_todos_los_servicio += valor_servicio
                valor_totat_habitaciones += valor_habitacion
                valor_totat_todos_los_ivas += valor_iva

            if acompanante_dos:
                for i in range(nro_servicios - 1):
                    servicio = servicio_iniciar(
                        servicio_id=array_servicios_2[i],
                        usuario_pdv_id=punto_venta.usuario_actual.id
                    )
                    valor_iva = servicio.valor_iva_habitacion
                    valor_habitacion = servicio.valor_habitacion
                    valor_servicio = servicio.valor_servicio
                    comision = servicio.comision
                    valores_totales_servicios['acompanante_2']['valor_servicio'] += valor_servicio
                    valores_totales_servicios['acompanante_2']['valor_iva'] += valor_iva
                    valores_totales_servicios['acompanante_2']['valor_habitacion'] += valor_habitacion
                    valores_totales_servicios['acompanante_2']['comision'] += comision
                    valores_totales_servicios['acompanante_2']['servicios'].append(servicio)
                    valor_totat_todos_los_servicio += valor_servicio
                    valor_totat_habitaciones += valor_habitacion
                    valor_totat_todos_los_ivas += valor_iva

            if acompanante_tres:
                for i in range(nro_servicios - 2):
                    servicio = servicio_iniciar(
                        servicio_id=array_servicios_3[i],
                        usuario_pdv_id=punto_venta.usuario_actual.id
                    )
                    valor_iva = servicio.valor_iva_habitacion
                    valor_habitacion = servicio.valor_habitacion
                    valor_servicio = servicio.valor_servicio
                    comision = servicio.comision
                    valores_totales_servicios['acompanante_3']['valor_servicio'] += valor_servicio
                    valores_totales_servicios['acompanante_3']['valor_iva'] += valor_iva
                    valores_totales_servicios['acompanante_3']['valor_habitacion'] += valor_habitacion
                    valores_totales_servicios['acompanante_3']['comision'] += comision
                    valores_totales_servicios['acompanante_3']['servicios'].append(servicio)
                    valor_totat_todos_los_servicio += valor_servicio
                    valor_totat_habitaciones += valor_habitacion
                    valor_totat_todos_los_ivas += valor_iva

        valores_totales_servicios['acompanante_1']['array_servicios'] = array_servicios_1
        valores_totales_servicios['acompanante_2']['array_servicios'] = array_servicios_2
        valores_totales_servicios['acompanante_3']['array_servicios'] = array_servicios_3
        valores_totales_servicios['valor_totat_todos_los_servicio'] = valor_totat_todos_los_servicio
        valores_totales_servicios['valor_totat_habitaciones'] = valor_totat_habitaciones
        valores_totales_servicios['valor_totat_todos_los_ivas'] = valor_totat_todos_los_ivas

        if terminados:
            habitacion = habitacion_terminar_servicios(
                habitacion_id=habitacion.id,
                usuario_pdv_id=punto_venta.usuario_actual.id
            )
            habitacion.estado = 0
            habitacion.save()

        return valores_totales_servicios
