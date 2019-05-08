import {
    callApiMethodPostParametersPDF
} from '../../00_general_fuctions'

export function printEntregasArqueosCajas(id, options_action) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParametersPDF(url, id, 'imprimir_entrega', null, options)
    }
}

export function printArqueosCajas(id, options_action) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParametersPDF(url, id, 'imprimir_arqueo', null, options)
    }
}

export function printReciboEntradaParqueadero(id, options_action) {
    return function (dispatch) {
        const url = 'parqueadero_registros_entradas_parqueos';
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParametersPDF(url, id, 'imprimir_recibo', null, options)
    }
}

export function printFacturaPagoParqueadero(id, options_action) {
    return function (dispatch) {
        const url = 'parqueadero_registros_entradas_parqueos';
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParametersPDF(url, id, 'imprimir_factura', null, options)
    }
}

export function envioEmailArqueo(id, options_action) {
    return function (dispatch) {
        const url = 'arqueos_cajas';
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParametersPDF(url, id, 'enviar_arqueo_email', null, options)
    }
}