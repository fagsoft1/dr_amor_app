import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import {
    MOVIMIENTOS_INVENTARIOS as permisos_view
} from "../../../../permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import crudHOC from '../../../../00_utilities/components/HOCCrud';

import CreateForm from './forms/MovimientoInventarioCRUDForm';
import Tabla from './MovimientoInventarioCRUDTabla';

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchMovimientosInventarios());
    };
    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([permisos_view], {callback: cargarDatos}));
        return () => {
            dispatch(actions.clearMovimientosInventarios());
        };
    }, []);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const object_list = useSelector(state => _.orderBy(state.movimientos_inventarios, ['fecha'], ['asc']));
    const permisos_object = permisosAdapter(mis_permisos, permisos_view);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchMovimientoInventario(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteMovimientoInventario(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createMovimientoInventario(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateMovimientoInventario(id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                posCreateMethod={(res) => props.history.push(`/app/admin/inventarios/movimientos_inventarios/detail/${res.id}`)}
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name='Movimientos Inventarios'
                singular_name='Movimiento Inventario'
            />
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )

});

export default List;