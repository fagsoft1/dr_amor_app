import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {tengoPermiso, permisosAdapter} from "../../../../00_utilities/common";
import {
    PERMISSION as permisos_view,
    PERMISO_CHANGE_PERMISSION_PLUS as can_change_permiso_plus
} from '../../../../00_utilities/permisos/types';


import {Tabla} from '../components/permisos_tabla';

class PermisosList extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.error_callback = this.error_callback.bind(this);
        this.updatePermiso = this.updatePermiso.bind(this);
        this.notificar = this.notificar.bind(this);
    }

    error_callback(error) {
        this.props.notificarErrorAjaxAction(error);
    }

    notificar(mensaje) {
        this.props.notificarAction(mensaje);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearPermisos()
    }

    cargarDatos() {

        this.props.fetchPermisos(null, this.error_callback);

    }

    updatePermiso(permiso) {

        this.props.updatePermiso(
            permiso.id,
            permiso,
            () => {
                null
                this.notificar(`Se ha actualizado con éxito el permiso ${permiso.codename}`)
            },
            this.error_callback
        )
    }


    render() {
        const {permisos, auth: {mis_permisos}} = this.props;
        const can_change_permiso = tengoPermiso(can_change_permiso_plus);
        const permisos_this_view = permisosAdapter( permisos_view);

        console.log(permisos_this_view)

        return (
            <ValidarPermisos can_see={permisos_this_view.list}
                             nombre='listas de permisos'>
                <Titulo>Lista de Permisos</Titulo>
                <Tabla
                    permisos={permisos}
                    updatePermiso={this.updatePermiso}
                    can_change={can_change_permiso}/>
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
        permisos: state.permisos
    }
}

export default connect(mapPropsToState, actions)(PermisosList)