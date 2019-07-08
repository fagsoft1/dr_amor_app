import React, {memo, useEffect} from 'react';
import CreateForm from './forms/ProductoCRUDForm';
import Tabla from './ProductoCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {PRODUCTOS} from "../../../../permisos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchProductos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearProductos());
        };
    }, []);
    const list = useSelector(state => state.productos);
    const permisos = useTengoPermisos(PRODUCTOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchProducto(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteProducto(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createProducto(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateProducto(id, item, options)),
    };
    return (
        <CRUD
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Productos'
            singular_name='Producto'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;