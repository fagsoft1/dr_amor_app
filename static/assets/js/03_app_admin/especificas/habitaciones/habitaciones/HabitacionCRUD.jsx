import React, {memo, useEffect} from 'react';
import CreateForm from './forms/HabitacionCRUDForm';
import Tabla from './HabitacionCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {HABITACIONES} from "../../../../permisos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchHabitaciones());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearHabitaciones());
        };
    }, []);
    const list = useSelector(state => state.habitaciones);
    const permisos = useTengoPermisos(HABITACIONES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchHabitacion(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteHabitacion(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createHabitacion(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateHabitacion(id, item, options)),
    };
    return (
        <CRUD
            cargarDatos={cargarDatos}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Habitacion'
        />
    )
});

export default List;
