import React, {Component} from 'react';
import CreateForm from './forms/BodegaForm';
import Tabla from './BodegaTabla';
import crudHOC from '../../../../../00_utilities/components/HOCCrud';


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