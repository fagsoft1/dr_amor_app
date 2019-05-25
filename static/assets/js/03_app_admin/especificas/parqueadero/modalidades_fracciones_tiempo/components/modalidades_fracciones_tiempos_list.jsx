import React, {Component} from 'react';
import CreateForm from './forms/modalidad_fraccion_tiempo_form';
import Tabla from './modalidades_fracciones_tiempos_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchModalidadFraccionTiempo,
            deleteObjectMethod: this.props.deleteModalidadFraccionTiempo,
            createObjectMethod: this.props.createModalidadFraccionTiempo,
            updateObjectMethod: this.props.updateModalidadFraccionTiempo,
        };
        this.plural_name = 'Modalidad Fraccion Tiempo';
        this.singular_name = 'Modalidad Fraccion Tiempo';
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