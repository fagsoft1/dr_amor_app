import React, {useEffect, memo} from 'react';
import CreateForm from './forms/ProveedorForm';
import Tabla from './ProveedorTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import * as actions from "../../../../01_actions/01_index";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import {PROVEEDORES} from "../../../../00_utilities/permisos/types";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchProveedores());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearProveedores());
        };
    }, []);
    const permisos_object = useTengoPermisos(PROVEEDORES);
    const object_list = useSelector(state => state.proveedores);

    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchProveedor(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteProveedor(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createProveedor(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateProveedor(id, item, options)),
    };
    return (
        <CRUD
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Proveedores'
            singular_name='Proveedor'
            cargarDatos={cargarDatos}
        />
    )
});


export default List;