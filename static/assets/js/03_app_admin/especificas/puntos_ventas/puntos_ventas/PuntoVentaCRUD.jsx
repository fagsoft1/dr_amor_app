import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {PUNTOS_VENTAS} from "../../../../permisos";
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import CreateForm from './forms/PuntoVentaCRUDForm';
import Tabla from './PuntoVentaCRUDTabla';
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchPuntosVentas());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearPuntosVentas());
        };
    }, []);
    const object_list = useSelector(state => state.puntos_ventas);
    const permisos_object = useTengoPermisos(PUNTOS_VENTAS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchPuntoVenta(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deletePuntoVenta(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createPuntoVenta(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updatePuntoVenta(id, item, options)),
    };
    return (
        <CRUD
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Puntos de Ventas'
            singular_name='Punto Venta'
            cargarDatos={cargarDatos}
        />
    )

});

export default List;