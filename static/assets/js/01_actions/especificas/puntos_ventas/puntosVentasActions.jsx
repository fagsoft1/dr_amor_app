import {PUNTO_VENTA_TYPES as TYPES} from '../../00_types';
import {
    fetchList,
    fetchListWithParameter,
    updateObject,
    fetchObject,
    deleteObject,
    createObject
} from '../../00_general_fuctions'

const current_url_api = 'puntos_ventas';

export const fetchPuntosVentas_por_usuario_username = (username, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameter(`${current_url_api}/listar_por_usuario_username/?username=${username}`, dispatches, callback, callback_error);
    }
};

export const fetchPuntosVentas_por_colaborador = (colaborador_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameter(`${current_url_api}/listar_por_colaborador/?colaborador_id=${colaborador_id}`, dispatches, callback, callback_error);
    }
};

export const createPuntoVenta = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deletePuntoVenta = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchPuntosVentas = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchPuntoVenta = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
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
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};