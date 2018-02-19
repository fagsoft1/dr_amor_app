import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {tengoPermiso} from "../../../../00_utilities/common";
import {
    PERMISO_LIST_USER as can_list_permiso,
    PERMISO_DETAIL_USER as can_detail_permiso,
    PERMISO_ADD_USER as can_add_permiso,
    PERMISO_CHANGE_USER as can_change_permiso,
    PERMISO_DELETE_USER as can_delete_permiso,
    PERMISO_DETAIL_USER_MAKE_ACTIVE as can_make_active_permiso,
    PERMISO_DETAIL_USER_MAKE_STAFF as can_make_staff_permiso,
    PERMISO_DETAIL_USER_MAKE_SUPERUSER as can_make_superuser_permiso
} from "../../../../00_utilities/permisos/types";

import CreateForm from '../components/forms/usuario_form';
import {ContainerNuevoButton} from '../../../../00_utilities/components/ui/icon/iconos';

import Tabla from '../components/usuarios_tabla';

class UsuariosList extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            item_seleccionado: null,
            modal_open: false
        });

        this.error_callback = this.error_callback.bind(this);
        this.notificar = this.notificar.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);

        this.cargarDatos = this.cargarDatos.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

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

    componentWillUnmount() {
        this.props.clearUsuarios()
    }

    cargarDatos() {
        this.props.cargando();
        const cargarUsuarios = () => this.props.fetchUsuarios(() => this.props.noCargando(), this.error_callback);
        const cargarMiCuenta = () => this.props.fetchMiCuenta(cargarUsuarios, this.error_callback);
        this.props.fetchMisPermisos(cargarMiCuenta, this.error_callback)
    }

    onSubmit(item) {
        const {username} = item;
        const success_callback = () => {
            this.props.noCargando();
            this.notificar(`Se ha actualizado con éxito el usuario ${username}`);
            this.handleModalClose();
            this.setState({item_seleccionado: null});
        };
        this.props.cargando();
        if (item.id) {
            this.props.updateUsuario(item.id, item, success_callback, this.error_callback);
        } else {
            this.props.createUsuario(item, success_callback, this.error_callback);
        }
    }

    onDelete(usuario) {
        this.setState({item_seleccionado: null});
        const success_callback = () => {
            this.props.noCargando();
            this.notificar(`Se ha eliminado con éxito el usuario ${usuario.username}`)
        };
        this.props.cargando();
        this.props.deleteUsuario(usuario.id, success_callback, this.error_callback)
    }

    render() {
        const {object_list, mi_cuenta, mis_permisos} = this.props;
        const {item_seleccionado, modal_open} = this.state;

        const can_add = tengoPermiso(mis_permisos, can_add_permiso);
        const can_detail = tengoPermiso(mis_permisos, can_detail_permiso);
        const can_change = tengoPermiso(mis_permisos, can_change_permiso);
        const can_delete = tengoPermiso(mis_permisos, can_delete_permiso);
        const can_list = tengoPermiso(mis_permisos, can_list_permiso);
        const can_make_staff = tengoPermiso(mis_permisos, can_make_staff_permiso);
        const can_make_active = tengoPermiso(mis_permisos, can_make_active_permiso);
        const can_make_superuser = tengoPermiso(mis_permisos, can_make_superuser_permiso);

        return (
            <ValidarPermisos can_see={can_list} nombre='listas de usuarios'>
                <CreateForm
                    onCancel={this.onCancel}
                    item_seleccionado={item_seleccionado}
                    onSubmit={this.onSubmit}
                    handleClose={this.handleModalClose}
                    modal_open={modal_open}
                />
                <Titulo>Lista de usuarios</Titulo>
                {can_add && <ContainerNuevoButton
                    onClick={() => {
                        this.setState({item_seleccionado: null});
                        this.handleModalOpen();
                    }}
                />}
                <Tabla
                    data={_.map(object_list, e => e)}
                    mi_cuenta={mi_cuenta}
                    can_delete={can_delete}
                    can_detail={can_detail}
                    can_change={can_change}
                    can_make_superuser={can_make_superuser}
                    can_make_staff={can_make_staff}
                    can_make_active={can_make_active}
                    onDelete={this.onDelete}
                    updateItem={this.onSubmit}
                    onSelectItem={this.onSelectItem}
                    handleOpen={this.handleModalOpen}
                />

                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </ValidarPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        mi_cuenta: state.mi_cuenta,
        object_list: state.usuarios
    }
}

export default connect(mapPropsToState, actions)(UsuariosList)