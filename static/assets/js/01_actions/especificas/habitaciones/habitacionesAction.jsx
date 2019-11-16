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
export {current_url_api};

export function refreshUpdateHabitacion(payload) {
    return baseWS(TYPES.update, payload)
}

export function refreshDeleteHabitacion(id) {
    return baseWS(TYPES.delete, id)
}

export const iniciarServiciosHabitacion = (id, pago, servicios, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pago', JSON.stringify(pago));
        params.append('servicios', JSON.stringify(servicios));
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'iniciar_servicios', params, options)
    }
};

export const cambiarHabitacion = (id, pago, nueva_habitacion_id, servicios_array_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pago', JSON.stringify(pago));
        params.append('nueva_habitacion_id', nueva_habitacion_id);
        params.append('servicios_array_id', JSON.stringify(servicios_array_id));
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'cambiar_habitacion', params, options)
    }
};

export const terminarServiciosHabitacion = (id, punto_venta_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('punto_venta_id', punto_venta_id);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'terminar_servicios', params, options)
    }
};

export const cambiarEstadoHabitacion = (id, nuevo_estado, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('estado', nuevo_estado);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'cambiar_estado', params, options)
    }
};

export const fetchHabitacion = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};

export const clearHabitaciones = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});
    }
};

export const createHabitacion = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};

export const updateHabitacion = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};

export const fetchHabitaciones = (options_action = {}) => {
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

export const deleteHabitacion = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};