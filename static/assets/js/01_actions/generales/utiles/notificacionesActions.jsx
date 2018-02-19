import {NOTIFICATION_TYPE_SUCCESS, NOTIFICATION_TYPE_ERROR} from 'react-redux-notify';
import {createNotification} from 'react-redux-notify';
import React from 'react';
import _ from 'lodash'

export function notificarAction(mensaje, tipo = 'success', tiempo = 5000) {
    return function (dispatch) {
        let tipo_notificacion = NOTIFICATION_TYPE_SUCCESS;
        switch (tipo) {
            case 'success':
                tipo_notificacion = NOTIFICATION_TYPE_SUCCESS;
                break;
            case 'error':
                tipo_notificacion = NOTIFICATION_TYPE_ERROR;
                break;
        }
        const mySuccessNotification = {
            message: mensaje,
            type: tipo_notificacion,
            duration: tiempo,
            position: 'BottomRight',
            canDimiss: true,
            icon: <i className="fa fa-check"/>
        };
        dispatch(createNotification(mySuccessNotification));
    }
}

export function notificarErrorAjaxAction(error, tiempo = 7000) {
    return function (dispatch) {
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
        mensaje += ` ${mensaje_final}.`

        const mySuccessNotification = {
            message: mensaje,
            type: NOTIFICATION_TYPE_ERROR,
            duration: tiempo,
            position: 'BottomRight',
            canDimiss: true,
            icon: <i className="fa fa-exclamation"/>
        };
        dispatch(createNotification(mySuccessNotification));
    }
}