import React, {memo} from 'react';
import CreateForm from './forms/MovimientoInventarioDetalleCRUDForm';
import Tabla from './MovimientoInventarioDetalleCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions";


const CRUD = crudHOC(CreateForm, Tabla);


const List = memo((props) => {
    const dispatch = useDispatch();
    const {movimiento, permisos_detalle, object_list, productos} = props;
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchMovimientoInventarioDetalle(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteMovimientoInventarioDetalle(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createMovimientoInventarioDetalle(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateMovimientoInventarioDetalle(id, item, options)),
    };

    const posSummitMethod = (item) => {
        dispatch(actions.fetchMovimientoInventario(item.movimiento));
    };

    const posDeleteMethod = (item) => {
        dispatch(actions.fetchMovimientoInventario(item.movimiento));
    };
    return (
        <CRUD
            productos={productos}
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_detalle}
            movimiento={movimiento}
            plural_name='Items'
            singular_name='Item'
            posDeleteMethod={posDeleteMethod}
            posSummitMethod={posSummitMethod}
        />
    )

});
export default List;