import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CargarDatos from "../../../00_utilities/components/system/CargarDatos";
import {
    USUARIOS as permisos_view_groups
} from "../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../00_utilities/common";
import CreateForm from './forms/UsuarioForm';
import Tabla from './UsuarioTabla';
import crudHOC from '../../../00_utilities/components/HOCCrud';

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(props => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const object_list = useSelector(state => state.usuarios);
    const permisos_object = permisosAdapter(mis_permisos, permisos_view_groups);


    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchUsuario(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteUsuario(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createUsuario(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateUsuario(id, item, options)),
    };

    const cargarDatos = () => {
        dispatch(actions.fetchUsuarios());
    };

    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([permisos_view_groups], {callback: () => cargarDatos()}))
        return () => {
            dispatch(actions.clearUsuarios());
        };
    }, []);

    return (
        <Fragment>
            <CRUD
                auth={auth}
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name='Usuarios'
                singular_name='Usuario'
            />
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});

export default List;