import axios from "axios/index";

const axios_instance = axios.create({
    baseURL: '/api/'
});

const mostrarFunciones = (e) => {
    const mostrar = true;
    if (mostrar) {
        e()
    }
};

export function createRequest(request, dispatches = null, callback = null, callback_error = null) {
    return request
        .then(response => {
            if (dispatches) {
                dispatches(response)
            }
            if (callback) {
                callback(response.data)
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

export function fetchList(url, dispatches = null, callback = null, callback_error = null) {
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
        callback_error
    );
}

export function fetchListWithParameter(url, dispatches = null, callback = null, callback_error = null) {
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
        callback_error
    );
}

export function fetchObject(url, id, dispatches = null, callback = null, callback_error = null) {
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
        callback_error
    );
}

export function updateObject(url, id, values, dispatches = null, callback = null, callback_error = null, config = null) {
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
        callback_error
    );
}

export function createObject(url, values, dispatches = null, callback = null, callback_error = null) {
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
        callback_error
    );
}

export function deleteObject(url, id, dispatches = null, callback = null, callback_error = null) {
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
        callback_error
    );
}


export function callApiMethod(url, id, method, dispatches = null, callback = null, callback_error = null) {
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
        callback_error
    );
}


export function callApiMethodWithParameters(url, id, method, parameters, dispatches = null, callback = null, callback_error = null) {
    mostrarFunciones(() => console.log(`%cAPI METODO ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green'));
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";

    const headers = {};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;


    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL, parameters);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function baseWS(type, payload) {
    return {
        type: type,
        payload: payload
    }
}

