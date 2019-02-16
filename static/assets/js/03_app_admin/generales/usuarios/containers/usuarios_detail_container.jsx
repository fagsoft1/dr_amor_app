import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import {ListaBusqueda} from '../../../../00_utilities/utiles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
    USUARIOS as permisos_view
} from "../../../../00_utilities/permisos/types";
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Badge from '@material-ui/core/Badge';

class UsuariosDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos_los_permisos: {},
        };
        this.cargarDatos = this.cargarDatos.bind(this);
        this.actualizarPermiso = this.actualizarPermiso.bind(this);
        this.actualizarGrupo = this.actualizarGrupo.bind(this);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos()});
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearGruposPermisos();
        this.props.clearUsuarios();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const cargarPermisosUsuario = () => this.props.fetchPermisosxUsuario(id);
        const cargarGruposPermisos = () => this.props.fetchGruposPermisos({callback: cargarPermisosUsuario});
        const cargarPermisosActivos = () => this.props.fetchPermisosActivos({
            callback: response => {
                this.setState({
                    todos_los_permisos: _.mapKeys(response, 'id')
                });
                cargarGruposPermisos();
            },
        });
        const fetchUsuario = () => this.props.fetchUsuario(id, {callback: cargarPermisosActivos});
        this.props.fetchPermisosActivos({
            callback: (response) => {
                this.setState({todos_los_permisos: _.mapKeys(response, 'id')});
                fetchUsuario()
            }
        });
    }

    actualizarPermiso(permiso) {
        const {id} = this.props.match.params;
        const cargarPermisosUsuario = () => this.props.fetchPermisosxUsuario(id);
        this.props.addPermisoUsuario(id, permiso.id, {callback: cargarPermisosUsuario});
    }

    actualizarGrupo(grupo) {
        const {id} = this.props.match.params;
        const cargarPermisosUsuario = () => this.props.fetchPermisosxUsuario(id);
        const cargarUsuario = () => this.props.fetchUsuario(id, {callback: cargarPermisosUsuario});
        this.props.addGrupoUsuario(id, grupo.id, {callback: cargarUsuario});
    }

    buscarBusqueda(lista, busqueda) {
        return _.pickBy(lista, permiso => {
            return (
                permiso.codename.toString().toLowerCase().includes(busqueda.toString().toLowerCase()) ||
                (permiso.nombre ? permiso.nombre.toString().toLowerCase().includes(busqueda.toString().toLowerCase()) : true)
            )
        });
    };

    render() {
        const {usuario, grupos_permisos, mis_permisos} = this.props;
        let {permisos_usuario} = this.props;
        const {todos_los_permisos} = this.state;
        const permisos = permisosAdapter(mis_permisos, permisos_view);

        const grupos_con_permisos = _.map(grupos_permisos, g => {
            const permisos_grupo = g.permissions.map(p => todos_los_permisos[p]);
            return (
                {...g, permissions: permisos_grupo, activo: usuario.groups.includes(g.id)}
            )
        });

        const permisos_grupos_del_usuario = _.flatten(_.map(_.pickBy(grupos_permisos, g => usuario.groups.includes(g.id)), e => e.permissions));

        permisos_usuario = _.map(permisos_usuario, e => ({
            ...e,
            incluido_grupo: permisos_grupos_del_usuario.includes(e.id)
        }));
        permisos_usuario = _.mapKeys(permisos_usuario, 'id');


        if (!usuario) {
            return <Typography variant="overline" gutterBottom color="primary">
                Cargando...
            </Typography>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de usuario'>
                <Typography variant="h5" gutterBottom color="primary">
                    Detalle {usuario.username}
                </Typography>
                <div className="row">
                    <div className="col-12">
                        <Typography variant="body1" gutterBottom color="primary">
                            Nombre: {`${usuario.to_string}`}
                        </Typography>
                    </div>
                    <div className="col-12">
                        <Typography variant="body1" gutterBottom color="primary">
                            Email: {usuario.email}
                        </Typography>
                    </div>
                    <div className="col-md-4">
                        <Typography variant="body1" gutterBottom color="primary">
                            Activo <FontAwesomeIcon
                            icon={['far', `${usuario.is_active ? 'check-circle' : 'times'}`]}/>
                        </Typography>
                    </div>
                    <div className="col-md-4">
                        <Typography variant="body1" gutterBottom color="primary">
                            Es Staff <FontAwesomeIcon
                            icon={['far', `${usuario.is_staff ? 'check-circle' : 'times'}`]}/>
                        </Typography>
                    </div>
                    <div className="col-md-4">
                        <Typography variant="body1" gutterBottom color="primary">
                            Es Super Usuario <FontAwesomeIcon
                            icon={['far', `${usuario.is_superuser ? 'check-circle' : 'times'}`]}/>
                        </Typography>
                    </div>
                </div>
                <div className="row">
                    <ListaBusqueda>
                        {
                            busqueda => {
                                const permisos_lista = this.buscarBusqueda(todos_los_permisos, busqueda);
                                const permisos_usuario_id_array = _.map(permisos_usuario, e => e.id);
                                return (
                                    _.map(permisos_lista, p => {
                                        const en_grupo = permisos_usuario[p.id] ? permisos_usuario[p.id].incluido_grupo : false;
                                        return (
                                            <div key={p.id} className='col-12 col-md-6 col-lg-4 col-xl-3'>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            key={p.id}
                                                            disabled={en_grupo}
                                                            checked={permisos_usuario_id_array.includes(p.id)}
                                                            onChange={() => this.actualizarPermiso(p)}
                                                            color='primary'
                                                        />
                                                    }
                                                    label={
                                                        en_grupo ?
                                                            <Badge badgeContent='G'
                                                                   color="secondary">
                                                                {p.to_string}
                                                            </Badge> :
                                                            <Fragment>{p.to_string}</Fragment>
                                                    }
                                                />
                                            </div>
                                        )
                                    })
                                )
                            }
                        }
                    </ListaBusqueda>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">
                                    <Typography variant="h5" gutterBottom color="primary">
                                        Grupos
                                    </Typography>
                                </div>
                                <div className="row pl-3">
                                    <Fragment>
                                        {
                                            _.map(grupos_con_permisos, g => {
                                                return (
                                                    <Fragment key={g.id}>
                                                        <div className="col-12">
                                                            <Typography variant="h6" gutterBottom color="primary">
                                                                {g.to_string}
                                                                <Checkbox
                                                                    key={g.id}
                                                                    checked={g.activo}
                                                                    onChange={() => this.actualizarGrupo(g)}
                                                                    color='primary'
                                                                />
                                                            </Typography>
                                                        </div>
                                                        {
                                                            _.map(g.permissions, p => {
                                                                    if (p) {
                                                                        return (
                                                                            <div key={p.id}
                                                                                 className='col-12 col-md-6 col-lg-4 col-xl-3'>
                                                                                <span> {p.to_string}</span>
                                                                            </div>
                                                                        )
                                                                    }
                                                                }
                                                            )
                                                        }


                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </Fragment>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        auth: state.auth,
        usuario: state.usuarios[id],
        grupos_permisos: state.grupos_permisos,
        permisos_usuario: state.permisos,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(UsuariosDetail)