import React, {memo, useEffect} from 'react';
import CreateForm from './forms/CategoriaModeloCRUDForm';
import Tabla from './CategoriaAcompananteCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {CATEGORIAS_ACOMPANANTES} from "../../../../permisos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCategoriaAcompanante(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCategoriaAcompanante(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCategoriaAcompanante(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCategoriaAcompanante(id, item, options)),
    };
    const list = useSelector(state => state.categorias_acompanantes);
    const permisos = useTengoPermisos(CATEGORIAS_ACOMPANANTES);
    const cargarDatos = () => {
        dispatch(actions.fetchCategoriasAcompanantes());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCategoriasAcompanantes());
        };
    }, []);
    return (
        <CRUD
            cargarDatos={cargarDatos}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Categorias'
        />
    )
});

export default List;