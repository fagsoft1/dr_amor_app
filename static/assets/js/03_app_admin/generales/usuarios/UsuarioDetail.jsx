import React, {Fragment, memo, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CargarDatos from "../../../00_utilities/components/system/CargarDatos";
import ListaBusqueda from '../../../00_utilities/utiles';
import Checkbox from '@material-ui/core/Checkbox/index';
import FormControlLabel from '@material-ui/core/FormControlLabel/index';
import {USUARIOS} from "../../../00_utilities/permisos/types";
import Typography from '@material-ui/core/Typography/index';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index';
import Badge from '@material-ui/core/Badge/index';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";


const UsuariosDetail = memo(props => {
    const {id} = props.match.params;
    const permisos_object = useTengoPermisos(USUARIOS);
    const dispatch = useDispatch();

    const usuario = useSelector(state => state.usuarios[id]);

    const buscarBusqueda = (lista, busqueda) => {
        return _.pickBy(lista, permiso => {
            return (
                permiso.codename.toString().toLowerCase().includes(busqueda.toString().toLowerCase()) ||
                (permiso.nombre ? permiso.nombre.toString().toLowerCase().includes(busqueda.toString().toLowerCase()) : true)
            )
        });
    };

    const actualizarPermiso = (permiso) => {
        const fetchUsuario = () => dispatch(actions.fetchUsuario(id));
        dispatch(actions.addPermisoUsuario(id, permiso.id, {callback: fetchUsuario}));
    };

    const actualizarGrupo = (grupo) => {
        const fetchUsuario = () => dispatch(actions.fetchUsuario(id));
        dispatch(actions.addGrupoUsuario(id, grupo.id, {callback: fetchUsuario}));
    };

    const cargarDatos = () => {
        const fetchUsuario = () => dispatch(actions.fetchUsuario(id));
        const cargarGruposPermisos = () => dispatch(actions.fetchGruposPermisos({callback: fetchUsuario}));
        dispatch(actions.fetchPermisosActivos({callback: cargarGruposPermisos}));
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearPermisos());
            dispatch(actions.clearGruposPermisos());
            dispatch(actions.clearUsuarios());
        }
    }, []);

    let grupos = useSelector(state => state.grupos_permisos);
    let permisos = useSelector(state => state.permisos);


    if (!usuario) {
        return <Typography variant="overline" gutterBottom color="primary">
            Cargando...
        </Typography>
    }

    const {username, to_string, email, is_active, is_staff, is_superuser, groups, user_permissions} = usuario;
    const permisos_en_grupos = _.flatMap(_.map(_.pickBy(grupos, g => groups.includes(g.id)), p => p.permissions));

    permisos = _.mapKeys(_.map(permisos, p => ({
        ...p,
        es_permiso_usuario: user_permissions.includes(p.id),
        es_permiso_usuario_grupo: permisos_en_grupos.includes(p.id)
    })), 'id');

    grupos = _.map(grupos, g => ({
        ...g,
        es_grupo_usuario: groups.includes(g.id)
    }));

    return (
        <Fragment>
            <Typography variant="h5" gutterBottom color="primary">
                Detalle {username}
            </Typography>
            <div className="row">
                <div className="col-12">
                    <Typography variant="body1" gutterBottom color="primary">
                        Nombre: {to_string}
                    </Typography>
                </div>
                <div className="col-12">
                    <Typography variant="body1" gutterBottom color="primary">
                        Email: {email}
                    </Typography>
                </div>
                <div className="col-md-4">
                    <Typography variant="body1" gutterBottom color="primary">
                        Activo <FontAwesomeIcon
                        icon={['far', `${is_active ? 'check-circle' : 'times'}`]}/>
                    </Typography>
                </div>
                <div className="col-md-4">
                    <Typography variant="body1" gutterBottom color="primary">
                        Es Staff <FontAwesomeIcon
                        icon={['far', `${is_staff ? 'check-circle' : 'times'}`]}/>
                    </Typography>
                </div>
                <div className="col-md-4">
                    <Typography variant="body1" gutterBottom color="primary">
                        Es Super Usuario <FontAwesomeIcon
                        icon={['far', `${is_superuser ? 'check-circle' : 'times'}`]}/>
                    </Typography>
                </div>
            </div>
            <div className="row">
                <ListaBusqueda>
                    {
                        busqueda => {
                            const permisos_lista = buscarBusqueda(permisos, busqueda);
                            return (
                                _.map(permisos_lista, p => {
                                    return (
                                        <div key={p.id} className='col-12 col-md-6 col-lg-4 col-xl-3'>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        key={p.id}
                                                        disabled={p.es_permiso_usuario_grupo || !permisos_object.can_change_permisos}
                                                        checked={p.es_permiso_usuario || p.es_permiso_usuario_grupo}
                                                        onChange={() => actualizarPermiso(p)}
                                                        color='primary'
                                                    />
                                                }
                                                label={
                                                    p.es_permiso_usuario_grupo ?
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
                                {
                                    _.map(grupos, g => {
                                        return (
                                            <Fragment key={g.id}>
                                                <div className="col-12">
                                                    <Typography variant="h6" gutterBottom color="primary">
                                                        {g.to_string}
                                                        <Checkbox
                                                            key={g.id}
                                                            disabled={!permisos_object.can_change_permisos}
                                                            checked={g.es_grupo_usuario}
                                                            onChange={() => actualizarGrupo(g)}
                                                            color='primary'
                                                        />
                                                    </Typography>
                                                </div>
                                                {
                                                    _.map(g.permissions, p => {
                                                            return (
                                                                <div key={p}
                                                                     className='col-12 col-md-6 col-lg-4 col-xl-3'>
                                                                    <span> {permisos[p].to_string}</span>
                                                                </div>
                                                            )
                                                        }
                                                    )
                                                }
                                            </Fragment>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <CargarDatos cargarDatos={cargarDatos}/>
            </div>
        </Fragment>
    )
});

export default UsuariosDetail;