import {SERVER_INFORMATION_TYPES as TYPES} from '../../00_types';
import {fetchListGet} from '../../00_general_fuctions'

const current_url_api = 'configuracion_aplicacion_server_information';
export const fetchServerInformation = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_server_data, payload: response})
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
export const clearServerInformation = (options_action = {}) => {
    return (dispatch) => {
        dispatch({type: TYPES.clear, payload: options_action});

    }
};