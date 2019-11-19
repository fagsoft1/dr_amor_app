import React, {memo, useEffect} from 'react';
import CreateForm from './forms/BancoContabilidadCRUDForm';
import Tabla from './BancoContabilidadCRUDTable';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';
import * as actions from "../../../../../01_actions";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../../00_utilities/hooks/useTengoPermisos";
import {BANCOS} from "../../../../../permisos";


const CRUD = crudHOC(CreateForm, Tabla);

const BancoContabilidadCRUD = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchBancos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBancos());
        };
    }, []);
    const list = useSelector(state => state.contabilidad_bancos);
    const permisos = useTengoPermisos(BANCOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchBancos(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteBanco(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createBanco(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateBanco(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Banco'
            cargarDatos={cargarDatos}
        />
    )
});

export default BancoContabilidadCRUD;