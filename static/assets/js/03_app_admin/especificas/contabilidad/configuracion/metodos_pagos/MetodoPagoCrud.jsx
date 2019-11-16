import React, {memo, useEffect} from 'react';
import CreateForm from './forms/MetodoPagoForm';
import Tabla from './MetodoPagoCrudTabla';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';
import * as actions from "../../../../../01_actions";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../../00_utilities/hooks/useTengoPermisos";
import {METODOS_PAGOS} from "../../../../../permisos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchMetodosPagos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearMetodosPagos());
        };
    }, []);
    const list = useSelector(state => state.contabilidad_metodos_pagos);
    const permisos = useTengoPermisos(METODOS_PAGOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchMetodoPago(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteMetodoPago(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createMetodoPago(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateMetodoPago(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Método Pago'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;