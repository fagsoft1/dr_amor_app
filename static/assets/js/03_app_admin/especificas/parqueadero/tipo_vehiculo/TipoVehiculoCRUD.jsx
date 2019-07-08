import React, {memo} from 'react';
import CreateForm from './forms/TipoVehiculoForm';
import Tabla from './TipoVehiculoTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchTipoVehiculo(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteTipoVehiculo(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createTipoVehiculo(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateTipoVehiculo(id, item, options)),
    };
    const {object_list, permisos_object} = props;
    return (
        <CRUD
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Tipos Vehiculos'
            singular_name='Tipo Vehículo'
        />
    )
});

export default List;