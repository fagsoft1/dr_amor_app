import React, {memo, useEffect} from 'react';
import CreateForm from './forms/HabitacionTipoForm';
import Tabla from './HabitacionTipoTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {TIPOS_HABITACIONES} from "../../../../00_utilities/permisos/types";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchTiposHabitaciones());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearTiposHabitaciones());
        };
    }, []);
    const list = useSelector(state => state.habitaciones_tipos);
    const permisos = useTengoPermisos(TIPOS_HABITACIONES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchTipoHabitacion(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteTipoHabitacion(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createTipoHabitacion(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateTipoHabitacion(id, item, options)),
    };
    return (
        <CRUD
            cargarDatos={cargarDatos}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Habitaciones Tipos'
            singular_name='Habitacion Tipo'
        />
    )
});

export default List;