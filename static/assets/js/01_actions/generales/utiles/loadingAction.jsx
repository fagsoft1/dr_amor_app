import {
    LOADING as TYPES
} from '../../00_types';

export function cargando(mensaje = null, titulo = null) {
    return function (dispatch) {
        dispatch({type: TYPES.loading, mensaje, titulo})
    }
}

export function noCargando() {
    return function (dispatch) {
        dispatch({type: TYPES.stop})
    }
}

export function mostrar_error_loading(mensaje = null, titulo = null) {
    return function (dispatch) {
        dispatch({type: TYPES.error, mensaje, titulo})
    }
}