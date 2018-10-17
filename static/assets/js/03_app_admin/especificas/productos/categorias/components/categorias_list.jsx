import React, {Component} from 'react';
import CreateForm from './forms/categorias_form';
import Tabla from './categorias_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchCategoriaProducto,
            deleteObjectMethod: this.props.deleteCategoriaProducto,
            createObjectMethod: this.props.createCategoriaProducto,
            updateObjectMethod: this.props.updateCategoriaProducto,
        };
        this.plural_name = 'Categorias Productos';
        this.singular_name = 'Categoria Producto';
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