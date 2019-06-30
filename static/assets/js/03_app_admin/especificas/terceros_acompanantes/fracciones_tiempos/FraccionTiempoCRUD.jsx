import React, {memo, useEffect} from 'react';
import CreateForm from './forms/FraccionTiempoForm';
import Tabla from './FraccionTiempoTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {FRACCIONES_TIEMPOS_ACOMPANANTES} from "../../../../00_utilities/permisos/types";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchFraccionesTiemposAcompanantes());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.fetchFraccionesTiemposAcompanantes());
        };
    }, []);
    const list = useSelector(state => state.acompanantes);
    const permisos = useTengoPermisos(FRACCIONES_TIEMPOS_ACOMPANANTES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchFraccionTiempoAcompanante(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteFraccionTiempoAcompanante(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createFraccionTiempoAcompanante(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateFraccionTiempoAcompanante(id, item, options)),
    };
    return (
        <CRUD
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Fracción Tiempo'
        />
    )
});

export default List;