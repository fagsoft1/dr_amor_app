import axios from "axios/index";
import {LOADING, LOADING_STOP} from "./00_types";

const axios_instance = axios.create({
    baseURL: '/api/',
    //contentType: 'application/json; charset=utf-8',
});

const mostrarFunciones = (e) => {
    const mostrar = true;
    if (mostrar) {
        e()
    }
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
            if (callback) {
                callback(response.data)
            }
            if (dispatch_method) {
                dispatch_method({type: LOADING_STOP})
            }
        }).catch(error => {
                if (callback_error) {
                    if (!error.response) {
                        callback_error({type_error: 'no_connection'})
                    } else if (error.request) {
                        callback_error({...error, type_error: error.request.status})
                    } else {
                        callback_error({...error, type_error: 'otro'})
                    }
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

export function fetchObjectWithParameterPDF(url, dispatches = null, callback = null, callback_error = null, dispatch_method = null) {
    console.log(`%cFETCH LIST PARAMETROS - %c${url.toUpperCase()} PARA PDF`, 'color:red', 'color:blue');
    const mensaje_cargando = `Ejecutando PDF ${method.toUpperCase()} en ${url.toUpperCase()}`;
    const FULL_URL = `${url}&format=json`;
    const request = axios_instance.get(FULL_URL, {responseType: 'arraybuffer'});
    const options = {
        dispatches,
        callback,
        callback_error,
        dispatch_method
    };
    createRequest(request, {...options, mensaje_cargando});
}

export function baseWS(type, payload) {
    return {
        type: type,
        payload: payload
    }
}

