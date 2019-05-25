import React, {Component} from 'react';
import CreateForm from './forms/productos_form';
import Tabla from './productos_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchProducto,
            deleteObjectMethod: this.props.deleteProducto,
            createObjectMethod: this.props.createProducto,
            updateObjectMethod: this.props.updateProducto,
        };
        this.plural_name = 'Productos';
        this.singular_name = 'Producto';
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