import React, {memo, useEffect} from 'react';
import CreateForm from './forms/TipoComprobanteContableCRUDForm';
import Tabla from './TipoComprobanteContableCRUDTable';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';
import * as actions from "../../../../../01_actions";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../../00_utilities/hooks/useTengoPermisos";
import {TIPOS_COMPROBANTES_CONTABLES} from "../../../../../permisos";


const CRUD = crudHOC(CreateForm, Tabla);

const TipoComprobanteContableCRUD = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchTiposComprobantesContables());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearTiposComprobantesContables());
        };
    }, []);
    const list = useSelector(state => state.contabilidad_tipos_comprobantes);
    const permisos = useTengoPermisos(TIPOS_COMPROBANTES_CONTABLES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchTipoComprobanteContable(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteTipoComprobanteContable(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createTipoComprobanteContable(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateTipoComprobanteContable(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Tipo Comprobante Contable'
            cargarDatos={cargarDatos}
        />
    )
});

export default TipoComprobanteContableCRUD;