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

export const hacerEntregaEfectivoCajaPuntoVenta = (id, cierre, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('cierre', JSON.stringify(cierre));
        callApiMethodPostParameters(current_url_api, id, 'hacer_entrega_efectivo_caja', params, null, callback, callback_error, dispatch)
    }
};


export const fetchPuntosVentas_por_usuario_username = (username, callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGetURLParameters(`${current_url_api}/listar_por_usuario_username/?username=${username}`, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};

export const fetchPuntosVentas_por_colaborador = (colaborador_id, callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGetURLParameters(`${current_url_api}/listar_por_colaborador/?colaborador_id=${colaborador_id}`, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};

export const createPuntoVenta = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error, dispatch)
    }
};
export const deletePuntoVenta = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error, dispatch)
    }
};
export const fetchPuntosVentas = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGet(current_url_api, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};
export const fetchPuntoVenta = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error, dispatch);
    }
};
export const clearPuntosVentas = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updatePuntoVenta = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error, dispatch)
    }
};