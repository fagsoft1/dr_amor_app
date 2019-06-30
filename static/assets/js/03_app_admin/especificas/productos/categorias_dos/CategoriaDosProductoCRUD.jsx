import React, {memo, useEffect} from 'react';
import CreateForm from './forms/CategoriaDosProductoForm';
import Tabla from './CategoriaDosProductoTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {CATEGORIAS_PRODUCTOS_DOS} from "../../../../00_utilities/permisos/types";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchCategoriasProductosDos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCategoriasProductosDos());
        };
    }, []);
    const list = useSelector(state => state.productos_categorias_dos);
    const permisos = useTengoPermisos(CATEGORIAS_PRODUCTOS_DOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCategoriaProductoDos(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCategoriaProductoDos(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCategoriaProductoDos(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCategoriaProductoDos(id, item, options)),
    };
    return (
        <CRUD
            cargarDatos={cargarDatos}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Categorias Dos Productos'
            singular_name='Categoria Dos Producto'
        />
    )
});

export default List;