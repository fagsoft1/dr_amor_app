import React, {Component} from 'react';
import CreateForm from './forms/bodega_form';
import Tabla from './bodegas_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud_dos';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchBodega,
            deleteObjectMethod: this.props.deleteBodega,
            createObjectMethod: this.props.createBodega,
            updateObjectMethod: this.props.updateBodega,
        };
        this.plural_name = 'Bodegas';
        this.singular_name = 'Bodega';
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