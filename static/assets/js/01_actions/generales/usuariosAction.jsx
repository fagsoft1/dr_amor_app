import {
    USUARIO_TYPES as TYPES
} from '../00_types';

import {
    fetchListGet,
    updateObject,
    fetchObject,
    createObject,
    deleteObject,
    callApiMethodPostParameters
} from '../00_general_fuctions'

const current_url_api = 'usuarios';

export const cambiarContrasenaUsuario = (id, password_old, password, password_2, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('password_old', password_old);
        params.append('password', password);
        params.append('password_2', password_2);
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParameters(current_url_api, id, 'cambiar_contrasena', params, options)
    }
};

export const cambiarPinUsuario = (id, pin, password, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pin', pin);
        params.append('password', password);
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParameters(current_url_api, id, 'cambiar_pin', params, options)
    }
};

export const addPermisoUsuario = (id, permiso_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('id_permiso', permiso_id);
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParameters(current_url_api, id, 'adicionar_permiso', params, options)
    }
};

export const addGrupoUsuario = (id, grupo_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('id_grupo', grupo_id);
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParameters(current_url_api, id, 'adicionar_grupo', params, options)
    }
};

export const fetchMiCuenta = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.cuenta, payload: response})
        };
        const options = {
            dispatches,
            callback,
            callback_error,
            dispatch_method: dispatch,
        };
        fetchListGet(`${current_url_api}/mi_cuenta`, options);
    }
};

export const fetchUsuario = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };

        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};
export const clearUsuarios = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear})
    }
};

export const createUsuario = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};

export const deleteUsuario = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};

export const updateUsuario = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};

export const fetchUsuarios = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response});
        };
        const options = {
            dispatches,
            callback,
            callback_error,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(current_url_api, options);
    }
};