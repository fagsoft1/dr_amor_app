import {ASIENTO_CONTABLE_TYPES as TYPES} from '../../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListGetURLParameters,
    fetchListPostURLParameters, callApiMethodPostParametersPDF,
} from '../../../00_general_fuctions'

const current_url_api = 'contabilidad_movimientos_asientos_contables';

export const asentarOperacionContableAsientoContable = (values, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        _.mapKeys(values, (v, k) => {
            if (v) {
                params.append(k, v);
            }
        });
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchListPostURLParameters(current_url_api, 'asentar_operacion_caja', params, options)
    }
};

export function printComprobanteAsientoContable(id, options_action) {
    return function (dispatch) {
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParametersPDF(current_url_api, id, 'imprimir_asiento_contable', null, options)
    }
}

export const createAsientoContable = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deleteAsientoContable = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchAsientosContables = (options_action = {}) => {
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
        return fetchListGet(current_url_api, options);
    }
};
export const fetchAsientosContables_por_fecha_empresa_diario = (fecha, diario_id, empresa_id, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/por_fecha_empresa_diario/?fecha=${fecha}&diario_id=${diario_id}&empresa_id=${empresa_id}`, options);
    }
};
export const fetchAsientoContable = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearAsientosContables = (options_action = {}) => {
    return (dispatch) => {
        dispatch({type: TYPES.clear, payload: options_action});

    }
};
export const updateAsientoContable = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};