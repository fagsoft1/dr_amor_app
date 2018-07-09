import {SERVICIO_TYPES as TYPES} from '../../00_types';
import {
    fetchList,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListWithParameter,
    callApiMethod,
    callApiMethodWithParameters,
} from '../../00_general_fuctions'

const current_url_api = 'servicios';

export const solicitarAnulacionServicio = (id, observacion_anulacion, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('observacion_anulacion', observacion_anulacion);
        callApiMethodWithParameters(current_url_api, id, 'solicitar_anulacion', params, null, callback, callback_error)
    }
};


export const cambiarTiempoServicio = (id, pago, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pago', JSON.stringify(pago));
        callApiMethodWithParameters(current_url_api, id, 'cambiar_tiempo', params, null, callback, callback_error)
    }
};


export const createServicio = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteServicio = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const terminarServicio = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        callApiMethod(current_url_api, id, 'terminar_servicio', null, callback, callback_error)
    }
};
export const fetchServicios = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchServicios_en_proceso = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(`${current_url_api}/en_proceso`, dispatches, callback, callback_error);
    }
};
export const fetchServicios_por_habitacion = (habitacion_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameter(`${current_url_api}/pendientes_por_habitacion/?habitacion_id=${habitacion_id}`, dispatches, callback, callback_error);
    }
};
export const fetchServicio = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
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
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};