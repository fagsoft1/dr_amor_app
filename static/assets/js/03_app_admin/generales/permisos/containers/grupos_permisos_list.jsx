import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {tengoPermiso} from "../../../../00_utilities/common";
import CreateForm from '../components/forms/grupo_permiso_form';
import {IconButtonContainerAdd} from '../../../../00_utilities/components/ui/icon/iconos';

import {
    PERMISO_LIST_GROUP as can_list_permiso,
    PERMISO_DETAIL_GROUP as can_detail_permiso,
    PERMISO_ADD_GROUP as can_add_permiso,
    PERMISO_CHANGE_GROUP as can_change_permiso,
    PERMISO_DELETE_GROUP as can_delete_permiso
} from '../../../../00_utilities/permisos/types';

import Tabla from '../components/grupos_permisos_tabla';
import PermisosGrupo from '../components/permisos_select_permisos';

class GruposPermisosList extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            item_seleccionado: null,
            modal_open: false
        });
        /////////////////////////// Generales /////////////////////////////
        this.error_callback = this.error_callback.bind(this);
        this.notificar = this.notificar.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        /////////////////////////////////////////////////////////////////

        this.cargarDatos = this.cargarDatos.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.actualizarPermiso = this.actualizarPermiso.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

/////////////////////////// Generales /////////////////////////////
    handleModalClose() {
        this.setState({modal_open: false})
    }

    handleModalOpen() {
        this.setState({modal_open: true})
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

    onSelectItem(item) {
        this.setState({item_seleccionado: item})
    }

    onCancel() {
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

////////////////////////////////////////////////////////

    componentWillUnmount() {
        this.props.clearGruposPermisos()
    }

    onSubmit(item) {
        const success_callback = (response) => {
            this.props.noCargando();
            this.notificar(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito el grupo de permisos ${response.name}`);
            this.handleModalClose();
            this.setState({item_seleccionado: null});
        };
        this.props.cargando();

        if (item.id) {
            this.props.updateGrupoPermiso(item.id, item, success_callback, this.error_callback)
        } else {
            this.props.createGrupoPermiso(item, success_callback, this.error_callback)
        }
    }

    cargarDatos() {
        this.props.cargando();
        const cargarGruposPermisos = () => this.props.fetchGruposPermisos(() => this.props.noCargando(), this.error_callback);
        const cargarPermisosActivos = () => this.props.fetchPermisosActivos(cargarGruposPermisos, this.error_callback);
        this.props.fetchMisPermisos(cargarPermisosActivos, this.error_callback);
    }

    actualizarPermiso(permiso) {
        const {item_seleccionado} = this.state;
        const success_callback = (response) => {
            this.props.noCargando();
            this.setState({item_seleccionado: response});
            this.notificar(`Se ha actualizado con éxito el grupo de permisos con el permiso ${permiso.codename}`)
        };
        if (item_seleccionado) {
            this.props.cargando();
            this.props.addPermisoGrupo(item_seleccionado.id, permiso.id, success_callback, this.error_callback);
        }

    }

    onDelete(grupoPermiso) {
        this.setState({item_seleccionado: null});
        const success_callback = () => {
            this.props.noCargando();
            this.notificar(`Se ha eliminado con éxito el grupo de permisos ${grupoPermiso.name}`)
        };
        this.props.cargando();
        this.props.deleteGrupoPermiso(grupoPermiso.id, success_callback, this.error_callback)
    }

    render() {
        const {mis_permisos, permisos, grupos_permisos} = this.props;
        const {item_seleccionado, modal_open} = this.state;
        const can_change = tengoPermiso(mis_permisos, can_change_permiso);
        const can_add = tengoPermiso(mis_permisos, can_add_permiso);
        const can_list = tengoPermiso(mis_permisos, can_list_permiso);
        const can_delete = tengoPermiso(mis_permisos, can_delete_permiso);
        const can_see_permisos = tengoPermiso(mis_permisos, [can_change_permiso, can_detail_permiso], "or");

        return (
            <ValidarPermisos can_see={can_list}
                             nombre='listas de grupos de permisos'>
                <CreateForm
                    onCancel={this.onCancel}
                    item_seleccionado={item_seleccionado}
                    onSubmit={this.onSubmit}
                    handleClose={this.handleModalClose}
                    modal_open={modal_open}
                />
                <Titulo>Lista de Grupos de Permisos</Titulo>

                {can_add && <IconButtonContainerAdd
                    onClick={() => {
                        this.setState({item_seleccionado: null});
                        this.handleModalOpen();
                    }}
                />}

                <Tabla
                    grupo_permisos={grupos_permisos}
                    onSelectItem={this.onSelectItem}
                    can_see={can_see_permisos}
                    can_change={can_change}
                    can_delete={can_delete}
                    onUpdate={this.onUpdate}
                    onDelete={this.onDelete}
                    handleOpen={this.handleModalOpen}
                />
                {
                    item_seleccionado &&
                    can_see_permisos &&
                    <Fragment>
                        <h5>{item_seleccionado.name}</h5>
                        <PermisosGrupo
                            can_change={can_change}
                            actualizarPermiso={this.actualizarPermiso}
                            permisos_todos={permisos}
                            permisos_activos={item_seleccionado.permissions}
                        />
                    </Fragment>
                }
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        grupos_permisos: state.grupos_permisos,
        permisos: state.permisos
    }
}

export default connect(mapPropsToState, actions)(GruposPermisosList)