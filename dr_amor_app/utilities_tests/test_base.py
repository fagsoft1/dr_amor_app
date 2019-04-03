import random

from django.db.models import Sum
from django.test import TestCase
from django.utils import timezone

from productos.models import Producto
from puntos_venta.models import PuntoVenta
from terceros.models import Tercero
from ventas.models import VentaProducto


class BaseTest(TestCase):
    def usuariosSetUp(self):
        from usuarios.factories import UserFactory
        self.usuario_sin_tercero = UserFactory()

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

        self.tipo_habitacion_tres = TipoHabitacionFactory(
            valor=35000,
            porcentaje_impuesto=19,
        )

        self.habitacion = HabitacionFactory(tipo=self.tipo_habitacion_uno)
        self.habitacion_dos = HabitacionFactory(tipo=self.tipo_habitacion_dos)
        self.habitacion_tres = HabitacionFactory(tipo=self.tipo_habitacion_tres)

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

        # region Acompañante tres
        self.acompanante_base_tres = AcompananteFactory.build(
            categoria_modelo=self.categoria_modelo
        )
        self.acompanante_base_tres.pop('es_acompanante')
        self.acompanante_base_tres.pop('usuario')
        self.acompanante_tres = acompanante_crear(self.acompanante_base_tres)

        self.acompanante_tres, pin = tercero_set_new_pin(tercero_id=self.acompanante_tres.id, raw_pin='0000')
        tercero_registra_entrada(tercero_id=self.acompanante_tres.id, raw_pin='0000')
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
        self.punto_venta_dos = PuntoVentaFactory(abierto=False, usuario_actual=None)
        self.bodega_dos = self.punto_venta.bodega
        self.bodega_dos.es_principal = False
        self.bodega_dos.save()
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
            punto_venta_id=self.punto_venta.id,
            saldo_cierre_caja_anterior=1000000,
            base_inicial_efectivo=500000
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
        from productos.factories import ProductoFactory
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
            producto = ProductoFactory(precio_venta=random.randrange(1000, 4000))
            entra_cantidad = random.randint(300, 1000)
            entra_costo = (producto.precio_venta - producto.precio_venta * 0.3) * entra_cantidad
            MovimientoInventarioDetalleFactory(
                producto=producto,
                movimiento=movimiento,
                entra_cantidad=entra_cantidad,
                entra_costo=entra_costo
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
            self,
            tercero: Tercero = None,
            cantidad_operaciones: int = 5,
            colaborador_cajero=None,
    ) -> [float, float]:
        from cajas.factories import ConceptoOperacionCajaFactory
        from cajas.services import operacion_caja_crear
        if not colaborador_cajero:
            colaborador_cajero = self.colaborador_cajero
        if tercero and tercero.es_colaborador:
            concepto_ingreso = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='C'
            )
            concepto_egreso = ConceptoOperacionCajaFactory(
                tipo='E',
                grupo='C'
            )
        elif tercero and tercero.es_acompanante:
            concepto_ingreso = ConceptoOperacionCajaFactory(
                tipo='I',
                grupo='A'
            )
            concepto_egreso = ConceptoOperacionCajaFactory(
                tipo='E',
                grupo='A'
            )
        elif tercero and tercero.es_proveedor:
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
            valor_egreso = random.randrange(2000, 5000)
            valor_egresos += valor_egreso

            valor_ingreso = random.randrange(2000, 5000)
            valor_ingresos += valor_ingreso

            operacion_caja_crear(
                concepto_id=concepto_egreso.id,
                usuario_pdv_id=colaborador_cajero.usuario.id,
                descripcion='algo egreso %s' % i,
                valor=valor_egreso,
                tercero_id=tercero.id if tercero else None,
                observacion='probando'
            )

            operacion_caja_crear(
                concepto_id=concepto_ingreso.id,
                usuario_pdv_id=colaborador_cajero.usuario.id,
                descripcion='algo ingreso %s' % i,
                valor=valor_ingreso,
                tercero_id=tercero.id if tercero else None,
                observacion='probando'
            )
        return valor_ingresos, valor_egresos

    def hacer_servicios_desde_habitacion(
            self,
            acompanante,
            habitacion,
            punto_venta,
            comision=0,
            terminados=False,
            acompanante_dos=None,
            acompanante_tres=None,
            nro_servicios=5
    ):

        from habitaciones.services import habitacion_iniciar_servicios
        servicios = self.hacer_servicios_dos(
            acompanante,
            habitacion,
            punto_venta,
            terminados=False,
            comision=comision,
            iniciados=False,
            acompanante_dos=acompanante_dos,
            acompanante_tres=acompanante_tres,
            nro_servicios=nro_servicios
        )
        servicios_array = servicios['array_servicios_iniciar_desde_habitacion']
        a_pagar = servicios['valor_total_todos']
        pago_tarjeta = int(a_pagar / 4)
        pago_efectivo = a_pagar - pago_tarjeta
        habitacion_iniciar_servicios(
            servicios=servicios_array,
            habitacion_id=habitacion.id,
            usuario_pdv_id=punto_venta.usuario_actual.id,
            nro_autorizacion='el codigo',
            franquicia='la franquicia',
            valor_tarjeta=pago_tarjeta,
            valor_efectivo=pago_efectivo
        )

        if terminados:
            from habitaciones.services import habitacion_terminar_servicios, habitacion_cambiar_estado
            habitacion_terminar_servicios(
                habitacion_id=habitacion.id,
                usuario_pdv_id=punto_venta.usuario_actual.id
            )
            habitacion_cambiar_estado(habitacion_id=habitacion.id, nuevo_estado=0)
            servicios['pago_tarjeta'] = pago_tarjeta
            servicios['pago_efectivo'] = pago_efectivo
        return servicios

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

        array_servicios_iniciar_desde_habitacion = []

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
                'array_servicios_iniciar_desde_habitacion': [],
            },
            'acompanante_2': {
                'valor_servicio': 0,
                'valor_habitacion': 0,
                'valor_iva': 0,
                'comision': 0,
                'servicios': [],
                'array_servicios': [],
                'array_servicios_iniciar_desde_habitacion': [],
            },
            'acompanante_3': {
                'valor_servicio': 0,
                'valor_habitacion': 0,
                'valor_iva': 0,
                'comision': 0,
                'servicios': [],
                'array_servicios': [],
                'array_servicios_iniciar_desde_habitacion': [],
            },
        }

        for i in range(nro_servicios):
            if i == 0:
                categoria = array_categorias_fracciones_tiempo[0]
            elif i == 1:
                categoria = array_categorias_fracciones_tiempo[1]
            elif i == 2:
                categoria = array_categorias_fracciones_tiempo[2]
            else:
                categoria = random.choice(array_categorias_fracciones_tiempo)
            servicio = servicio_crear_nuevo(
                habitacion_id=habitacion.id,
                acompanante_id=acompanante.id,
                categoria_fraccion_tiempo_id=categoria,
                usuario_pdv_id=punto_venta.usuario_actual.id
            )
            array_servicios_1.append(servicio.pk)
            array_servicios_iniciar_desde_habitacion.append(
                {
                    'tercero_id': acompanante.id,
                    'categoria_fraccion_tiempo_id': categoria
                }
            )

            valor_iva = servicio.valor_iva_habitacion
            valor_habitacion = servicio.valor_habitacion
            valor_servicio = servicio.valor_servicio
            comision = servicio.comision
            valores_totales_servicios['acompanante_1']['valor_servicio'] += valor_servicio
            valores_totales_servicios['acompanante_1']['valor_iva'] += valor_iva
            valores_totales_servicios['acompanante_1']['valor_habitacion'] += valor_habitacion
            valores_totales_servicios['acompanante_1']['comision'] += comision
            valor_totat_todos_los_servicio += valor_servicio
            valor_totat_habitaciones += valor_habitacion
            valor_totat_todos_los_ivas += valor_iva

            if not terminados and not iniciados:
                valores_totales_servicios['acompanante_1']['servicios'].append(servicio)
        if acompanante_dos:
            for i in range(nro_servicios - 1):
                if i == 0:
                    categoria = array_categorias_fracciones_tiempo[0]
                elif i == 1:
                    categoria = array_categorias_fracciones_tiempo[1]
                elif i == 2:
                    categoria = array_categorias_fracciones_tiempo[2]
                else:
                    categoria = random.choice(array_categorias_fracciones_tiempo)
                servicio = servicio_crear_nuevo(
                    habitacion_id=habitacion.id,
                    acompanante_id=acompanante_dos.id,
                    categoria_fraccion_tiempo_id=categoria,
                    usuario_pdv_id=punto_venta.usuario_actual.id
                )
                array_servicios_2.append(servicio.pk)
                array_servicios_iniciar_desde_habitacion.append(
                    {
                        'tercero_id': acompanante_dos.id,
                        'categoria_fraccion_tiempo_id': categoria
                    }
                )

                valor_iva = servicio.valor_iva_habitacion
                valor_habitacion = servicio.valor_habitacion
                valor_servicio = servicio.valor_servicio
                comision = servicio.comision
                valores_totales_servicios['acompanante_2']['valor_servicio'] += valor_servicio
                valores_totales_servicios['acompanante_2']['valor_iva'] += valor_iva
                valores_totales_servicios['acompanante_2']['valor_habitacion'] += valor_habitacion
                valores_totales_servicios['acompanante_2']['comision'] += comision
                valor_totat_todos_los_servicio += valor_servicio
                valor_totat_habitaciones += valor_habitacion
                valor_totat_todos_los_ivas += valor_iva

                if not terminados and not iniciados:
                    valores_totales_servicios['acompanante_2']['servicios'].append(servicio)
        if acompanante_tres:
            for i in range(nro_servicios - 2):
                if i == 0:
                    categoria = array_categorias_fracciones_tiempo[0]
                elif i == 1:
                    categoria = array_categorias_fracciones_tiempo[1]
                elif i == 2:
                    categoria = array_categorias_fracciones_tiempo[2]
                else:
                    categoria = random.choice(array_categorias_fracciones_tiempo)
                servicio = servicio_crear_nuevo(
                    habitacion_id=habitacion.id,
                    acompanante_id=acompanante_tres.id,
                    categoria_fraccion_tiempo_id=categoria,
                    usuario_pdv_id=punto_venta.usuario_actual.id
                )
                array_servicios_iniciar_desde_habitacion.append(
                    {
                        'tercero_id': acompanante_tres.id,
                        'categoria_fraccion_tiempo_id': categoria
                    }
                )

                valor_iva = servicio.valor_iva_habitacion
                valor_habitacion = servicio.valor_habitacion
                valor_servicio = servicio.valor_servicio
                comision = servicio.comision
                valores_totales_servicios['acompanante_3']['valor_servicio'] += valor_servicio
                valores_totales_servicios['acompanante_3']['valor_iva'] += valor_iva
                valores_totales_servicios['acompanante_3']['valor_habitacion'] += valor_habitacion
                valores_totales_servicios['acompanante_3']['comision'] += comision
                valor_totat_todos_los_servicio += valor_servicio
                valor_totat_habitaciones += valor_habitacion
                valor_totat_todos_los_ivas += valor_iva
                array_servicios_3.append(servicio.pk)
                if not terminados and not iniciados:
                    valores_totales_servicios['acompanante_3']['servicios'].append(servicio)
        if iniciados:
            for i in range(len(array_servicios_1)):
                servicio = servicio_iniciar(
                    servicio_id=array_servicios_1[i],
                    usuario_pdv_id=punto_venta.usuario_actual.id
                )
                valores_totales_servicios['acompanante_1']['servicios'].append(servicio)

            if acompanante_dos:
                for i in range(len(array_servicios_2)):
                    servicio = servicio_iniciar(
                        servicio_id=array_servicios_2[i],
                        usuario_pdv_id=punto_venta.usuario_actual.id
                    )
                    valores_totales_servicios['acompanante_2']['servicios'].append(servicio)

            if acompanante_tres:
                for i in range(len(array_servicios_3)):
                    servicio = servicio_iniciar(
                        servicio_id=array_servicios_3[i],
                        usuario_pdv_id=punto_venta.usuario_actual.id
                    )
                    valores_totales_servicios['acompanante_3']['servicios'].append(servicio)

            if terminados:
                habitacion = habitacion_terminar_servicios(
                    habitacion_id=habitacion.id,
                    usuario_pdv_id=punto_venta.usuario_actual.id
                )
                habitacion.estado = 0
                habitacion.save()

        valores_totales_servicios['acompanante_1']['array_servicios'] = array_servicios_1
        valores_totales_servicios['acompanante_2']['array_servicios'] = array_servicios_2
        valores_totales_servicios['acompanante_3']['array_servicios'] = array_servicios_3
        valores_totales_servicios['valor_totat_todos_los_servicio'] = valor_totat_todos_los_servicio
        valores_totales_servicios['valor_totat_habitaciones'] = valor_totat_habitaciones
        valores_totales_servicios['valor_totat_todos_los_ivas'] = valor_totat_todos_los_ivas
        valores_totales_servicios[
            'valor_total_todos'] = valor_totat_todos_los_ivas + valor_totat_habitaciones + valor_totat_todos_los_servicio
        valores_totales_servicios['array_servicios_iniciar_desde_habitacion'] = array_servicios_iniciar_desde_habitacion

        return valores_totales_servicios

    def hacer_movimiento_para_punto_venta_abierto(
            self,
            punto_venta
    ):
        from habitaciones.models import Habitacion
        from liquidaciones.services import liquidar_cuenta_acompanante, liquidar_cuenta_mesero
        array_habitaciones = Habitacion.objects.values_list('pk', flat=True)

        punto_venta_base_inicial = punto_venta.turno_actual.base_inicial_efectivo
        punto_venta_saldo_cierre_caja_anterior = punto_venta.turno_actual.saldo_cierre_caja_anterior

        # region Genera Servicios
        servicios = self.hacer_servicios_desde_habitacion(
            habitacion=Habitacion.objects.get(pk=random.choice(array_habitaciones)),
            punto_venta=punto_venta,
            acompanante=self.acompanante,
            acompanante_dos=self.acompanante_dos,
            acompanante_tres=self.acompanante_tres,
            comision=int(random.randrange(1000, 3000)),
            nro_servicios=random.randint(6, 10),
            terminados=True
        )
        valor_total_servicios_uno_efectivo = servicios['pago_efectivo']
        valor_total_servicios_uno_tarjeta = servicios['pago_tarjeta']

        servicios_dos = self.hacer_servicios_desde_habitacion(
            habitacion=Habitacion.objects.get(pk=random.choice(array_habitaciones)),
            punto_venta=punto_venta,
            acompanante=self.acompanante,
            acompanante_dos=self.acompanante_dos,
            acompanante_tres=self.acompanante_tres,
            comision=int(random.randrange(1000, 3000)),
            nro_servicios=random.randint(6, 10),
            terminados=True
        )
        valor_total_servicios_dos_efectivo = servicios_dos['pago_efectivo']
        valor_total_servicios_dos_tarjeta = servicios_dos['pago_tarjeta']

        servicios_tres = self.hacer_servicios_desde_habitacion(
            habitacion=Habitacion.objects.get(pk=random.choice(array_habitaciones)),
            punto_venta=punto_venta,
            acompanante=self.acompanante,
            acompanante_dos=self.acompanante_dos,
            acompanante_tres=self.acompanante_tres,
            comision=int(random.randrange(1000, 3000)),
            nro_servicios=random.randint(6, 10),
            terminados=True
        )
        valor_total_servicios_tres_efectivo = servicios_tres['pago_efectivo']
        valor_total_servicios_tres_tarjeta = servicios_tres['pago_tarjeta']

        valor_ingresos_por_servicios_efectivo = valor_total_servicios_uno_efectivo + valor_total_servicios_dos_efectivo + valor_total_servicios_tres_efectivo
        valor_ingresos_por_servicios_tarjeta = valor_total_servicios_uno_tarjeta + valor_total_servicios_dos_tarjeta + valor_total_servicios_tres_tarjeta
        valor_ingresos_por_servicios = valor_ingresos_por_servicios_efectivo + valor_ingresos_por_servicios_tarjeta

        # endregion

        # region Genera Ventas Productos
        venta, informacion = self.hacer_venta_productos_dos(
            punto_venta=punto_venta,
            nro_referencias=8,
            cliente=self.acompanante
        )

        venta2, informacion2 = self.hacer_venta_productos_dos(
            punto_venta=punto_venta,
            nro_referencias=8,
            mesero=self.colaborador_mesero
        )
        # endregion

        # region Genera Operaciones Caja
        valor_ingresos_uno, valor_egresos_uno = self.hacer_operaciones_caja_dos(
            colaborador_cajero=punto_venta.usuario_actual.tercero,
            tercero=self.acompanante
        )

        valor_ingresos_dos, valor_egresos_dos = self.hacer_operaciones_caja_dos(
            colaborador_cajero=punto_venta.usuario_actual.tercero,
            tercero=self.acompanante_dos
        )

        valor_ingresos_tres, valor_egresos_tres = self.hacer_operaciones_caja_dos(
            colaborador_cajero=punto_venta.usuario_actual.tercero,
            tercero=self.acompanante_tres
        )

        valor_ingresos_cuatro, valor_egresos_cuatro = self.hacer_operaciones_caja_dos(
            colaborador_cajero=punto_venta.usuario_actual.tercero
        )

        valor_ingresos_operaciones_caja = valor_ingresos_uno + valor_ingresos_dos + valor_ingresos_tres + valor_ingresos_cuatro
        valor_egresos_operaciones_caja = valor_egresos_uno + valor_egresos_dos + valor_egresos_tres + valor_ingresos_cuatro
        # endregion

        # region Genera Liquidaciones
        liquidacion_cuenta_acompanante = liquidar_cuenta_acompanante(
            acompanante_id=self.acompanante.id,
            punto_venta_turno_id=punto_venta.usuario_actual.tercero.turno_punto_venta_abierto.id,
            valor_efectivo=(
                                   self.acompanante.cuenta_abierta.total_ingresos - self.acompanante.cuenta_abierta.total_egresos) - 10000
        )
        liquidacion_cuenta_mesero = liquidar_cuenta_mesero(
            colaborador_id=self.colaborador_mesero.id,
            punto_venta_turno_id=punto_venta.usuario_actual.tercero.turno_punto_venta_abierto.id,
            valor_efectivo=self.colaborador_mesero.cuenta_abierta_mesero.valor_ventas_productos + 5000,
            valor_tarjetas=0,
            nro_vauchers=0
        )
        # endregion

        egreso_liquidacion_acompanante = liquidacion_cuenta_acompanante.pagado
        ingreso_liquidacion_mesero = liquidacion_cuenta_mesero.pagado

        total_valor_egresos = egreso_liquidacion_acompanante + valor_egresos_operaciones_caja
        total_valor_ingresos = ingreso_liquidacion_mesero + valor_ingresos_operaciones_caja + valor_ingresos_por_servicios + punto_venta_saldo_cierre_caja_anterior + punto_venta_base_inicial

        informacion = {
            'ingresos': {
                'totales': total_valor_ingresos,
                'totales_efectivo': valor_ingresos_por_servicios_efectivo,
                'totales_tarjeta': valor_ingresos_por_servicios_tarjeta,
            },
            'egresos': {
                'totales': total_valor_egresos
            }
        }

        return informacion
