import axios from "axios/index";

const axios_instance = axios.create({
    baseURL: '/api/'
});

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
    console.log(`entro nuevo fetch list para ${url}`);
    const FULL_URL = `${url}/?format=json`;
    const request = axios_instance.get(FULL_URL);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function fetchListWithParameter(url, dispatches = null, callback = null, callback_error = null) {
    console.log(`entro nuevo fetch list with parameters para ${url}`);
    const FULL_URL = `${url}&format=json`;
    const request = axios_instance.get(FULL_URL);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function fetchObject(url, id, dispatches = null, callback = null, callback_error = null) {
    console.log(`entro nuevo fetch object para ${url} con id ${id}`);
    const FULL_URL = `${url}/${id}/?format=json`;
    const request = axios_instance.get(FULL_URL);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function updateObject(url, id, values, dispatches = null, callback = null, callback_error = null) {
    console.log(`entro nuevo update object para ${url} con id ${id}`);
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/${id}/`;
    const request = axios_instance.put(FULL_URL, values);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function createObject(url, values, dispatches = null, callback = null, callback_error = null) {
    console.log(`entro nuevo create object para ${url}`);
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
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
    console.log(`entro nuevo delete object para ${url} para ${id}`);
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
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
    console.log(`entro call api method para ${url} para ${id}`);
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
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
    console.log(`entro call api method para ${url} para ${id}`);
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL, parameters);
    createRequest(
        request,
        dispatches,
        callback,
        callback_error
    );
}

