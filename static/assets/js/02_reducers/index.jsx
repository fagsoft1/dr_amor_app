import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import NotifyReducer from 'react-redux-notify';
import misPermisosReducer from './generales/permisos/misPermisosReducer';
import gruposPermisosReducer from './generales/permisos/gruposPermisosReducer';
import permisosReducer from './generales/permisos/permisosReducer';
import usuariosReducer from './generales/usuariosReducer';
import loadingReducer from './generales/loadingReducer';
import miCuentaReducer from './generales/miCuentaReducer';
import menuReducer from './generales/menuReducer';
import auth from './generales/authentication/authenticationReducer';


import colaboradoresReducer from './especificas/terceros/colaboradoresReducer';
import acompanantesReducer from './especificas/terceros/acompanantesReducer';
import tercerosReducer from './especificas/terceros/tercerosReducer';
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
import serviciosReducer from './especificas/servicios/serviciosReducer';
import billetesMonedasReducer from './especificas/cajas/billetesMonedasReducer';
import arqueosCajasReducer from './especificas/cajas/arqueosCajasReducer';
import conceptosOperacionesCajasReducer from './especificas/cajas/conceptosOperacionesCajas';
import operacionesCajasReducer from './especificas/cajas/operacionesCajas';

import ventasProductosReducer from './especificas/ventas/ventasProductosReducer';
import ventasProductosDetallesReducer from './especificas/ventas/ventasProductosDetallesReducer';

const rootReducer = combineReducers({
    mis_permisos: misPermisosReducer,
    permisos: permisosReducer,
    grupos_permisos: gruposPermisosReducer,
    mi_cuenta: miCuentaReducer,
    usuarios: usuariosReducer,
    esta_cargando: loadingReducer,
    notifications: NotifyReducer,
    form: formReducer,
    menu_status: menuReducer,
    auth,
    colaboradores: colaboradoresReducer,
    acompanantes: acompanantesReducer,
    terceros: tercerosReducer,
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

    servicios: serviciosReducer,

    billetes_monedas: billetesMonedasReducer,
    arqueos_cajas: arqueosCajasReducer,
    conceptos_operaciones_caja: conceptosOperacionesCajasReducer,
    operaciones_caja: operacionesCajasReducer,

    ventas_productos_detalles: ventasProductosDetallesReducer,
    ventas_productos: ventasProductosReducer,
});

export default rootReducer;