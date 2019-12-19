import {CONSULTAS_VENTAS_EMPRESAS_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet
} from '../../00_general_fuctions'


export const fetchConsultaVentasEmpresas = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGet('consulta_ventas_empresas', options);
    }
};

export const clearConsultaVentasEmpresas = (options_action = {}) => {
    return (dispatch) => {
        dispatch({type: TYPES.clear, payload: options_action});

    }
};