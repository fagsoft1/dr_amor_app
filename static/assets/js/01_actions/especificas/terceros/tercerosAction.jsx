import {TERCERO_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    callApiMethodPostParameters
} from '../../00_general_fuctions'

const current_url_api = 'terceros';

export const registrarIngresoTercero = (id, pin, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pin', pin);
        callApiMethodPostParameters(current_url_api, id, 'registrar_ingreso', params, null, callback, callback_error, dispatch)
    }
};

export const registrarSalidaTercero = (id, pin, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pin', pin);
        callApiMethodPostParameters(current_url_api, id, 'registrar_salida', params, null, callback, callback_error, dispatch)
    }
};

export const liquidarCuentaTercero = (id, pago, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pago', JSON.stringify(pago));
        callApiMethodPostParameters(current_url_api, id, 'liquidar_cuenta', params, null, callback, callback_error, dispatch)
    }
};

export const fetchTercerosAusentes = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGet(`${current_url_api}/listar_ausentes`, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};

export const fetchTercerosPresentes = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGet(`${current_url_api}/listar_presentes`, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};

export const fetchTerceros = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGet(current_url_api, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};
export const fetchTercero = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error, dispatch);
    }
};
export const clearTerceros = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateTercero = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error, dispatch)
    }
};