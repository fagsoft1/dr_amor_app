import {
    LOADING,
    LOADING_STOP
} from '../../00_types';

export function cargando() {
    return function (dispatch) {
        dispatch({type: LOADING})
    }
}

export function noCargando() {
    return function (dispatch) {
        dispatch({type: LOADING_STOP})
    }
}