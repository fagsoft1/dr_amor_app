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

export function fetchMisPermisos(options_action = {}) {
    return function (dispatch) {
        const SUB_URL = '/mis_permisos';
        const FULL_URL = `${current_url_api}${SUB_URL}`;
        const dispatches = (response) => {
            dispatch({type: FETCH_MIS_PERMISOS, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(FULL_URL, options);
    }
}

export function fetchPermisosActivos(options_action = {}) {
    return function (dispatch) {
        const SUB_URL = '/permisos_activos';
        const FULL_URL = `${current_url_api}${SUB_URL}`;
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
        fetchListGet(FULL_URL, options);
    }
}


export function fetchPermisosPorGrupo(grupo_id, options_action = {}) {
    return function (dispatch) {
        const SUB_URL = `/por_grupo/?grupo_id=${grupo_id}`;
        const FULL_URL = `${current_url_api}${SUB_URL}`;
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
        fetchListGetURLParameters(FULL_URL, options);
    }
}

export function fetchPermisosxUsuario(id, options_action = {}) {
    return function (dispatch) {
        const SUB_URL = `/permiso_x_usuario/?user_id=${id}`;
        const FULL_URL = `${current_url_api}${SUB_URL}`;
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
        fetchListGetURLParameters(FULL_URL, options);
    }
}

export const fetchPermisos = (options_action = {}) => {
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
        fetchListGet(current_url_api, options);
    }
};

export const updatePermiso = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};

export const fetchPermiso = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };

        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};

export const clearPermisos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};