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

export const createMovimientoInventarioDetalle = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error, dispatch)
    }
};
export const deleteMovimientoInventarioDetalle = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error, dispatch)
    }
};
export const fetchMovimientosInventariosDetalles = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGet(current_url_api, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};
export const fetchMovimientosInventariosDetallesxMovimiento = (movimiento_id, callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGetURLParameters(`${current_url_api}/por_movimiento/?movimiento_id=${movimiento_id}`, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};
export const fetchMovimientosInventariosSaldosxBodega = (bodega_id, callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGetURLParameters(`${current_url_api}/actual_por_bodega/?bodega_id=${bodega_id}`, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};
export const fetchMovimientosInventariosxBodegaxProducto = (bodega_id, producto_id, callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGetURLParameters(`${current_url_api}/por_bodega_por_producto/?bodega_id=${bodega_id}&producto_id=${producto_id}`, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};
export const fetchMovimientoInventarioDetalle = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error, dispatch);
    }
};
export const clearMovimientosInventariosDetalles = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateMovimientoInventarioDetalle = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error, dispatch)
    }
};