import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto, AtributoTexto, AtributoBooleano} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import {
    USUARIOS as permisos_view,
    PERMISSION as permisos_view_permission
} from "../../../../00_utilities/permisos/types";

import PermisosUsuario from '../../permisos/components/permisos_select_permisos';

class UsuariosDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos_los_permisos: {},
        };
        this.cargarDatos = this.cargarDatos.bind(this);
        this.notificar = this.notificar.bind(this);
        this.actualizarPermiso = this.actualizarPermiso.bind(this);
        this.actualizarGrupo = this.actualizarGrupo.bind(this);
    }

    notificar(mensaje) {
        this.props.notificarAction(mensaje);
    }

    componentDidMount() {
        const {
            fetchPermisosActivos
        } = this.props;
        fetchPermisosActivos({callback: (response) => this.setState({todos_los_permisos: _.mapKeys(response, 'id')})});
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearPermisos()
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const cargarGruposPermisos = () => this.props.fetchGruposPermisos();
        const cargarPermisosActivos = () => this.props.fetchPermisosActivos({callback: cargarGruposPermisos});
        const cargarPermisosUsuario = () => this.props.fetchOtroUsuarioPermisos(id, {callback: cargarPermisosActivos});
        this.props.fetchUsuario(id, {callback: cargarPermisosUsuario});

    }

    actualizarPermiso(permiso) {
        const {id} = this.props.match.params;
        const CargarPermisosUsuario = () => this.props.fetchOtroUsuarioPermisos(id);
        this.props.addPermisoUsuario(id, permiso.id, {callback: CargarPermisosUsuario});
    }

    actualizarGrupo(grupo) {
        const {id} = this.props.match.params;
        const CargarUsuario = () => this.props.fetchUsuario(id);
        this.props.addGrupoUsuario(id, grupo.id, {callback: CargarUsuario});
    }

    render() {
        const {usuario, permisos_activos, permisos_todos, grupos_todos} = this.props;
        const {todos_los_permisos} = this.state;
        const permisos = permisosAdapter(permisos_view);
        const permisos_permission = permisosAdapter(permisos_view_permission);


        if (!usuario) {
            return <SinObjeto/>
        }

        const grupos_activos = _.pickBy(
            grupos_todos,
            grupo => {
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
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de usuario'>
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
                        can_change={permisos_permission.change}
                        actualizarPermiso={this.actualizarPermiso}
                        actualizarGrupo={this.actualizarGrupo}
                        permisos_todos={todos_los_permisos}
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
        permisos_activos: state.permisos_otro_usuario,
        grupos_todos: state.grupos_permisos,
        permisos_todos: state.permisos,
        auth: state.auth,
        usuario: state.usuarios[id]
    }
}

export default connect(mapPropsToState, actions)(UsuariosDetail)