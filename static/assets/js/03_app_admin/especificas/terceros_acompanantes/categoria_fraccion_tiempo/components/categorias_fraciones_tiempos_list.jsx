import React, {Component} from 'react';
import CreateForm from './forms/categoria_fraccion_tiempo_form';
import Tabla from './categorias_fracciones_tiempos_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchCategoriaFraccionTiempoAcompanante,
            deleteObjectMethod: this.props.deleteCategoriaFraccionTiempoAcompanante,
            createObjectMethod: this.props.createCategoriaFraccionTiempoAcompanante,
            updateObjectMethod: this.props.updateCategoriaFraccionTiempoAcompanante,
        };
        this.plural_name = 'Fracciones Tiempo';
        this.singular_name = 'Fracción Tiempo';
    }

    render() {
        const {object_list, permisos_object} = this.props;
        return (
            <CRUD
                {...this.props}
                method_pool={this.method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name={this.plural_name}
                singular_name={this.singular_name}
            />
        )
    }
}

export default List;