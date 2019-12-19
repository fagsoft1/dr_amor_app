import {PUNTO_VENTA_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    fetchListGetURLParameters,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodPostParameters
} from '../../00_general_fuctions'

const current_url_api = 'puntos_ventas';

export const abrirPuntoVenta = (id, base_inicial_efectivo, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('base_inicial_efectivo', base_inicial_efectivo);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'abrir_punto_venta', params, options)
    }
};


export const relacionarConceptoCajaPuntoVenta = (id, concepto_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('concepto_id', concepto_id);
        params.append('tipo_accion', 'add');
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'relacionar_concepto_caja', params, options)
    }
};

export const setCierreConceptoCajaPuntoVenta = (id, concepto_id, en_cierre, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('concepto_id', concepto_id);
        params.append('en_cierre', en_cierre);
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'set_cierre_concepto_operacion_caja', params, options)
    }
};

export const setActivoMetodoPagoPuntoVenta = (id, metodo_pago_id, activo, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('metodo_pago_id', metodo_pago_id);
        params.append('activo', activo);
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'set_activo_metodo_pago', params, options)
    }
};

export const quitarConceptoCajaPuntoVenta = (id, concepto_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('concepto_id', concepto_id);
        params.append('tipo_accion', 'rem');
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'relacionar_concepto_caja', params, options)
    }
};

export const relacionarMetodoPagoPuntoVenta = (id, metodo_pago_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('metodo_pago_id', metodo_pago_id);
        params.append('tipo_accion', 'add');
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'relacionar_metodo_pago', params, options)
    }
};

export const quitarMetodoPagoPuntoVenta = (id, metodo_pago_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('metodo_pago_id', metodo_pago_id);
        params.append('tipo_accion', 'rem');
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'relacionar_metodo_pago', params, options)
    }
};

export const efectuarVentaTiendaEnPuntoVenta = (id, qr_codigo, tercero_id, tipo_venta, pedido, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('pedido', JSON.stringify(pedido));
        params.append('qr_codigo', qr_codigo);
        params.append('tercero_id', tercero_id);
        params.append('tipo_venta', tipo_venta);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'efectuar_venta_producto', params, options)
    }
};

export const hacerCierrePuntoVenta = (id, cierre, options_action = {}) => {
    console.log(cierre)
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('hola', 'chao');
        params.append('cierre', JSON.stringify(cierre));
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'hacer_cierre', params, options)
    }
};

export const hacerEntregaEfectivoCajaPuntoVenta = (id, cierre, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('cierre', JSON.stringify(cierre));
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'hacer_entrega_efectivo_caja', params, options)
    }
};


export const fetchPuntosVentas_por_usuario_username = (username, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGetURLParameters(`${current_url_api}/listar_por_usuario_username/?username=${username}`, options);
    }
};

export const fetchPuntosVentas_por_colaborador = (colaborador_id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGetURLParameters(`${current_url_api}/listar_por_colaborador/?colaborador_id=${colaborador_id}`, options);
    }
};

export const createPuntoVenta = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: {...response, ...options_action}})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deletePuntoVenta = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchPuntosVentas = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGet(current_url_api, options);
    }
};

export const fetchPuntoVenta = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: {...response, ...options_action}})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearPuntosVentas = (options_action = {}) => {
    return (dispatch) => {
        dispatch({type: TYPES.clear, payload: options_action});

    }
};
export const updatePuntoVenta = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};