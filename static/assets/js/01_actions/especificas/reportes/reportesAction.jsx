import {
    callApiMethodPostParametersPDF
} from '../../00_general_fuctions'

export function printEntregasArqueosCajas(id, options_action) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        const options = {...options_action, dispatch_method: dispatch};
        callApiMethodPostParametersPDF(url, id, 'imprimir_entrega', null, options)
    }
}

export function printArqueosCajas(id, options_action) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        const options = {...options_action, dispatch_method: dispatch};
        callApiMethodPostParametersPDF(url, id, 'imprimir_arqueo', null, options)
    }
}

export function envioEmailArqueo(id, options_action) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        const options = {...options_action, dispatch_method: dispatch};
        callApiMethodPostParametersPDF(url, id, 'enviar_arqueo_email', null, options)
    }
}