import React, {memo} from 'react';
import CreateForm from './forms/CategoriaFraccionTiempoForm';
import Tabla from './CategoriaFraccionTiempoTabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCategoriaFraccionTiempoAcompanante(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCategoriaFraccionTiempoAcompanante(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCategoriaFraccionTiempoAcompanante(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCategoriaFraccionTiempoAcompanante(id, item, options)),
    };
    const {object_list, permisos_object, object, categorias_fracciones_tiempo_list} = props;
    return (
        <CRUD
            categorias_fracciones_tiempo_list={categorias_fracciones_tiempo_list}
            object={object}
            method_pool={method_pool}
            list={object_list}
            permisos_object={permisos_object}
            plural_name='Fracciones Tiempo'
            singular_name='Fracción Tiempo'
        />
    )
});

export default List;