import React, {memo, useEffect} from 'react';
import CreateForm from './forms/CuentaContableForm';
import Tabla from './CuentaContableTabla';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../../00_utilities/hooks/useTengoPermisos";
import {CUENTAS_CONTABLES} from "../../../../../permisos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchCuentasContables());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCuentasContables());
        };
    }, []);
    const list = useSelector(state => state.contabilidad_cuentas_contables);
    const permisos = useTengoPermisos(CUENTAS_CONTABLES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCuentaContable(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCuentaContable(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCuentaContable(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCuentaContable(id, item, options)),
    };
    return (
        <CRUD
            cuentas_contables={list}
            method_pool={method_pool}
            list={list}
            posSummitMethod={() => cargarDatos()}
            permisos_object={permisos}
            plural_name=''
            singular_name='Cuenta Contable'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;