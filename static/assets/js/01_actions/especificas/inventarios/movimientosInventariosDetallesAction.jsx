import {
    MOVIMIENTO_INVENTARIO_DETALLE_TYPES as TYPES
} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListGetURLParameters, baseWS
} from '../../00_general_fuctions'

const current_url_api = 'movimiento_inventario_detalle';

export function refreshUpdateMovimientoInventarioDetalle(payload) {
    return baseWS(TYPES.update, payload)
}

export function refreshDeleteMovimientoInventarioDetalle(id) {
    return baseWS(TYPES.delete, id)
}

export const createMovimientoInventarioDetalle = (values, options_action={}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};
export const deleteMovimientoInventarioDetalle = (id, options_action={}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};
export const fetchMovimientosInventariosDetalles = (options_action={}) => {
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

export const fetchMovimientosInventariosDetallesxMovimiento = (movimiento_id, callback = null, callback_error = null, limpiar_coleccion = true) => {
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
        fetchListGetURLParameters(`${current_url_api}/por_movimiento/?movimiento_id=${movimiento_id}`, options);
    }
};
export const fetchMovimientosInventariosSaldosxBodega = (bodega_id, callback = null, callback_error = null, limpiar_coleccion = true) => {
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
        fetchListGetURLParameters(`${current_url_api}/actual_por_bodega/?bodega_id=${bodega_id}`, options);
    }
};
export const fetchMovimientosInventariosxBodegaxProducto = (bodega_id, producto_id, callback = null, callback_error = null, limpiar_coleccion = true) => {
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
        fetchListGetURLParameters(`${current_url_api}/por_bodega_por_producto/?bodega_id=${bodega_id}&producto_id=${producto_id}`, options);
    }
};
export const fetchMovimientoInventarioDetalle = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};
export const clearMovimientosInventariosDetalles = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateMovimientoInventarioDetalle = (id, values, options_action={}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};