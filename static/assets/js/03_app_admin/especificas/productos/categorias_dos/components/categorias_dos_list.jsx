import React, {Component} from 'react';
import CreateForm from './forms/categoria_dos_form';
import Tabla from './categorias_dos_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchCategoriaProductoDos,
            deleteObjectMethod: this.props.deleteCategoriaProductoDos,
            createObjectMethod: this.props.createCategoriaProductoDos,
            updateObjectMethod: this.props.updateCategoriaProductoDos,
        };
        this.plural_name = 'Categorias Dos Productos';
        this.singular_name = 'Categoria Dos Producto';
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