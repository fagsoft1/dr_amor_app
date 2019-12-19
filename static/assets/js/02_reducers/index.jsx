import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import misPermisosReducer from './generales/permisos/misPermisosReducer';
import gruposPermisosReducer from './generales/permisos/gruposPermisosReducer';
import permisosReducer from './generales/permisos/permisosReducer';
import usuariosReducer from './generales/usuariosReducer';
import loadingReducer from './generales/loadingReducer';
import menuReducer from './generales/menuReducer';
import configuracionAplicacionReducer from './generales/configuracion_aplicacion/configuracionAplicacionReducer';
import serverInformationReducer from './generales/configuracion_aplicacion/serverInformationReducer';
import auth from './generales/authentication/authenticationReducer';


import colaboradoresReducer from './especificas/terceros/colaboradoresReducer';
import acompanantesReducer from './especificas/terceros/acompanantesReducer';
import tercerosReducer from './especificas/terceros/tercerosReducer';
import tercerosCuentasReducer from './especificas/terceros/cuentasReducer';
import categoriasAcompanantesReducer from './especificas/terceros/categoriasAcompanantesReducer';
import fraccionesTiemposReducer from './especificas/terceros/fraccionesTiemposAcompanantesReducer';
import categoriasFraccionesTiemposReducer from './especificas/terceros/categoriasFraccionesTiempoAcompanantesReducer';


import empresasReducer from './especificas/empresasReducer';
import habitacionesReducer from './especificas/habitaciones/habitacionesReducer';
import habitacionesTiposReducer from './especificas/habitaciones/habitacionesTipoReducer';
import productosReducer from './especificas/productos/productosReducer';
import unidadesProductoReducer from './especificas/productos/unidadesReducer';
import categoriasProductoReducer from './especificas/productos/categoriasReducer';
import categoriasDosProductoReducer from './especificas/productos/categoriasDosReducer';
import proveedoresReducer from './especificas/terceros/proveedoresReducer';
import bodegasReducer from './especificas/inventarios/bodegasReducer';
import movimientosInventariosReducer from './especificas/inventarios/movimientosInventariosReducer';
import movimientosInventariosDetallesReducer from './especificas/inventarios/movimientosInventariosDetallesReducer';
import trasladosInventariosReducer from './especificas/inventarios/trasladosInventariosReducer';
import trasladosInventariosDetallesReducer from './especificas/inventarios/trasladosInventariosDetallesReducer';
import puntosVentasReducer from './especificas/puntos_ventas/puntosVentasReducer';
import puntosVentasTurnosReducer from './especificas/puntos_ventas/puntosVentasTurnosReducer';
import serviciosReducer from './especificas/servicios/serviciosReducer';
import billetesMonedasReducer from './especificas/cajas/billetesMonedasReducer';
import arqueosCajasReducer from './especificas/cajas/arqueosCajasReducer';
import conceptosOperacionesCajasReducer from './especificas/cajas/conceptosOperacionesCajas';
import operacionesCajasReducer from './especificas/cajas/operacionesCajas';

import ventasProductosReducer from './especificas/ventas/ventasProductosReducer';
import ventasProductosDetallesReducer from './especificas/ventas/ventasProductosDetallesReducer';

import liquidacionesCuentasReducer from './especificas/liquidaciones/liquidacionesReducer';

import consultasVentasEmpresasReducer from './especificas/consultas/consultasVentasEmpresasReducer';

import tipoVehiculoReducer from './especificas/parqueadero/parqueaderoReducer';
import modalidadesFraccionesTiempoReducer from './especificas/parqueadero/modalidadesFraccionesTiempoReducer';
import registrosEntradasParqueosReducer from './especificas/parqueadero/registrosEntradasParqueoReducer';
import modalidadesFraccionesTiempoDetallesReducer
    from './especificas/parqueadero/modalidadesFraccionesTiempoDetallesReducer';


import metodosPagosReducer from './especificas/contabilidad/configuracion/metodosPagosReducer';
import cuentasContablesReducer from './especificas/contabilidad/configuracion/cuentasContablesReducer';
import diariosContablesReducer from './especificas/contabilidad/configuracion/diariosContablesReducer';
import cuentasBancariasContablesReducer from './especificas/contabilidad/configuracion/cuentasBancariasReducer';
import impuestosContablesReducer from './especificas/contabilidad/configuracion/impuestosReducer';
import bancosReducer from './especificas/contabilidad/configuracion/bancosReducer';
import tiposComprobantesContablesReducer from './especificas/contabilidad/configuracion/tiposComprobantesReducer';
import tiposComprobantesContablesEmpresasReducer
    from './especificas/contabilidad/configuracion/tiposComprobantesEmpresasReducer';


import asientosContablesReducer from './especificas/contabilidad/contabilidad/asientosContablesReducer';
import apuntesContablesReducer from './especificas/contabilidad/contabilidad/apuntesContablesReducer';

import historicoReducer from './generales/historico/historicoReducer';

import {reducer as notificationsReducers} from 'react-notification-system-redux';

const rootReducer = combineReducers({
    mis_permisos: misPermisosReducer,
    configuracion_aplicacion: configuracionAplicacionReducer,
    server_information: serverInformationReducer,
    permisos: permisosReducer,
    grupos_permisos: gruposPermisosReducer,
    usuarios: usuariosReducer,
    esta_cargando: loadingReducer,
    notifications: notificationsReducers,
    form: formReducer,
    menu_status: menuReducer,
    auth,
    colaboradores: colaboradoresReducer,
    acompanantes: acompanantesReducer,
    terceros: tercerosReducer,
    terceros_cuentas: tercerosCuentasReducer,
    categorias_acompanantes: categoriasAcompanantesReducer,
    fracciones_tiempos_acompanantes: fraccionesTiemposReducer,
    categorias_fracciones_tiempos_acompanantes: categoriasFraccionesTiemposReducer,

    empresas: empresasReducer,
    habitaciones: habitacionesReducer,
    habitaciones_tipos: habitacionesTiposReducer,
    productos: productosReducer,
    productos_unidades: unidadesProductoReducer,
    productos_categorias: categoriasProductoReducer,
    productos_categorias_dos: categoriasDosProductoReducer,
    proveedores: proveedoresReducer,
    bodegas: bodegasReducer,
    movimientos_inventarios: movimientosInventariosReducer,
    movimientos_inventarios_detalles: movimientosInventariosDetallesReducer,
    traslados_inventarios: trasladosInventariosReducer,
    traslados_inventarios_detalles: trasladosInventariosDetallesReducer,
    puntos_ventas: puntosVentasReducer,
    puntos_ventas_turnos: puntosVentasTurnosReducer,

    servicios: serviciosReducer,

    billetes_monedas: billetesMonedasReducer,
    arqueos_cajas: arqueosCajasReducer,
    conceptos_operaciones_caja: conceptosOperacionesCajasReducer,
    operaciones_caja: operacionesCajasReducer,

    ventas_productos_detalles: ventasProductosDetallesReducer,
    ventas_productos: ventasProductosReducer,

    liquidaciones_cuentas: liquidacionesCuentasReducer,

    consultas_ventas_empresas: consultasVentasEmpresasReducer,

    parqueadero_tipos_vehiculos: tipoVehiculoReducer,
    parqueadero_registros_entradas_parqueos: registrosEntradasParqueosReducer,
    parqueadero_modalidades_fracciones_tiempo: modalidadesFraccionesTiempoReducer,
    parqueadero_modalidades_fracciones_tiempo_detalles: modalidadesFraccionesTiempoDetallesReducer,


    contabilidad_cuentas_contables: cuentasContablesReducer,
    contabilidad_diarios_contables: diariosContablesReducer,
    contabilidad_cuentas_bancarias: cuentasBancariasContablesReducer,
    contabilidad_impuestos: impuestosContablesReducer,
    contabilidad_bancos: bancosReducer,
    contabilidad_tipos_comprobantes: tiposComprobantesContablesReducer,
    contabilidad_tipos_comprobantes_empresas: tiposComprobantesContablesEmpresasReducer,


    contabilidad_asientos_contables: asientosContablesReducer,
    contabilidad_apuntes_contables: apuntesContablesReducer,
    contabilidad_metodos_pagos: metodosPagosReducer,

    historicos: historicoReducer,
});

export default rootReducer;