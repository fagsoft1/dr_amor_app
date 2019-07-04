import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {CONCEPTOS_OPERACIONES_CAJA} from "../../../../permisos";
import CreateForm from './forms/ConceptoOperacionCajaForm';
import Tabla from './ConceptoOperacionCajaTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchConceptosOperacionesCajas());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearConceptosOperacionesCajas());
        };
    }, []);
    const object_list = useSelector(state => state.conceptos_operaciones_caja);
    const permisos_object = useTengoPermisos(CONCEPTOS_OPERACIONES_CAJA);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchConceptoOperacionCaja(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteConceptoOperacionCaja(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createConceptoOperacionCaja(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateConceptoOperacionCaja(id, item, options)),
    };
    return (
        <CRUD
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Conceptos Operaciones Cajas'
            singular_name='Concepto Operación Caja'
            cargarDatos={cargarDatos}
        />
    )

});

export default List;