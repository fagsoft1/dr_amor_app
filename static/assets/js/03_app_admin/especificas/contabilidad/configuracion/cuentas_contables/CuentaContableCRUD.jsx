import React, {memo} from 'react';
import CreateForm from './forms/CuentaContableForm';
import Tabla from './CuentaContableTabla';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCuentaContable(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCuentaContable(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCuentaContable(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCuentaContable(id, item, options)),
    };
    const {object_list, permisos_object, cuentas_contables} = props;
    return (
        <CRUD
            cuentas_contables={cuentas_contables}
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name=''
            singular_name='Cuenta Contable'
        />
    )
});

export default List;