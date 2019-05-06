import React, {Component} from 'react';
import CreateForm from '../../detalles/components/forms/modalidad_fraccion_tiempo_detalle_form';
import Tabla from '../../detalles/components/modalidades_fracciones_tiempos_detalles_tabla';
import crudHOC from '../../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchModalidadFraccionTiempoDetalle,
            deleteObjectMethod: this.props.deleteModalidadFraccionTiempoDetalle,
            createObjectMethod: this.props.createModalidadFraccionTiempoDetalle,
            updateObjectMethod: this.props.updateModalidadFraccionTiempoDetalle,
        };
        this.plural_name = 'Modalidad Fraccion Tiempo Detalle';
        this.singular_name = 'Modalidades Fracciones Tiempos Detalles';
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