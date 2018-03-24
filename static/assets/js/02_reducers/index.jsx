import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import NotifyReducer from 'react-redux-notify';
import misPermisosReducer from './generales/permisos/misPermisosReducer';
import otroUsuarioPermisosReducer from './generales/permisos/otroUsarioPermisosReducer';
import gruposPermisosReducer from './generales/permisos/gruposPermisosReducer';
import permisosReducer from './generales/permisos/permisosReducer';
import usuariosReducer from './generales/usuariosReducer';
import loadingReducer from './generales/loadingReducer';
import miCuentaReducer from './generales/miCuentaReducer';


import colaboradoresReducer from './especificas/terceros/colaboradoresReducer';
import acompanantesReducer from './especificas/terceros/acompanantesReducer';
import categoriasAcompanantesReducer from './especificas/terceros/categoriasAcompanantesReducer';
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

const rootReducer = combineReducers({
    mis_permisos: misPermisosReducer,
    permisos: permisosReducer,
    permisos_otro_usuario: otroUsuarioPermisosReducer,
    grupos_permisos: gruposPermisosReducer,
    mi_cuenta: miCuentaReducer,
    usuarios: usuariosReducer,
    esta_cargando: loadingReducer,
    notifications: NotifyReducer,
    form: formReducer,
    colaboradores: colaboradoresReducer,
    acompanantes: acompanantesReducer,
    categorias_acompanantes: categoriasAcompanantesReducer,
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
});

export default rootReducer;