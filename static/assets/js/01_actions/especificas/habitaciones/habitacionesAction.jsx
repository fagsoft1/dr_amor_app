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

export const createHabitacion = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response});
        };
        createObject(current_url_api, values, dispatches, callback, callback_error, dispatch)
    }
};

export const iniciarServiciosHabitacion = (id, pago, servicios, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pago', JSON.stringify(pago));
        params.append('servicios', JSON.stringify(servicios));
        callApiMethodPostParameters(current_url_api, id, 'iniciar_servicios', params, null, callback, callback_error, dispatch)
    }
};

export const cambiarHabitacion = (id, pago, nueva_habitacion_id, servicios_array_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pago', JSON.stringify(pago));
        params.append('nueva_habitacion_id', nueva_habitacion_id);
        params.append('servicios_array_id', JSON.stringify(servicios_array_id));
        callApiMethodPostParameters(current_url_api, id, 'cambiar_habitacion', params, null, callback, callback_error, dispatch)
    }
};

export const terminarServiciosHabitacion = (id, punto_venta_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('punto_venta_id', punto_venta_id);
        callApiMethodPostParameters(current_url_api, id, 'terminar_servicios', params, null, callback, callback_error, dispatch)
    }
};

export const cambiarEstadoHabitacion = (id, nuevo_estado, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('estado', nuevo_estado);
        callApiMethodPostParameters(current_url_api, id, 'cambiar_estado', params, null, callback, callback_error, dispatch)
    }
};

export const deleteHabitacion = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id});
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error, dispatch)
    }
};
export const fetchHabitaciones = (callback = null, callback_error = null, limpiar_coleccion = true) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListGet(current_url_api, dispatches, callback, callback_error, dispatch, limpiar_coleccion ? TYPES.clear : null);
    }
};
export const fetchHabitacion = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response});
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error, dispatch);
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
        updateObject(current_url_api, id, values, dispatches, callback, callback_error, dispatch)
    }
};