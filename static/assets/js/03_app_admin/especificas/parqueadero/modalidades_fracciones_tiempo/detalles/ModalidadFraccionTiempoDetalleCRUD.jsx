import React, {memo} from 'react';
import CreateForm from './forms/ModalidadFraccionTiempoDetalleForm';
import Tabla from './ModalidadFraccionTiempoDetalleTabla';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchModalidadFraccionTiempoDetalle(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteModalidadFraccionTiempoDetalle(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createModalidadFraccionTiempoDetalle(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateModalidadFraccionTiempoDetalle(id, item, options)),
    };
    const {object_list, permisos_object, modalidad_fraccion_tiempo} = props;
    return (
        <CRUD
            modalidad_fraccion_tiempo={modalidad_fraccion_tiempo}
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name=''
            singular_name='Modalidades Fracciones Tiempos Detalles'
        />
    )
});

export default List;