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

export function createRequest(request, dispatches = null, callback = null, callback_error = null, dispatch_method = null, clear_action_type = null) {
    if (clear_action_type) {
        console.log(`Uso ${clear_action_type}`);
        dispatch_method({type: clear_action_type})
    }
    if (dispatch_method) {
        dispatch_method({type: LOADING})
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

export function fetchListGet(url, dispatches = null, callback = null, callback_error = null, dispatch_method = null, clear_action_type = null) {
    mostrarFunciones(() => console.log(`%cFETCH LIST - %c${url.toUpperCase()}`, 'color:red', 'color:blue'));
    const FULL_URL = `${url}/?format=json`;
    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    const request = axios_instance.get(FULL_URL);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error,
        dispatch_method,
        clear_action_type
    );
}

export function fetchListGetURLParameters(url, dispatches = null, callback = null, callback_error = null, dispatch_method = null, clear_action_type = null) {
    mostrarFunciones(() => console.log(`%cFETCH LIST PARAMETROS - %c${url.toUpperCase()}`, 'color:red', 'color:blue'));
    const FULL_URL = `${url}&format=json`;
    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    const request = axios_instance.get(FULL_URL);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error,
        dispatch_method,
        clear_action_type
    );
}

export function fetchObject(url, id, dispatches = null, callback = null, callback_error = null, dispatch_method = null) {
    mostrarFunciones(() => console.log(`%cFETCH OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green'));
    const FULL_URL = `${url}/${id}/?format=json`;
    const request = axios_instance.get(FULL_URL);
    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    createRequest(
        request,
        dispatches,
        callback,
        callback_error,
        dispatch_method
    );
}

export function updateObject(url, id, values, dispatches = null, callback = null, callback_error = null, config = null, dispatch_method = null) {
    mostrarFunciones(() => console.log(`%cUPDATE OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green'));
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";

    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;

    const FULL_URL = `${url}/${id}/`;
    const request = axios_instance.put(FULL_URL, values, config);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error,
        dispatch_method
    );
}

export function createObject(url, values, dispatches = null, callback = null, callback_error = null, dispatch_method = null) {
    mostrarFunciones(() => console.log(`%cCREATE OBJETO - %c${url.toUpperCase()}`, 'color:red', 'color:blue'));
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";

    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;


    const FULL_URL = `${url}/`;
    const request = axios_instance.post(FULL_URL, values);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error,
        dispatch_method
    );
}

export function deleteObject(url, id, dispatches = null, callback = null, callback_error = null, dispatch_method = null) {
    mostrarFunciones(() => console.log(`%cDELETE OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green'));
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";

    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;

    const FULL_URL = `${url}/${id}/`;
    const request = axios_instance.delete(FULL_URL);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error,
        dispatch_method
    );
}


export function callApiMethodPost(url, id, method, dispatches = null, callback = null, callback_error = null, dispatch_method = null) {
    mostrarFunciones(() => console.log(`%cAPI METODO ${method.toUpperCase()} - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green'));
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";

    const headers = {};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;


    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error,
        dispatch_method
    );
}


export function callApiMethodPostParameters(url, id, method, values, dispatches = null, callback = null, callback_error = null, dispatch_method = null) {
    mostrarFunciones(() => console.log(`%cAPI METODO ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green'));
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
    createRequest(
        request,
        dispatches,
        callback,
        callback_error,
        dispatch_method
    );
}

export function callApiMethodPostParametersPDF(url, id, method, parameters, dispatches = null, callback = null, callback_error = null, dispatch_method = null) {
    console.log(`%cAPI METODO ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()} - %cID ${id} PARA PDF`, 'color:red', 'color:blue', 'color:green');
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL, parameters, {responseType: 'arraybuffer'});
    createRequest(
        request,
        dispatches,
        callback,
        callback_error,
        dispatch_method
    );
}

export function fetchObjectWithParameterPDF(url, dispatches = null, callback = null, callback_error = null, dispatch_method = null) {
    console.log(`%cFETCH LIST PARAMETROS - %c${url.toUpperCase()} PARA PDF`, 'color:red', 'color:blue');
    const FULL_URL = `${url}&format=json`;
    const request = axios_instance.get(FULL_URL, {responseType: 'arraybuffer'});
    createRequest(
        request,
        dispatches,
        callback,
        callback_error,
        dispatch_method
    );
}

export function baseWS(type, payload) {
    return {
        type: type,
        payload: payload
    }
}

