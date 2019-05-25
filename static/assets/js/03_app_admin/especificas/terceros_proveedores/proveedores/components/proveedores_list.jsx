import React, {Component} from 'react';
import CreateForm from './forms/proveedores_form';
import Tabla from './proveedores_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchProveedor,
            deleteObjectMethod: this.props.deleteProveedor,
            createObjectMethod: this.props.createProveedor,
            updateObjectMethod: this.props.updateProveedor,
        };
        this.plural_name = 'Proveedores';
        this.singular_name = 'Proveedor';
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