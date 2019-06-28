import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import {
    CONCEPTOS_OPERACIONES_CAJA as permisos_view
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";

import CreateForm from './forms/ConceptoOperacionCajaForm';
import Tabla from './ConceptoOperacionCajaTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(() => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchConceptosOperacionesCajas());
    };
    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([permisos_view], {callback: cargarDatos}));
        return () => {
            dispatch(actions.clearConceptosOperacionesCajas());
        };
    }, []);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const object_list = useSelector(state => state.conceptos_operaciones_caja);
    const permisos_object = permisosAdapter(mis_permisos, permisos_view);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchConceptoOperacionCaja(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteConceptoOperacionCaja(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createConceptoOperacionCaja(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateConceptoOperacionCaja(id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name='Conceptos Operaciones Cajas'
                singular_name='Concepto Operación Caja'
            />
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )

});

export default List;