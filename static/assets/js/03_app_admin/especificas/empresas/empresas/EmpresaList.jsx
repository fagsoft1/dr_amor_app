import React, {memo, Fragment, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import {
    EMPRESAS as permisos_view
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";
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
        dispatch(actions.fetchMisPermisosxListado([permisos_view], {callback: cargarDatos}));
        return () => {
            dispatch(actions.clearEmpresas());
        };
    }, []);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const object_list = useSelector(state => state.empresas);
    const permisos_object = permisosAdapter(mis_permisos, permisos_view);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchEmpresa(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteEmpresa(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createEmpresa(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateEmpresa(id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name='Empresas'
                singular_name='Empresa'
            />
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )

});

export default List;