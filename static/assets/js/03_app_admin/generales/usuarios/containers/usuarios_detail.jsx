import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto, AtributoTexto, AtributoBooleano} from "../../../../00_utilities/templates/fragmentos";
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
    PERMISO_DETAIL_USER_MAKE_SUPERUSER as can_make_superuser_permiso,
    PERMISO_CHANGE_PERMISSION
} from "../../../../00_utilities/permisos/types";

import PermisosUsuario from '../../permisos/components/permisos_select_permisos';

class UsuariosDetail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.error_callback = this.error_callback.bind(this);
        this.notificar = this.notificar.bind(this);
        this.actualizarPermiso = this.actualizarPermiso.bind(this);
        this.actualizarGrupo = this.actualizarGrupo.bind(this);
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
        const {id} = this.props.match.params;
        const {noCargando, cargando} = this.props;
        cargando();
        const cargarGruposPermisos = () => this.props.fetchGruposPermisos(() => noCargando(), this.error_callback);
        const cargarPermisosActivos = () => this.props.fetchPermisosActivos(cargarGruposPermisos, this.error_callback);
        const cargarPermisosUsuario = () => this.props.fetchOtroUsuarioPermisos(id, cargarPermisosActivos, this.error_callback);
        const cargarUsuario = () => this.props.fetchUsuario(id, cargarPermisosUsuario, this.error_callback);
        const cargarMisPermisos = () => this.props.fetchMisPermisos(cargarUsuario, this.error_callback);
        this.props.fetchMiCuenta(cargarMisPermisos, this.error_callback);

    }

    actualizarPermiso(permiso) {
        const {id} = this.props.match.params;
        const {cargando, noCargando} = this.props;
        cargando();
        const CargarPermisosUsuario = () => this.props.fetchOtroUsuarioPermisos(id, () => noCargando(), this.error_callback);
        this.props.addPermisoUsuario(id, permiso.id, CargarPermisosUsuario, this.error_callback)
    }

    actualizarGrupo(grupo) {
        const {id} = this.props.match.params;
        const {cargando, noCargando} = this.props;
        cargando();
        const CargarUsuario = () => this.props.fetchUsuario(id, () => noCargando(), this.error_callback);
        this.props.addGrupoUsuario(id, grupo.id, CargarUsuario, this.error_callback)
    }

    render() {
        const {usuario, mi_cuenta, mis_permisos, permisos_activos, permisos_todos, grupos_todos} = this.props;

        const can_add = tengoPermiso(mis_permisos, can_add_permiso);
        const can_detail = tengoPermiso(mis_permisos, can_detail_permiso);
        const can_change = tengoPermiso(mis_permisos, can_change_permiso);
        const can_delete = tengoPermiso(mis_permisos, can_delete_permiso);
        const can_list = tengoPermiso(mis_permisos, can_list_permiso);
        const can_make_staff = tengoPermiso(mis_permisos, can_make_staff_permiso);
        const can_make_active = tengoPermiso(mis_permisos, can_make_active_permiso);
        const can_make_superuser = tengoPermiso(mis_permisos, can_make_superuser_permiso);
        const puede_cambiar_permisos = tengoPermiso(mis_permisos, [PERMISO_CHANGE_PERMISSION]);


        if (!usuario) {
            return <SinObjeto/>
        }

        const grupos_activos = _.pickBy(grupos_todos, grupo => {
            return usuario.groups.includes(grupo.id)
        });

        let permisos_activos_indpendientes = [];
        _.mapValues(grupos_activos, (e) => {
            e.permissions.map(p => {
                permisos_activos_indpendientes = [...permisos_activos_indpendientes, {...p, grupo: e.name}]
            })
        });

        const permiso_activos_con_grupos = _.groupBy(permisos_activos_indpendientes, 'id');

        return (
            <ValidarPermisos can_see={can_detail} nombre='detalles de usuario'>
                <Titulo>Detalle {usuario.username}</Titulo>
                <div className="row">
                    <AtributoTexto className='col-12' label='Nombre'
                                   texto={`${usuario.first_name} ${usuario.last_name}`}/>
                    <AtributoTexto className='col-12' label='Email' texto={usuario.email}/>
                    <AtributoBooleano
                        className="col-md-4"
                        booleano={usuario.is_active}
                        icono_si='far fa-check-circle'
                        icono_no='far fa-times-circle'
                        label='Activo'
                    />
                    <AtributoBooleano
                        className="col-md-4"
                        booleano={usuario.is_staff}
                        icono_si='far fa-check-circle'
                        icono_no='far fa-times-circle'
                        label='Es Staff'
                    />
                    <AtributoBooleano
                        className="col-md-4"
                        booleano={usuario.is_superuser}
                        icono_si='far fa-check-circle'
                        icono_no='far fa-times-circle'
                        label='Es Super Usuario'
                    />
                    <PermisosUsuario
                        can_change={puede_cambiar_permisos}
                        actualizarPermiso={this.actualizarPermiso}
                        actualizarGrupo={this.actualizarGrupo}
                        permisos_todos={permisos_todos}
                        permisos_activos={permisos_activos}
                        grupos_todos={grupos_todos}
                        grupos_activos={grupos_activos}
                        permiso_activos_con_grupos={permiso_activos_con_grupos}
                    />
                </div>
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mi_cuenta: state.mi_cuenta,
        permisos_activos: state.permisos_otro_usuario,
        grupos_todos: state.grupos_permisos,
        permisos_todos: state.permisos,
        mis_permisos: state.mis_permisos,
        usuario: state.usuarios[id]
    }
}

export default connect(mapPropsToState, actions)(UsuariosDetail)