import {
    HABITACION_TYPES as TYPES
} from '../../00_types';
import {
    fetchList,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodWithParameters,
    callApiMethod,
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
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};

export const iniciarServiciosHabitacion = (id, pago, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pago', JSON.stringify(pago));
        callApiMethodWithParameters(current_url_api, id, 'iniciar_servicios', params, null, callback, callback_error)
    }
};

export const cambiarHabitacion = (id, pago, nueva_habitacion_id, servicios_array_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pago', JSON.stringify(pago));
        params.append('nueva_habitacion_id', nueva_habitacion_id);
        params.append('servicios_array_id', JSON.stringify(servicios_array_id));
        callApiMethodWithParameters(current_url_api, id, 'cambiar_habitacion', params, null, callback, callback_error)
    }
};

export const terminarServiciosHabitacion = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        callApiMethod(current_url_api, id, 'terminar_servicios', null, callback, callback_error)
    }
};

export const cambiarEstadoHabitacion = (id, nuevo_estado, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('estado', nuevo_estado);
        callApiMethodWithParameters(current_url_api, id, 'cambiar_estado', params, null, callback, callback_error)
    }
};

export const adicionarServicioHabitacion = (id, tercero_id, categoria_fraccion_tiempo_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('tercero_id', tercero_id);
        params.append('categoria_fraccion_tiempo_id', categoria_fraccion_tiempo_id);
        callApiMethodWithParameters(current_url_api, id, 'adicionar_servicio', params, null, callback, callback_error)
    }
};

export const deleteHabitacion = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchHabitaciones = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchHabitacion = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
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
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};