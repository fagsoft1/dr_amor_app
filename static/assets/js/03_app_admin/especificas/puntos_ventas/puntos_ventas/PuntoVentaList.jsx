import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import {
    PUNTOS_VENTAS as permisos_view
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import CreateForm from './forms/PuntoVentaForm';
import Tabla from './PuntoVentaTabla';

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchPuntosVentas());
    };
    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([permisos_view], {callback: cargarDatos}))
        return () => {
            dispatch(actions.clearPuntosVentas());
        };
    }, []);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const object_list = useSelector(state => state.puntos_ventas);
    const permisos_object = permisosAdapter(mis_permisos, permisos_view);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchPuntoVenta(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deletePuntoVenta(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createPuntoVenta(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updatePuntoVenta(id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name='Puntos de Ventas'
                singular_name='Punto Venta'
            />
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )

});

export default List;