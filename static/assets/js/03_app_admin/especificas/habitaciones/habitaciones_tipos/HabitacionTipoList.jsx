import React, {memo} from 'react';
import CreateForm from './forms/HabitacionTipoForm';
import Tabla from './HabitacionTipoTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchTipoHabitacion(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteTipoHabitacion(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createTipoHabitacion(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateTipoHabitacion(id, item, options)),
    };
    const {object_list, permisos_object} = props;
    return (
        <CRUD
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Habitaciones Tipos'
            singular_name='Habitacion Tipo'
        />
    )
});

export default List;