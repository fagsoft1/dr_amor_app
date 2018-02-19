import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {tengoPermiso} from "../../../../00_utilities/common";
import {
    PERMISO_LIST_PERMISSION as can_list_permiso,
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
        this.props.cargando();
        const cargarPermisos = () => this.props.fetchPermisos(() => this.props.noCargando(), this.error_callback);
        this.props.fetchMisPermisos(cargarPermisos, this.error_callback)

    }

    updatePermiso(permiso) {
        this.props.cargando();
        this.props.updatePermiso(
            permiso.id,
            permiso,
            () => {
                this.props.noCargando();
                this.notificar(`Se ha actualizado con éxito el permiso ${permiso.codename}`)
            },
            this.error_callback
        )
    }


    render() {
        const {mis_permisos, permisos} = this.props;
        const can_list = tengoPermiso(mis_permisos, can_list_permiso);
        const can_change_permiso = tengoPermiso(mis_permisos, can_change_permiso_plus);

        return (
            <ValidarPermisos can_see={can_list}
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
        mis_permisos: state.mis_permisos,
        permisos: state.permisos
    }
}

export default connect(mapPropsToState, actions)(PermisosList)