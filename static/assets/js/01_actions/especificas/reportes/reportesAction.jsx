import {
    callApiMethodPostParametersPDF
} from '../../00_general_fuctions'

export function printEntregasArqueosCajas(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        callApiMethodPostParametersPDF(url, id, 'imprimir_entrega', null, null, callback, callback_error, dispatch)
    }
}

export function printArqueosCajas(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        callApiMethodPostParametersPDF(url, id, 'imprimir_arqueo', null, null, callback, callback_error, dispatch)
    }
}

export function envioEmailArqueo(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        callApiMethodPostParametersPDF(url, id, 'enviar_arqueo_email', null, null, callback, callback_error, dispatch)
    }
}