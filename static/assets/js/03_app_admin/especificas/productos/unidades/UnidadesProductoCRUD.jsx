import React, {memo, useEffect} from 'react';
import CreateForm from './forms/UnidadProductoCRUDForm';
import Tabla from './UnidadProductoCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {UNIDADES_PRODUCTOS} from "../../../../permisos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchUnidadesProductos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearUnidadesProductos());
        };
    }, []);
    const list = useSelector(state => state.productos_unidades);
    const permisos = useTengoPermisos(UNIDADES_PRODUCTOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchUnidadProducto(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteUnidadProducto(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createUnidadProducto(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateUnidadProducto(id, item, options)),
    };
    return (
        <CRUD
            cargarDatos={cargarDatos}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Unidades Productos'
            singular_name='Unidad Producto'
        />
    )
});

export default List;