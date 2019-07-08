import React, {memo, useEffect} from 'react';
import CreateForm from './forms/DiarioContableForm';
import Tabla from './DiarioContableTabla';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';
import * as actions from "../../../../../01_actions";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../../00_utilities/hooks/useTengoPermisos";
import {DIARIOS_CONTABLES} from "../../../../../permisos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchDiariosContables());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearDiariosContables());
        };
    }, []);
    const list = useSelector(state => state.contabilidad_diarios_contables);
    const permisos = useTengoPermisos(DIARIOS_CONTABLES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchDiarioContable(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteDiarioContable(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createDiarioContable(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateDiarioContable(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Diario'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;