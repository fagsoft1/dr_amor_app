import {
    fetchListPostURLParameters,
    fetchListGet
} from '../../00_general_fuctions'

const current_url_api = 'authentication';

export const clear_authentication_errors = () => {
    return (dispatch) => {
        dispatch({type: "LOGIN_FAILED", data: null});
    }
};


export const logout = (options_action = {}) => {
    return (dispatch) => {
        const callback_error = (error) => {
            if (error.status === 403 || error.status === 401) {
                dispatch({type: "AUTHENTICATION_ERROR", data: error.response.data});
            } else {
                dispatch({type: "LOGIN_FAILED", data: error.response.data});
            }
        };
        const dispatches = () => {
            dispatch({type: 'LOGOUT_SUCCESSFUL'});
        };
        const options = {
            dispatches,
            callback_error,
            ...options_action,
            dispatch_method: dispatch
        };
        return fetchListGet(`${current_url_api}/logout`, options);
    }
};


export const loadUser = (options_action = {}) => {
    return (dispatch) => {
        const callback_error = (error) => {
            if (error.response.status >= 400 && error.response.status < 500) {
                dispatch({type: "AUTHENTICATION_ERROR", data: error.response.data});
            }
        };
        const dispatches = (response) => {
            dispatch({type: 'USER_LOADED', user: response.data})
        };
        const options = {
            dispatches,
            callback_error,
            ...options_action,
            dispatch_method: dispatch
        };
        return fetchListGet(`${current_url_api}/cargar_usuario`, options);
    }
};

export const login = (username, password, options_action = {}) => {
    return (dispatch) => {
        const callback_error = (error) => {
            if (error.response.status === 403 || error.response.status === 401) {
                dispatch({type: "AUTHENTICATION_ERROR", data: error.response.data});
            } else {
                dispatch({type: "LOGIN_FAILED", data: error.response.data});
            }
        };
        const dispatches = (response) => {
            if (response.status === 200) {
                dispatch({type: 'LOGIN_SUCCESSFUL', data: response.data});
            }
        };
        const options = {
            dispatches,
            callback_error,
            ...options_action,
            dispatch_method: dispatch,
        };
        let params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        return fetchListPostURLParameters(current_url_api, 'login', params, options);
    }
};