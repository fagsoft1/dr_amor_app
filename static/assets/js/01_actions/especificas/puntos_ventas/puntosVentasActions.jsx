import {PUNTO_VENTA_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    fetchListGetURLParameters,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodPostParameters
} from '../../00_general_fuctions'

const current_url_api = 'puntos_ventas';

export const efectuarVentaTiendaEnPuntoVenta = (id, qr_codigo, usuario_id, tipo_venta, pedido, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pedido', JSON.stringify(pedido));
        params.append('qr_codigo', qr_codigo);
        params.append('usuario_id', usuario_id);
        params.append('tipo_venta', tipo_venta);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'efectuar_venta', params, options)
    }
};

export const hacerEntregaEfectivoCajaPuntoVenta = (id, cierre, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('cierre', JSON.stringify(cierre));
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'hacer_entrega_efectivo_caja', params, options)
    }
};


export const fetchPuntosVentas_por_usuario_username = (username, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/listar_por_usuario_username/?username=${username}`, options);
    }
};

export const fetchPuntosVentas_por_colaborador = (colaborador_id, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/listar_por_colaborador/?colaborador_id=${colaborador_id}`, options);
    }
};

export const createPuntoVenta = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deletePuntoVenta = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchPuntosVentas = (options_action = {}) => {
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

export const fetchPuntoVenta = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearPuntosVentas = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updatePuntoVenta = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};