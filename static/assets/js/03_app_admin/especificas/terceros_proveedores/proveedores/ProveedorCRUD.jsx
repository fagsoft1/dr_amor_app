import React, {useEffect, memo, Fragment} from 'react';
import CreateForm from './forms/ProveedorForm';
import Tabla from './ProveedorTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import * as actions from "../../../../01_actions/01_index";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import {PROVEEDORES as permisos_view} from "../../../../00_utilities/permisos/types";
import {useSelector} from "react-redux/es/hooks/useSelector";
import {permisosAdapter} from "../../../../00_utilities/common";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchProveedores());
    };
    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([permisos_view], {callback: cargarDatos}));
        return () => {
            dispatch(actions.clearProveedores());
        };
    }, []);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const object_list = useSelector(state => state.proveedores);
    const permisos_object = permisosAdapter(mis_permisos, permisos_view);

    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchProveedor(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteProveedor(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createProveedor(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateProveedor(id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name='Proveedores'
                singular_name='Proveedor'
            />
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});


export default List;