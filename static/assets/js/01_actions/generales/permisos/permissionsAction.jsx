import {
    PERMISO_TYPES as TYPES,
    FETCH_MIS_PERMISOS,
    FETCH_OTRO_USUARIO_PERMISOS,
} from '../../00_types';

import {
    fetchListGet,
    updateObject,
    fetchObject,
    fetchListGetURLParameters
} from '../../00_general_fuctions'

const current_url_api = 'permisos';

export function fetchMisPermisos(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = '/mis_permisos';
        const FULL_URL = `${current_url_api}${SUB_URL}`;
        const dispatches = (response) => {
            dispatch({type: FETCH_MIS_PERMISOS, payload: response})
        };
        fetchListGet(FULL_URL, dispatches, callback, callback_error, dispatch);
    }
}

export function fetchPermisosActivos(callback = null, callback_error = null, limpiar_coleccion = true) {
    return function (dispatch) {
        const SUB_URL = '/permisos_activos';
        const FULL_URL = `${current_url_api}${SUB_URL}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGet(FULL_URL, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
}


export function fetchPermisosPorGrupo(grupo_id, callback = null, callback_error = null, limpiar_coleccion = true) {
    return function (dispatch) {
        const SUB_URL = `/por_grupo/?grupo_id=${grupo_id}`;
        const FULL_URL = `${current_url_api}${SUB_URL}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGetURLParameters(FULL_URL, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
}

export function fetchOtroUsuarioPermisos(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = `/permiso_x_usuario/?user_id=${id}`;
        const FULL_URL = `${current_url_api}${SUB_URL}`;
        const dispatches = (response) => {
            dispatch({type: FETCH_OTRO_USUARIO_PERMISOS, payload: response})
        };
        fetchListGetURLParameters(FULL_URL, dispatches, callback, callback_error, dispatch);
    }
}

export const fetchPermisos = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGet(current_url_api, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};

export const updatePermiso = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error, dispatch)
    }
};

export const fetchPermiso = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error, dispatch);
    }
};

export const clearPermisos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};