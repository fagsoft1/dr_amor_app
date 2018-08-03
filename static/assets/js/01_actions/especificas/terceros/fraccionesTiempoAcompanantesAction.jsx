import {FRACCION_TIEMPO_ACOMPANANTE_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
} from '../../00_general_fuctions'

const current_url_api = 'fracciones_tiempo_acompanante';
export const createFraccionTiempoAcompanante = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};
export const deleteFraccionTiempoAcompanante = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};
export const fetchFraccionesTiemposAcompanantes = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
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
export const fetchFraccionTiempoAcompanante = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};         fetchObject(current_url_api, id, options);
    }
};
export const clearFraccionesTiemposAcompanantes = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateFraccionTiempoAcompanante = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};         updateObject(current_url_api, id, values, options);
    }
};