import axios from "axios/index";
import {LOADING, LOADING_STOP} from "./00_types";
import {NOTIFICATION_TYPE_ERROR, NOTIFICATION_TYPE_SUCCESS} from 'react-redux-notify';
import {createNotification} from 'react-redux-notify';
import React from 'react';

const axios_instance = axios.create({
    baseURL: '/api/',
    //contentType: 'application/json; charset=utf-8',
});

const mostrarFunciones = e => {
    const mostrar = true;
    if (mostrar) {
        e()
    }
};

const notificarAction = (mensaje, tiempo = 5000) => {
    return {
        message: mensaje,
        type: NOTIFICATION_TYPE_SUCCESS,
        duration: tiempo,
        position: 'BottomRight',
        canDimiss: true,
        icon: <i className="fa fa-check"/>
    }
};


const notificacion_error = (error, tiempo = 7000) => {
    let mensaje = '';
    let mensaje_final = '';
    const {type_error} = error;

    console.log(error)

    if (error.response) {
        mensaje_final += `Error ${error.response.status} ${error.response.statusText}`
    }
    if (type_error) {
        switch (type_error) {
            case 'no_connection':
                mensaje = 'Se han presentado problemas de conexión';
                break;
            case 404:
                mensaje = `El servicio de consulta se encuentra caido:`;
                break;
            case 400:
                mensaje = `Problema en la consulta:`;
                break;
            case 403:
                mensaje = `Problema en autenticación:`;
                break;
            case 401:
                mensaje = `Problema en autenticación:`;
                break;
            case 500:
                mensaje = `Error grave en el servidor, avisar al administrador:`;
                break;
            default:
                mensaje += `Otro mensaje no especificado:`;
        }
    }

    if (error.response && error.response.data) {
        _.map(error.response.data, item => {
            mensaje += `(${item})`
        })
    }
    if (error.config && error.config.baseURL) {
        mensaje += `(${error.config.baseURL})`
    }
    mensaje += ` ${mensaje_final}.`;

    return {
        message: mensaje,
        type: NOTIFICATION_TYPE_ERROR,
        duration: tiempo,
        position: 'BottomRight',
        canDimiss: true,
        icon: <i className="fa fa-exclamation"/>
    };
};

export function createRequest(request, options = {}) {
    const {
        dispatches = null,
        callback = null,
        callback_error = null,
        dispatch_method = null,
        clear_action_type = null,
        mensaje_cargando = '',
        show_cargando = true,
    } = options;

    if (clear_action_type) {
        dispatch_method({type: clear_action_type})
    }
    if (dispatch_method && show_cargando) {
        dispatch_method({type: LOADING, message: mensaje_cargando})
    }
    return request
        .then(response => {
            if (dispatches) {
                dispatches(response)
            }
            if (dispatch_method) {
                if (response.data && response.data.result) {
                    dispatch_method(createNotification(notificarAction(response.data.result)));
                }
                dispatch_method({type: LOADING_STOP})
            }
            if (callback) {
                callback(response.data)
            }
        }).catch(error => {
                if (callback_error) {
                    callback_error(error);
                }
                if (dispatch_method) {
                    let notificacion = null;
                    if (!error.response) {
                        notificacion = notificacion_error({type_error: 'no_connection'})
                    } else if (error.request) {
                        notificacion = notificacion_error({...error, type_error: error.request.status})
                    } else {
                        notificacion = notificacion_error({...error, type_error: 'otro'})
                    }
                    dispatch_method(createNotification(notificacion));
                }
            }
        );
}

export function fetchListGet(url, options) {
    mostrarFunciones(() => console.log(`%cFETCH LIST - %c${url.toUpperCase()}`, 'color:red', 'color:blue'));
    const mensaje_cargando = `Consultando ${url.toUpperCase()}`;
    const FULL_URL = `${url}/?format=json`;
    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    const request = axios_instance.get(FULL_URL);
    createRequest(request, {...options, mensaje_cargando});
}

export function fetchListGetURLParameters(url, options) {
    mostrarFunciones(() => console.log(`%cFETCH LIST PARAMETROS - %c${url.toUpperCase()}`, 'color:red', 'color:blue'));
    const mensaje_cargando = `Consultando ${url.toUpperCase()}`;
    const FULL_URL = `${url}&format=json`;
    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    const request = axios_instance.get(FULL_URL);
    createRequest(request, {...options, mensaje_cargando});
}

export function fetchObject(url, id, options) {
    mostrarFunciones(() => console.log(`%cFETCH OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green'));
    const mensaje_cargando = `Consultando elemento en ${url.toUpperCase()}`;
    const FULL_URL = `${url}/${id}/?format=json`;
    const request = axios_instance.get(FULL_URL);
    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    createRequest(request, {...options, mensaje_cargando});
}

export function updateObject(url, id, values, options, config = null) {
    mostrarFunciones(() => console.log(`%cUPDATE OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green'));
    const mensaje_cargando = `Actualizando elemento en ${url.toUpperCase()}`;
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";

    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    const FULL_URL = `${url}/${id}/`;
    const request = axios_instance.put(FULL_URL, values, config);
    createRequest(request, {...options, mensaje_cargando});
}

export function createObject(url, values, options) {
    mostrarFunciones(() => console.log(`%cCREATE OBJETO - %c${url.toUpperCase()}`, 'color:red', 'color:blue'));
    const mensaje_cargando = `Creando elemento en ${url.toUpperCase()}`;
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    const FULL_URL = `${url}/`;
    const request = axios_instance.post(FULL_URL, values);
    createRequest(request, {...options, mensaje_cargando});
}

export function deleteObject(url, id, options) {
    mostrarFunciones(() => console.log(`%cDELETE OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green'));
    const mensaje_cargando = `Eliminando elemento en ${url.toUpperCase()}`;
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";

    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;

    const FULL_URL = `${url}/${id}/`;
    const request = axios_instance.delete(FULL_URL);
    createRequest(request, {...options, mensaje_cargando});
}


export function callApiMethodPost(url, id, method, options) {
    mostrarFunciones(() => console.log(`%cAPI METODO ${method.toUpperCase()} - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green'));
    const mensaje_cargando = `Ejecutando ${method.toUpperCase()} en ${url.toUpperCase()}`;
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const headers = {};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL);
    createRequest(request, {...options, mensaje_cargando});
}


export function callApiMethodPostParameters(url, id, method, values, options) {
    mostrarFunciones(() => console.log(`%cAPI METODO ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green'));
    const mensaje_cargando = `Ejecutando ${method.toUpperCase()} en ${url.toUpperCase()}`;
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const headers = {};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
        headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8';
    }
    axios_instance.defaults.headers = headers;
    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL, values);
    createRequest(request, {...options, mensaje_cargando});
}

export function callApiMethodPostParametersPDF(url, id, method, parameters, options) {
    console.log(`%cAPI METODO ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()} - %cID ${id} PARA PDF`, 'color:red', 'color:blue', 'color:green');
    const mensaje_cargando = `Ejecutando PDF ${method.toUpperCase()} en ${url.toUpperCase()}`;
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL, parameters, {responseType: 'arraybuffer'});
    createRequest(request, {...options, mensaje_cargando});
}

export function fetchObjectWithParameterPDF(url, options) {
    console.log(`%cFETCH LIST PARAMETROS - %c${url.toUpperCase()} PARA PDF`, 'color:red', 'color:blue');
    const mensaje_cargando = `Ejecutando PDF ${method.toUpperCase()} en ${url.toUpperCase()}`;
    const FULL_URL = `${url}&format=json`;
    const request = axios_instance.get(FULL_URL, {responseType: 'arraybuffer'});
    createRequest(request, {...options, mensaje_cargando});
}

export function baseWS(type, payload) {
    return {
        type: type,
        payload: payload
    }
}

