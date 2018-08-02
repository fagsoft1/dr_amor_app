import {
    PROVEEDOR_TYPES as TYPES
} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
} from '../../00_general_fuctions'

const current_url_api = 'proveedores';
export const createProveedor = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error, dispatch)
    }
};
export const deleteProveedor = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error, dispatch)
    }
};
export const fetchProveedores = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGet(current_url_api, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};
export const fetchProveedor = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error, dispatch);
    }
};
export const clearProveedores = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateProveedor = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error, dispatch)
    }
};