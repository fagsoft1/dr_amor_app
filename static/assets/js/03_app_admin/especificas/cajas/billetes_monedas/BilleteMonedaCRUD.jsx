import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions";
import {BILLETES_MONEDAS} from "../../../../permisos";

import CreateForm from './forms/BilleteMonedaForm';
import Tabla from './BilleteMonedaTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const permisos_object = useTengoPermisos(BILLETES_MONEDAS);
    const cargarDatos = () => {
        dispatch(actions.fetchBilletesMonedas());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBilletesMonedas());
        };
    }, []);
    const object_list = useSelector(state => state.billetes_monedas);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchBilleteMoneda(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteBilleteMoneda(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createBilleteMoneda(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateBilleteMoneda(id, item, options)),
    };
    return (
        <CRUD
            cargarDatos={cargarDatos}
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Billetes y Monedas'
            singular_name='Billete Moneda'
        />
    )

});

export default List;