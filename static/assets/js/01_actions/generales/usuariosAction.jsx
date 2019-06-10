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

export const cambiarContrasenaUsuario = (id, password_old, password, password_2, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('password_old', password_old);
        params.append('password', password);
        params.append('password_2', password_2);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'cambiar_contrasena', params, options)
    }
};

export const addPermisoUsuario = (id, permiso_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('id_permiso', permiso_id);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_permiso', params, options)
    }
};

export const addGrupoUsuario = (id, grupo_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('id_grupo', grupo_id);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_grupo', params, options)
    }
};

export const fetchUsuario = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };

        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
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
        return createObject(current_url_api, values, options);
    }
};

export const deleteUsuario = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};

export const updateUsuario = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};

export const fetchUsuarios = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGet(current_url_api, options);
    }
};