import axios from "axios/index";
import React from 'react';
import {SubmissionError} from "redux-form";
import * as actions from "../01_actions/01_index";

const axios_instance = axios.create({
    baseURL: '/api/',
});

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
        dispatch_method(actions.cargando(mensaje_cargando))
    }
    return request.then(response => {
        if (dispatches) {
            dispatches(response)
        }
        if (dispatch_method) {
            if (response.data && response.data.result) {
                dispatch_method(actions.notificarAction(response.data.result));
            }
            dispatch_method(actions.noCargando())
        }
        if (callback) {
            callback(response.data)
        }
    }).catch(error => {
            if (callback_error) {
                callback_error(error)
            }
            if (error.response) {
                if (error.response.status === 400) {
                    dispatch_method(actions.noCargando());
                    if (error.response && error.response.data) {
                        if (error.response.data['non_field_errors']) {
                            error.response.data['_error'] = error.response.data['non_field_errors'];
                            dispatch_method(actions.notificarErrorAction(error.response.data['non_field_errors']));
                        }
                        if (error.response.data['_error']) {
                            dispatch_method(actions.notificarErrorAction(error.response.data['_error']));
                        }
                        if (error.response.data['nro_identificacion']) {
                            error.response.data['nro_identificacion_1'] = error.response.data['nro_identificacion']
                        }
                        throw new SubmissionError(error.response.data)
                    }
                } else if (error.response.status === 401) {

                } else if (error.response.status === 403) {
                    dispatch_method(actions.mostrar_error_loading(error.response.data['detail'], `${error.response.status}: ${error.response.statusText}`));
                    dispatch_method(actions.notificarErrorAction(error.response.data['detail']));
                } else if (402 < error.response.status < 600) {
                    dispatch_method(actions.mostrar_error_loading(error.response.data, `${error.response.status}: ${error.response.statusText}`));
                    dispatch_method(actions.notificarErrorAction(error.response.status));
                } else {
                    if (error.response.data) {
                        console.log(error.response)
                    }
                }
            }
            else if (!error.response) {
                if (error.message === 'Network Error') {
                    dispatch_method(actions.mostrar_error_loading(error.stack, 'Error de red'))
                } else {
                    dispatch_method(actions.mostrar_error_loading(error.stack, error.message))
                }
            }
        }
    );
}

export function fetchListGet(url, options) {
    console.log(`%cFETCH LIST - %c${url.toUpperCase()}`, 'color:red', 'color:blue');
    const mensaje_cargando = `Consultando ${url.toUpperCase()}`;
    const FULL_URL = `${url}/?format=json`;
    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    const request = axios_instance.get(FULL_URL);
    return createRequest(request, {...options, mensaje_cargando});
}

export function fetchListGetURLParameters(url, options) {
    console.log(`%cFETCH LIST PARAMETROS - %c${url.toUpperCase()}`, 'color:red', 'color:blue');
    const mensaje_cargando = `Consultando ${url.toUpperCase()}`;
    const FULL_URL = `${url}&format=json`;
    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    const request = axios_instance.get(FULL_URL);
    return createRequest(request, {...options, mensaje_cargando});
}


export function fetchListPostURLParameters(url, method, values, options) {
    console.log(`%cAPI METODO ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()} - %cID`, 'color:red', 'color:blue', 'color:green');
    const mensaje_cargando = `Ejecutando ${method.toUpperCase()} en ${url.toUpperCase()}`;
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const headers = {};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8';
    axios_instance.defaults.headers = headers;
    const FULL_URL = `${url}/${method}/`;
    const request = axios_instance.post(FULL_URL, values);
    return createRequest(request, {...options, mensaje_cargando});
}

export function fetchObject(url, id, options) {
    console.log(`%cFETCH OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green');
    const mensaje_cargando = `Consultando elemento en ${url.toUpperCase()}`;
    const FULL_URL = `${url}/${id}/?format=json`;
    const request = axios_instance.get(FULL_URL);
    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    return createRequest(request, {...options, mensaje_cargando});
}

export function updateObject(url, id, values, options, config = null) {
    console.log(`%cUPDATE OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green');
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
    return createRequest(request, {...options, mensaje_cargando});
}

export function createObject(url, values, options) {
    console.log(`%cCREATE OBJETO - %c${url.toUpperCase()}`, 'color:red', 'color:blue');
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
    return createRequest(request, {...options, mensaje_cargando});
}

export function deleteObject(url, id, options) {
    console.log(`%cDELETE OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green');
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
    return createRequest(request, {...options, mensaje_cargando});
}


export function callApiMethodPost(url, id, method, options) {
    console.log(`%cAPI METODO ${method.toUpperCase()} - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green');
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
    return createRequest(request, {...options, mensaje_cargando});
}


export function callApiMethodPostParameters(url, id, method, values, options) {
    console.log(`%cAPI METODO ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green');
    const mensaje_cargando = `Ejecutando ${method.toUpperCase()} en ${url.toUpperCase()}`;
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const headers = {};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8';
    axios_instance.defaults.headers = headers;
    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL, values);
    return createRequest(request, {...options, mensaje_cargando});
}

export function callApiMethodPostParametersPDF(url, id, method, parameters, options) {
    console.log(`%cAPI METODO ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()} - %cID ${id} PARA PDF`, 'color:red', 'color:blue', 'color:green');
    const mensaje_cargando = `Ejecutando PDF ${method.toUpperCase()} en ${url.toUpperCase()}`;
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL, parameters, {responseType: 'arraybuffer'});
    return createRequest(request, {...options, mensaje_cargando});
}

export function fetchObjectWithParameterPDF(url, options) {
    console.log(`%cFETCH LIST PARAMETROS - %c${url.toUpperCase()} PARA PDF`, 'color:red', 'color:blue');
    const mensaje_cargando = `Ejecutando PDF ${method.toUpperCase()} en ${url.toUpperCase()}`;
    const FULL_URL = `${url}&format=json`;
    const request = axios_instance.get(FULL_URL, {responseType: 'arraybuffer'});
    return createRequest(request, {...options, mensaje_cargando});
}


export function uploadArchivo(url, id, method, values, options) {
    console.log(`%cAPI UPLOAD Archivo ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green');
    const mensaje_cargando = `Ejecutando ${method.toUpperCase()} en ${url.toUpperCase()}`;
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const headers = {};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8';
    axios_instance.defaults.headers = headers;
    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL, values, {responseType: 'arraybuffer'});
    return createRequest(request, {...options, mensaje_cargando});
}

export function baseWS(type, payload) {
    return {
        type: type,
        payload: payload
    }
}