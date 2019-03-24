import {
    MOVIMIENTO_INVENTARIO_TYPES as TYPES
} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodPost,
    callApiMethodPostParameters,
    uploadArchivo
} from '../../00_general_fuctions'

const current_url_api = 'movimiento_inventario';

export const uploadFotoDocumentoMovimientoInventario = (id, values, options_action = {}) => {
    return (dispatch) => {
        const options = {...options_action, dispatch_method: dispatch};
        uploadArchivo(current_url_api, id, 'upload_foto_documento', values, options)
    }
};

export const deleteFotoDocumentoMovimientoInventario = (id, documento_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('documento_id', documento_id);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'delete_foto_documento', params, options);
    }
};

export const createMovimientoInventario = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deleteMovimientoInventario = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};

export const cargarInventarioMovimientoInventario = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch
        };
        return callApiMethodPost(current_url_api, id, 'cargar_inventario', options)
    }
};


export const fetchMovimientosInventarios = (options_action = {}) => {
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

export const fetchMovimientoSaldoInicial = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            callback,
            callback_error,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGet(`${current_url_api}/saldos_iniciales`, options);
    }
};
export const fetchMovimientoInventario = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearMovimientosInventarios = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateMovimientoInventario = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};