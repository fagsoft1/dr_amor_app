import React, {Component} from 'react';
import CreateForm from './forms/traslado_form';
import Tabla from './traslados_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchTrasladoInventario,
            deleteObjectMethod: this.props.deleteTrasladoInventario,
            createObjectMethod: this.props.createTrasladoInventario,
            updateObjectMethod: this.props.updateTrasladoInventario,
        };
        this.plural_name = 'Traslados Inventarios';
        this.singular_name = 'Traslado Inventario';
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