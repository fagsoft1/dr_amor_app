import {TRASLADO_INVENTARIO_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodPost,
    callApiMethodPostParameters, fetchListGetURLParameters
} from '../../00_general_fuctions'

//cambiar_estado

const current_url_api = 'traslados_inventarios';

export const cambiarEstadoTrasladoInventario = (id, nuevo_estado, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('nuevo_estado', nuevo_estado);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'cambiar_estado', params, options)
    }
};

export const trasladarTrasladoInventario = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch
        };
        return callApiMethodPost(current_url_api, id, 'trasladar', options)
    }
};
export const createTrasladoInventario = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deleteTrasladoInventario = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchTrasladosInventarios = (options_action = {}) => {
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
export const fetchTrasladosInventariosxBodegaDestino = (bodega_id, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/pendiente_verificacion_por_bodega_destino/?bodega_id=${bodega_id}`, options);
    }
};

export const fetchTrasladoInventario = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearTrasladosInventarios = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateTrasladoInventario = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};