import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {EMPRESAS} from "../../../../00_utilities/permisos/types";
import useTengoPermisos from '../../../../00_utilities/hooks/useTengoPermisos';
import CreateForm from './forms/EmpresaForm';
import Tabla from './EmpresaTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchEmpresas());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearEmpresas());
        };
    }, []);
    const object_list = useSelector(state => state.empresas);
    const permisos_object = useTengoPermisos(EMPRESAS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchEmpresa(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteEmpresa(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createEmpresa(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateEmpresa(id, item, options)),
    };
    return (
        <CRUD
            cargarDatos={cargarDatos}
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Empresas'
            singular_name='Empresa'
        />
    )

});

export default List;