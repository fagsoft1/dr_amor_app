import React, {Component} from 'react';
import CreateForm from './forms/fraccion_tiempo_form';
import Tabla from './fracciones_tiempos_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud_dos';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchFraccionTiempoAcompanante,
            deleteObjectMethod: this.props.deleteFraccionTiempoAcompanante,
            createObjectMethod: this.props.createFraccionTiempoAcompanante,
            updateObjectMethod: this.props.updateFraccionTiempoAcompanante,
        };
        this.plural_name = 'Fracciones Tiempo';
        this.singular_name = 'Fracción Tiempo';
    }

    render() {
        const {object_list, permisos_object} = this.props;
        return (
            <CRUD
                method_pool={this.method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name={this.plural_name}
                singular_name={this.singular_name}
                {...this.props}
            />
        )
    }
}

export default List;