import React, {Component} from 'react';
import CreateForm from './forms/tipos_vehiculos_form';
import Tabla from './tipos_vehiculos_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchTipoVehiculo,
            deleteObjectMethod: this.props.deleteTipoVehiculo,
            createObjectMethod: this.props.createTipoVehiculo,
            updateObjectMethod: this.props.updateTipoVehiculo,
        };
        this.plural_name = 'Tipo Vehiculo';
        this.singular_name = 'Tipos Vehículos';
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