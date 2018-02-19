import {
    CREATE_USUARIO,
    DELETE_USUARIO,
    FETCH_USUARIOS,
    FETCH_USUARIO,
    CLEAR_USUARIOS,
    UPDATE_USUARIO,
    FETCH_MI_CUENTA
} from '../00_types';

import {
    fetchList,
    updateObject,
    fetchObject,
    createObject,
    deleteObject,
    callApiMethodWithParameters
} from '../00_general_fuctions'

const current_url_api = 'usuarios';

export const addPermisoUsuario = (id, permiso_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('id_permiso', permiso_id);
        callApiMethodWithParameters(current_url_api, id, 'adicionar_permiso', params, null, callback, callback_error)
    }
};

export const addGrupoUsuario = (id, grupo_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('id_grupo', grupo_id);
        callApiMethodWithParameters(current_url_api, id, 'adicionar_grupo', params, null, callback, callback_error)
    }
};

export const createUsuario = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: CREATE_USUARIO, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteUsuario = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: DELETE_USUARIO, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchUsuarios = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_USUARIOS, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};

export const fetchMiCuenta = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_MI_CUENTA, payload: response})
        };
        fetchList(`${current_url_api}/mi_cuenta`, dispatches, callback, callback_error);
    }
};

export const fetchUsuario = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_USUARIO, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearUsuarios = () => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: CLEAR_USUARIOS, payload: response})
        };

    }
};
export const updateUsuario = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: UPDATE_USUARIO, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};