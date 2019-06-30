import React, {Fragment, memo, useEffect} from 'react';
import CreateForm from './forms/BodegaForm';
import Tabla from './BodegaTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {BODEGAS} from "../../../../00_utilities/permisos/types";
import {useSelector} from "react-redux/es/hooks/useSelector";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const permisos_object = useTengoPermisos(BODEGAS);
    const cargarDatos = () => {
        dispatch(actions.fetchBodegas());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBodegas());
        };
    }, []);
    const object_list = useSelector(state => state.bodegas);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchBodega(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteBodega(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createBodega(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateBodega(id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name='Bodegas'
                singular_name='Bodega'
            />
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )

});

export default List;