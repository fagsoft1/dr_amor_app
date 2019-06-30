import React, {memo, useEffect} from 'react';
import CreateForm from './forms/ImpuestoForm';
import Tabla from './ImpuestoTabla';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../../00_utilities/hooks/useTengoPermisos";
import {IMPUESTOS} from "../../../../../00_utilities/permisos/types";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchCuentasContablesDetalles());
        dispatch(actions.fetchImpuestos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCuentasContables());
            dispatch(actions.clearImpuestos());
        };
    }, []);
    const list = useSelector(state => state.contabilidad_impuestos);
    const cuentas_contables = useSelector(state => state.contabilidad_cuentas_contables);
    const permisos = useTengoPermisos(IMPUESTOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchImpuesto(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteImpuesto(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createImpuesto(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateImpuesto(id, item, options)),
    };
    return (
        <CRUD
            cuentas_contables={cuentas_contables}
            method_pool={method_pool}
            list={list}
            posSummitMethod={() => cargarDatos()}
            permisos_object={permisos}
            plural_name=''
            singular_name='Impuesto'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;