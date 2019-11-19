import {CONFIGURACION_APLICACION_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject
} from '../../00_general_fuctions'

const current_url_api = 'configuracion_aplicacion_datos_generales';
export const fetchDatosGeneralesAplicacion = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_datos_generales, payload: response})
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
export const clearDatosGeneralesAplicacion = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateDatoGeneralAplicacion = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update_datos_generales, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};