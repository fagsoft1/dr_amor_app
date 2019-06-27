import React, {memo} from 'react';
import CreateForm from './forms/AcompananteForm';
import Tabla from './AcompananteTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);
const List = memo((props) => {
    const dispatch = useDispatch();
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchAcompanante(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteAcompanante(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createAcompanante(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateAcompanante(id, item, options)),
    };
    const {object_list, permisos_object} = props;
    return (
        <CRUD
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name=''
            singular_name='Acompañante'
        />
    )
});

export default List;