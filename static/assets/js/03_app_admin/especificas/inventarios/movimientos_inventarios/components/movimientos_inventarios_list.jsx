import React, {Component} from 'react';
import CreateForm from './forms/movimiento_inventario_form';
import Tabla from './movimientos_inventarios_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud_dos';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchMovimientoInventario,
            deleteObjectMethod: this.props.deleteMovimientoInventario,
            createObjectMethod: this.props.createMovimientoInventario,
            updateObjectMethod: this.props.updateMovimientoInventario,
        };
        this.plural_name = 'Movimientos Inventarios';
        this.singular_name = 'Movimiento Inventario';
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