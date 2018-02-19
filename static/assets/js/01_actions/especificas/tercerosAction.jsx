import {
    CREATE_TERCERO,
    DELETE_TERCERO,
    FETCH_TERCEROS,
    FETCH_TERCERO,
    CLEAR_TERCEROS,
    UPDATE_TERCERO
} from '../00_types';

import {
    fetchList,
    updateObject,
    fetchObject,
    createObject,
    deleteObject
} from '../00_general_fuctions'

const current_url_api = 'terceros';

export const createTercero = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: CREATE_TERCERO, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteTercero = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = () => {
            dispatch({type: DELETE_TERCERO, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchTerceros = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_TERCEROS, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchTercero = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_TERCERO, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearTerceros = () => {
    return (dispatch) => {
        dispatch({type: CLEAR_TERCEROS});

    }
};
export const updateTercero = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: UPDATE_TERCERO, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};