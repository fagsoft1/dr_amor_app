import React, {memo, useEffect} from 'react';
import CreateForm from './forms/AcompananteForm';
import Tabla from './AcompananteTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {ACOMPANANTES} from "../../../../00_utilities/permisos/types";


const CRUD = crudHOC(CreateForm, Tabla);
const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchAcompanantes());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearAcompanantes());
        };
    }, []);
    const list = useSelector(state => state.acompanantes);
    const permisos = useTengoPermisos(ACOMPANANTES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchAcompanante(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteAcompanante(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createAcompanante(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateAcompanante(id, item, options)),
    };
    return (
        <CRUD
            cargarDatos={cargarDatos}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Acompañante'
        />
    )
});

export default List;