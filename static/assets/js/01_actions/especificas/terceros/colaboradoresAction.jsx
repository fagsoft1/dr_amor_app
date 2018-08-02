import {
    COLABORADOR_TYPES as TYPES
} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodPostParameters
} from '../../00_general_fuctions'

const current_url_api = 'colaboradores';

export const adicionarPuntoVenta = (id, punto_venta_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('punto_venta_id', punto_venta_id);
        callApiMethodPostParameters(current_url_api, id, 'adicionar_punto_venta', params, null, callback, callback_error, dispatch)
    }
};

export const quitarPuntoVenta = (id, punto_venta_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('punto_venta_id', punto_venta_id);
        callApiMethodPostParameters(current_url_api, id, 'quitar_punto_venta', params, null, callback, callback_error, dispatch)
    }
};

export const createColaborador = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error, dispatch)
    }
};
export const deleteColaborador = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error, dispatch)
    }
};
export const fetchColaboradores = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGet(current_url_api, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};
export const fetchColaborador = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error, dispatch);
    }
};
export const clearColaboradores = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateColaborador = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error, dispatch)
    }
};