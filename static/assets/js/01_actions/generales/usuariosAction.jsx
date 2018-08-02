import {
    USUARIO_TYPES as TYPES
} from '../00_types';

import {
    fetchList,
    updateObject,
    fetchObject,
    createObject,
    deleteObject,
    callApiMethodWithParameters
} from '../00_general_fuctions'

const current_url_api = 'usuarios';

export const cambiarContrasenaUsuario = (id, password_old, password, password_2, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('password_old', password_old);
        params.append('password', password);
        params.append('password_2', password_2);
        callApiMethodWithParameters(current_url_api, id, 'cambiar_contrasena', params, null, callback, callback_error, dispatch)
    }
};

export const cambiarPinUsuario = (id, pin, password, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pin', pin);
        params.append('password', password);
        callApiMethodWithParameters(current_url_api, id, 'cambiar_pin', params, null, callback, callback_error, dispatch)
    }
};

export const addPermisoUsuario = (id, permiso_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('id_permiso', permiso_id);
        callApiMethodWithParameters(current_url_api, id, 'adicionar_permiso', params, null, callback, callback_error, dispatch)
    }
};

export const addGrupoUsuario = (id, grupo_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('id_grupo', grupo_id);
        callApiMethodWithParameters(current_url_api, id, 'adicionar_grupo', params, null, callback, callback_error, dispatch)
    }
};

export const createUsuario = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error, dispatch)
    }
};
export const deleteUsuario = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error, dispatch)
    }
};
export const fetchUsuarios = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error, dispatch);
    }
};

export const fetchMiCuenta = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.cuenta, payload: response})
        };
        fetchList(`${current_url_api}/mi_cuenta`, dispatches, callback, callback_error, dispatch);
    }
};

export const fetchUsuario = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error, dispatch);
    }
};
export const clearUsuarios = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear})
    }
};
export const updateUsuario = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error, dispatch)
    }
};