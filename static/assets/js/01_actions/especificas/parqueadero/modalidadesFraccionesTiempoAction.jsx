import {MODALIDAD_FRACCION_TIEMPO_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListGetURLParameters
} from '../../00_general_fuctions'

//por_tipo_vehiculo

const current_url_api = 'parqueadero_modalidades_fracciones_tiempos';
export const createModalidadFraccionTiempo = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};
export const deleteModalidadFraccionTiempo = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};
export const fetchModalidadesFraccionesTiempos = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches, ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(current_url_api, options);
    }
};

export function fetchModalidadesFraccionesTiempos_por_tipo_vehiculo(tipo_vehiculo_id, options_action = {}) {
    return function (dispatch) {
        const SUB_URL = `/por_tipo_vehiculo/?tipo_vehiculo_id=${tipo_vehiculo_id}`;
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
        return fetchListGetURLParameters(FULL_URL, options);
    }
}

export const fetchModalidadFraccionTiempo = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};
export const clearModalidadesFraccionesTiempos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateModalidadFraccionTiempo = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};