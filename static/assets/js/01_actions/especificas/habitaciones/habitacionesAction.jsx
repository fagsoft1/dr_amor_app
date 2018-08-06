import {
    HABITACION_TYPES as TYPES,
} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodPostParameters,
    baseWS,
} from '../../00_general_fuctions'

const current_url_api = 'habitaciones';

export function refreshUpdateHabitacion(payload) {
    return baseWS(TYPES.update, payload)
}

export function refreshDeleteHabitacion(id) {
    return baseWS(TYPES.delete, id)
}

export const createHabitacion = (values, options_action) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};

export const iniciarServiciosHabitacion = (id, pago, servicios, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pago', JSON.stringify(pago));
        params.append('servicios', JSON.stringify(servicios));
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParameters(current_url_api, id, 'iniciar_servicios', params, options)
    }
};

export const cambiarHabitacion = (id, pago, nueva_habitacion_id, servicios_array_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pago', JSON.stringify(pago));
        params.append('nueva_habitacion_id', nueva_habitacion_id);
        params.append('servicios_array_id', JSON.stringify(servicios_array_id));
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParameters(current_url_api, id, 'cambiar_habitacion', params, options)
    }
};

export const terminarServiciosHabitacion = (id, punto_venta_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('punto_venta_id', punto_venta_id);
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParameters(current_url_api, id, 'terminar_servicios', params, options)
    }
};

export const cambiarEstadoHabitacion = (id, nuevo_estado, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('estado', nuevo_estado);
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParameters(current_url_api, id, 'cambiar_estado', params, options)
    }
};

export const deleteHabitacion = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id});
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};
export const fetchHabitaciones = (callback = null, callback_error = null, limpiar_coleccion = true, show_cargando = true) => {
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
            show_cargando
        };
        fetchListGet(current_url_api, options);
    }
};
export const fetchHabitacion = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response});
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};
export const clearHabitaciones = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});
    }
};
export const updateHabitacion = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response});
        };
        const options = {dispatches, callback, callback_error, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};