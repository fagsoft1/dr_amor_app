import {formatMoney} from 'accounting';
import moment from 'moment-timezone';
import momentLocaliser from "react-widgets-moment";
import React from "react";

moment.tz.setDefault("America/Bogota");
moment.locale('es');
momentLocaliser(moment);

export const REGEX_SOLO_NUMEROS_DINERO = /^-{0,1}\d*\.{0,1}\d+$/;
export const REGEX_SOLO_NUMEROS = /^-{0,1}\d+$/;
export const REGEX_CORREO_ELECTRONICO = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const pesosColombianos = (plata) => formatMoney(Number(plata), "$", 0, ".", ",");
export const numerosFormato = (numero) => formatMoney(Number(numero), "", 0, ".", ",");
export const fechaFormatoUno = (fecha) => moment.tz(fecha, "America/Bogota").format('MMMM D [de] YYYY');
export const horaFormatoUno = (date) => moment.tz(date, "America/Bogota").format('hh:mm a');
export const fechaHoraFormatoUno = (date) => moment.tz(date, "America/Bogota").format('D/MM/YYYY hh:mm a');

export const diferenciaTiempo = (initial_time, actual_time) => {
    let seconds = Math.abs(Math.floor((moment.tz(actual_time, "America/Bogota").toDate() - (initial_time)) / 1000));

    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    minutes = minutes < 9 ? `0${minutes}` : minutes;
    hours = hours < 9 ? `0${hours}` : hours;
    seconds = seconds < 9 ? `0${seconds}` : seconds;

    return `${hours}:${minutes}:${seconds}`
};

export const upper = value => value && value.toUpperCase();
export const lower = value => value && value.toLowerCase();

export const tengoPermiso = (mis_permisos, permisos, tipo = 'and') => {
    let permisos_a_validar_array = permisos;
    if (!Array.isArray(permisos)) {
        permisos_a_validar_array = [permisos]
    }
    const mis_permisos_array = _.map(mis_permisos, permiso => {
        return permiso
    });
    const validaciones_array = permisos_a_validar_array.map(permiso => {
        return mis_permisos_array.includes(permiso)
    });
    if (tipo === "and") {
        return !validaciones_array.includes(false);
    } else if (tipo === "or") {
        return validaciones_array.includes(true);
    }
};


export const permisosAdapter = (mis_permisos, permisos_view) => {
    return _.mapValues(permisos_view, p => tengoPermiso(mis_permisos, p));
};