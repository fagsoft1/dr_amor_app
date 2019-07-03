import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {USUARIOS} from "../../../00_utilities/permisos/types";
import CreateForm from './forms/UsuarioForm';
import Tabla from './UsuarioTabla';
import crudHOC from '../../../00_utilities/components/HOCCrud';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(props => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const object_list = useSelector(state => state.usuarios);

    const permisos_object = useTengoPermisos(USUARIOS);


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
        cargarDatos();
        return () => {
            dispatch(actions.clearUsuarios());
        };
    }, []);

    return (
        <CRUD
            auth={auth}
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Usuarios'
            singular_name='Usuario'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;