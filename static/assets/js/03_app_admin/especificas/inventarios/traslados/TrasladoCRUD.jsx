import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {TRASLADOS_INVENTARIOS} from "../../../../permisos";
import CreateForm from './forms/TrasladoCRUDForm';
import Tabla from './TrasladoCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchTrasladosInventarios())
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearTrasladosInventarios());
        };
    }, []);
    const object_list = useSelector(state => state.traslados_inventarios);
    const permisos_object = useTengoPermisos(TRASLADOS_INVENTARIOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchTrasladoInventario(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteTrasladoInventario(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createTrasladoInventario(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateTrasladoInventario(id, item, options)),
    };
    return (
        <CRUD
            cargarDatos={cargarDatos}
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Traslados Inventarios'
            singular_name='Traslado Inventario'
            posCreateMethod={(res) => dispatch(props.history.push(`/app/admin/inventarios/traslados/detail/${res.id}`))}
        />
    )

});

export default List;