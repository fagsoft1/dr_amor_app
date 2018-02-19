import {
    LOADING,
    LOADING_STOP
} from '../../00_types';

export function cargando(callback = null, callback_error = null) {
    return function (dispatch) {
        dispatch({type: LOADING})
    }
}

export function noCargando(callback = null, callback_error = null) {
    return function (dispatch) {
        dispatch({type: LOADING_STOP})
    }
}