import React, {memo} from 'react';
import CreateForm from './forms/HabitacionForm';
import Tabla from './HabitacionTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchHabitacion(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteHabitacion(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createHabitacion(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateHabitacion(id, item, options)),
    };
    const {object_list, permisos_object} = props;
    return (
        <CRUD
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Habitaciones'
            singular_name='Habitacion'
        />
    )
});

export default List;
