import React, {Component} from 'react';
import CreateForm from './forms/punto_venta_form';
import Tabla from './puntos_ventas_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud_dos';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchPuntoVenta,
            deleteObjectMethod: this.props.deletePuntoVenta,
            createObjectMethod: this.props.createPuntoVenta,
            updateObjectMethod: this.props.updatePuntoVenta,
        };
        this.plural_name = 'Puntos Ventas';
        this.singular_name = 'Punto Venta';
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