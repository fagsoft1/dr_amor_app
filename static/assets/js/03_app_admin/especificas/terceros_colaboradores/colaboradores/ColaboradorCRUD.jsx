import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import {COLABORADORES as permisos_view} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";

import CreateForm from './forms/ColaboradorForm';
import Tabla from './ColaboradorTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(props => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        return dispatch(actions.fetchColaboradores());
    };
    const uploadFotoPerfil = (id_colaborador, file) => {
        let formData = new FormData();
        formData.append('archivo', file);
        return dispatch(actions.uploadColaboradorFoto(id_colaborador, formData, {callback: () => dispatch(actions.fetchColaborador(id_colaborador))}));
    };
    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([permisos_view], {callback: cargarDatos}));
        return () => {
            dispatch(actions.clearColaboradores());
        };
    }, []);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const object_list = useSelector(state => state.colaboradores);
    const permisos_object = permisosAdapter(mis_permisos, permisos_view);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchColaborador(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteColaborador(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createColaborador(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateColaborador(id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name='Colaboradores'
                singular_name='Colaborador'
                uploadFotoPerfil={uploadFotoPerfil}
            />
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});

export default List