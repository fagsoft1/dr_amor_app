import {REGISTRO_ENTRADA_PARQUEO_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodPost, callApiMethodPostParameters
} from '../../00_general_fuctions'

const current_url_api = 'parqueadero_registros_entradas_parqueos';
export const createRegistroEntradaParqueo = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};

export const valorAPagarRegistroEntradaParqueo = (id, options_action = {}) => {
    return (dispatch) => {
        const options = {
            ...options_action,
            dispatch_method: dispatch
        };
        return callApiMethodPost(current_url_api, id, 'valor_a_pagar', options)
    }
};

export const registrarSalidaRegistroEntradaParqueo = (id, options_action = {}) => {
    return (dispatch) => {
        const options = {
            ...options_action,
            dispatch_method: dispatch
        };
        return callApiMethodPost(current_url_api, id, 'registrar_salida', options)
    }
};

export const pagarRegistroEntradaParqueo = (id, modalidad_fraccion_tiempo_detalle_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('modalidad_fraccion_tiempo_detalle_id', modalidad_fraccion_tiempo_detalle_id);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'pagar', params, options)
    }
};

export const deleteRegistroEntradaParqueo = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};
export const fetchRegistrosEntradasParqueos = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches, ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(current_url_api, options);
    }
};
export const fetchRegistrosEntradasParqueos_por_salir = (options_action = {}) => {
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
        fetchListGet(`${current_url_api}/por_en_proceso`, options);
    }
};
export const fetchRegistroEntradaParqueo = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};
export const clearRegistrosEntradasParqueos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateRegistroEntradaParqueo = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};