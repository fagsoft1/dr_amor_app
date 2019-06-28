import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import {
    BILLETES_MONEDAS as permisos_view
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";

import CreateForm from './forms/BilleteMonedaForm';
import Tabla from './BilleteMonedaTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchBilletesMonedas());
    };
    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([permisos_view], {callback: cargarDatos}));
        return () => {
            dispatch(actions.clearBilletesMonedas());
        };
    }, []);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const object_list = useSelector(state => state.billetes_monedas);
    const permisos_object = permisosAdapter(mis_permisos, permisos_view);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchBilleteMoneda(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteBilleteMoneda(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createBilleteMoneda(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateBilleteMoneda(id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name='Billetes y Monedas'
                singular_name='Billete Moneda'
            />
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )

});

export default List;