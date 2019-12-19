import {HISTORICO_REVISION_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    fetchObject,
    callApiMethodPost
} from '../../00_general_fuctions'
import {current_url_api as empresas_url} from '../../especificas/empresasAction';
import {current_url_api as habitaciones_url} from '../../especificas/habitaciones/habitacionesAction';

const current_url_api = 'historico';

export const fetchHistoricosRevisionsEmpresas = (id_object, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches, ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return callApiMethodPost(empresas_url, id_object, 'historico', options);
    }
};


export const fetchHistoricosRevisionsHabitaciones = (id_object, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches, ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return callApiMethodPost(habitaciones_url, id_object, 'historico', options);
    }
};

export const fetchHistoricosRevisions = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches, ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGet(current_url_api, options);
    }
};
export const fetchHistoricoRevision = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: {...response, ...options_action}})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearHistoricosRevisions = (options_action = {}) => {
    return (dispatch) => {
        dispatch({type: TYPES.clear, payload: options_action});

    }
};