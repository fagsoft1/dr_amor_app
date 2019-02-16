import {
    LOADING as TYPES
} from '../../00_types';

export function cargando() {
    return function (dispatch) {
        dispatch({type: TYPES.loading})
    }
}

export function noCargando() {
    return function (dispatch) {
        dispatch({type: TYPES.stop})
    }
}