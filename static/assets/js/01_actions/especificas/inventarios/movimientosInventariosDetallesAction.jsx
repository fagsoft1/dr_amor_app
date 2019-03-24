import {
    MOVIMIENTO_INVENTARIO_DETALLE_TYPES as TYPES
} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListGetURLParameters,
    baseWS
} from '../../00_general_fuctions'

const current_url_api = 'movimiento_inventario_detalle';

export function refreshUpdateMovimientoInventarioDetalle(payload) {
    return baseWS(TYPES.update, payload)
}

export function refreshDeleteMovimientoInventarioDetalle(id) {
    return baseWS(TYPES.delete, id)
}

export const createMovimientoInventarioDetalle = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deleteMovimientoInventarioDetalle = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchMovimientosInventariosDetalles = (options_action = {}) => {
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

export const fetchMovimientosInventariosDetallesxMovimiento = (movimiento_id, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/por_movimiento/?movimiento_id=${movimiento_id}`, options);
    }
};
export const fetchMovimientosInventariosDetallesSaldosxBodega = (bodega_id, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/actual_por_bodega/?bodega_id=${bodega_id}`, options);
    }
};
// export const fetchMovimientoIntentariosDetalles_por_tercero_cuenta_abierta = (tercero_id, options_action = {}) => {
//     return (dispatch) => {
//         const dispatches = (response) => {
//             dispatch({type: TYPES.fetch_all, payload: response})
//         };
//         const {limpiar_coleccion = true} = options_action;
//         const options = {
//             dispatches,
//             ...options_action,
//             dispatch_method: dispatch,
//             clear_action_type: limpiar_coleccion ? TYPES.clear : null
//         };
//         return fetchListGetURLParameters(`${current_url_api}/consultar_por_tercero_cuenta_abierta/?tercero_id=${tercero_id}`, options);
//     }
// };
export const fetchMovimientosInventariosDetallesSaldosxPDV = (punto_venta_id, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/actual_por_pdv/?punto_venta_id=${punto_venta_id}`, options);
    }
};
export const fetchMovimientosInventariosDetallesxBodegaxFecha = (bodega_id, fecha_inicial, fecha_final, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/por_bodega_por_fecha/?bodega_id=${bodega_id}&fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`, options);
    }
};
export const fetchMovimientosInventariosDetallesxBodegaxProducto = (bodega_id, producto_id, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/por_bodega_por_producto/?bodega_id=${bodega_id}&producto_id=${producto_id}`, options);
    }
};
export const fetchMovimientoInventarioDetalle = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearMovimientosInventariosDetalles = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateMovimientoInventarioDetalle = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};