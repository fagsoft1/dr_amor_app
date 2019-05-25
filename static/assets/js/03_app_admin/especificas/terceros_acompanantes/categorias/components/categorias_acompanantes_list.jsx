import React, {Component} from 'react';
import CreateForm from './forms/categoria_acompanante_form';
import Tabla from './categorias_acompanantes_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchCategoriaAcompanante,
            deleteObjectMethod: this.props.deleteCategoriaAcompanante,
            createObjectMethod: this.props.createCategoriaAcompanante,
            updateObjectMethod: this.props.updateCategoriaAcompanante,
        };
        this.plural_name = 'Categorias';
        this.singular_name = 'Categorias';
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