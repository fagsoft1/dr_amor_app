import React, {memo} from 'react';
import CreateForm from './forms/ModalidadFraccionTiempoCRUDForm';
import Tabla from './ModalidadFraccionTiempoCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchModalidadFraccionTiempo(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteModalidadFraccionTiempo(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createModalidadFraccionTiempo(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateModalidadFraccionTiempo(id, item, options)),
    };
    const {object_list, permisos_object} = props;
    return (
        <CRUD
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Modalidad Fraccion Tiempo'
            singular_name='Modalidad Fraccion Tiempo'
        />
    )
});

export default List;