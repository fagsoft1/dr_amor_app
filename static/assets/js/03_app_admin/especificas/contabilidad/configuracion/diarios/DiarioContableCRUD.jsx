import React, {Component, memo} from 'react';
import CreateForm from './forms/DiarioContableForm';
import Tabla from './DiarioContableTabla';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchDiarioContable(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteDiarioContable(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createDiarioContable(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateDiarioContable(id, item, options)),
    };
    const {object_list, permisos_object} = props;
    return (
        <CRUD
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name=''
            singular_name='Diario'
        />
    )
});

export default List;