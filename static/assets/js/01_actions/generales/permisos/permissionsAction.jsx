import {
    PERMISO_TYPES as TYPES
} from '../../00_types';

import {mapKeys} from 'lodash';

import {
    fetchListGet,
    updateObject,
    fetchObject,
    fetchListGetURLParameters
} from '../../00_general_fuctions'

const current_url_api = 'permisos';

export const fetchMisPermisosxListado = (listados_permisos = [], options_action = {}) => {
    let permisos_listado_consulta = '';
    listados_permisos.map(lista => {
        mapKeys(lista, (v) => {
            permisos_listado_consulta = permisos_listado_consulta.concat(`${v},`);
        });
    });
    return function (dispatch) {
        const SUB_URL = '/tengo_permisos';
        const FULL_URL = `${current_url_api}${SUB_URL}/?listado_permisos=${permisos_listado_consulta}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.mis_permisos, payload: response})
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
};


export function fetchMisPermisos(options_action = {}) {
    return function (dispatch) {
        const SUB_URL = '/mis_permisos';
        const FULL_URL = `${current_url_api}${SUB_URL}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.mis_permisos, payload: response})
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