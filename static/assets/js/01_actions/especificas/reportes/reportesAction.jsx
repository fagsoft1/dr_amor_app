import {
    callApiMethodPostParametersPDF
} from '../../00_general_fuctions'

export function printEntregasArqueosCajas(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParametersPDF(url, id, 'imprimir_entrega', null, options)
    }
}

export function printArqueosCajas(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParametersPDF(url, id, 'imprimir_arqueo', null, options)
    }
}

export function envioEmailArqueo(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        const options = {callback, callback_error, dispatch_method: dispatch};
        callApiMethodPostParametersPDF(url, id, 'enviar_arqueo_email', null, options)
    }
}