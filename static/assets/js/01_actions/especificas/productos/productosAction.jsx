import {
    PRODUCTO_TYPES as TYPES
} from '../../00_types';
import {
    fetchList,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    baseWS,
} from '../../00_general_fuctions'

const current_url_api = 'productos';

export function refreshUpdateProducto(payload) {
    return baseWS(TYPES.update, payload)
}

export function refreshDeleteProducto(id) {
    return baseWS(TYPES.delete, id)
}

export const createProducto = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteProducto = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchProductos = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchProductosParaSaldoInicial = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(`${current_url_api}/sin_saldos_iniciales`, dispatches, callback, callback_error);
    }
};
export const fetchProducto = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearProductos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateProducto = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};