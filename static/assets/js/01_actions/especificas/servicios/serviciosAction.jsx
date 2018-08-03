import {SERVICIO_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListGetURLParameters,
    callApiMethodPostParameters,
} from '../../00_general_fuctions'

const current_url_api = 'servicios';

export const solicitarAnulacionServicio = (id, observacion_anulacion, punto_venta_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('observacion_anulacion', observacion_anulacion);
        params.append('punto_venta_id', punto_venta_id);
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParameters(current_url_api, id, 'solicitar_anulacion', params, options)
    }
};


export const cambiarTiempoServicio = (id, pago, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pago', JSON.stringify(pago));
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParameters(current_url_api, id, 'cambiar_tiempo', params, options)
    }
};


export const createServicio = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};
export const deleteServicio = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};
export const terminarServicio = (id, punto_venta_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('punto_venta_id', punto_venta_id);
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParameters(current_url_api, id, 'terminar_servicio', params, options)
    }
};
export const fetchServicios = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const options = {
            dispatches,
            callback,
            callback_error,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null,
        };
        fetchListGet(current_url_api, options);
    }
};
export const fetchServicios_en_proceso = (callback = null, callback_error = null, limpiar_coleccion = true, show_cargando = true) => {
    return (dispatch) => {
        console.log('soi')
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const options = {
            dispatches,
            callback,
            callback_error,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null,
            show_cargando
        };
        fetchListGet(`${current_url_api}/en_proceso`, options);
    }
};
export const fetchServicios_por_habitacion = (habitacion_id, callback = null, callback_error = null, limpiar_coleccion = true) => {
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
        fetchListGetURLParameters(`${current_url_api}/pendientes_por_habitacion/?habitacion_id=${habitacion_id}`, options);
    }
};
export const fetchServicios_por_tercero_cuenta_abierta = (tercero_id, callback = null, callback_error = null, limpiar_coleccion = true) => {
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
        fetchListGetURLParameters(`${current_url_api}/consultar_por_tercero_cuenta_abierta/?tercero_id=${tercero_id}`, options);
    }
};
export const fetchServicio = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};
export const clearServicios = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateServicio = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};