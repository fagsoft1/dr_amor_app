import React, {Component} from 'react';
import CreateForm from './forms/habitacion_tipo_form';
import Tabla from './habitaciones_tipos_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchTipoHabitacion,
            deleteObjectMethod: this.props.deleteTipoHabitacion,
            createObjectMethod: this.props.createTipoHabitacion,
            updateObjectMethod: this.props.updateTipoHabitacion,
        };
        this.plural_name = 'Habitaciones Tipos';
        this.singular_name = 'Habitacion Tipo';
    }

    render() {
        const {object_list, permisos_object} = this.props;
        return (
            <CRUD
                {...this.props}
                posCreateMethod={(res) => console.log(res)}
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