import React, {memo} from 'react';
import CreateForm from './forms/ImpuestoForm';
import Tabla from './ImpuestoTabla';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);
const List = memo((props) => {
    const dispatch = useDispatch();
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchImpuesto(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteImpuesto(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createImpuesto(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateImpuesto(id, item, options)),
    };
    const {object_list, permisos_object, cuentas_contables} = props;
    return (
        <CRUD
            cuentas_contables={cuentas_contables}
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name=''
            singular_name='Impuesto'
        />
    )
});

export default List;