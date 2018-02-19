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


import tercerosReducer from './especificas/tercerosReducer';

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
    terceros: tercerosReducer
});

export default rootReducer;