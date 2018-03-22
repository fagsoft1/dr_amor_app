import React, {Fragment} from 'react';
import {ListaBusqueda} from '../../../../00_utilities/utiles';
import IconButton from 'material-ui/IconButton';

const DivPermiso = (props) => {
    const {permiso, id_permisos_activos, actualizarPermiso, permiso_activos_con_grupos, can_change} = props;
    const esta = id_permisos_activos.includes(permiso.id);

    let en_grupo = null;
    if (permiso_activos_con_grupos) {
        en_grupo = permiso_activos_con_grupos[permiso.id];
    }

    const onClick = can_change ? () => actualizarPermiso(permiso) : null;

    return (
        <div className='col-12 col-md-6 col-lg-4 col-xl-3'>
            <div className='row'>
                <div className='col-12'>
                    <span> {permiso.nombre ? permiso.nombre.toLowerCase() : permiso.name.toLowerCase()}</span>
                    {
                        !en_grupo ?
                            <Fragment>
                                {
                                    can_change ?
                                        <span> <i onClick={onClick}
                                                  className={`${esta ? 'fas fa-check-square' : 'far fa-square'} puntero`}></i></span>
                                        :
                                        <Fragment>
                                            {
                                                esta &&
                                                <span> <i className={`fal fa-check`}></i></span>
                                            }
                                        </Fragment>
                                }
                            </Fragment>
                            :
                            <Fragment>
                                <span style={{fontSize: "0.8rem", color: "red"}}> ({en_grupo.length})</span>
                            </Fragment>
                    }
                </div>
                <div className='col-12 mb-3'>
                    <span className='texto-cita top'> {permiso.content_type_label}</span>
                </div>
            </div>
        </div>
    )
};

const DivGrupo = (props) => {
    const {grupo: {permissions, name, id}, grupos_activos, actualizarGrupo, grupo, can_change} = props;
    const esta = _.has(grupos_activos, id);
    return (
        <div className='col-12'>
            <span>{name.toUpperCase()}</span>
            {
                can_change &&
                <IconButton iconClassName={`${esta ? 'fas fa-check-square' : 'far fa-square'}`}
                            onClick={() => actualizarGrupo(grupo)}/>
            }
            <div className='row pl-4'>
                {permissions.map(permiso => {
                    return (
                        <div key={permiso.id} className='col-12 col-md-6 col-lg-4 col-xl-3'>
                            <span> {permiso.nombre ? permiso.nombre.toLowerCase() : permiso.name.toLowerCase()}
                                </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};


const buscarBusqueda = (lista, busqueda) => {
    return _.pickBy(lista, (permiso) => {
        return (
            permiso.codename.toString().toLowerCase().includes(busqueda.toString().toLowerCase()) ||
            (permiso.nombre ? permiso.nombre.toString().toLowerCase().includes(busqueda.toString().toLowerCase()) : true)
        )
    });
};

const PermisosSelect = (props) => {
    const {permisos_todos, permisos_activos, grupos_todos} = props;
    const id_permisos_activos = _.map(permisos_activos, permiso => {
        return permiso.id
    });
    return (
        <div className='col-12'>
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        Mís Permisos:
                    </div>
                    <ListaBusqueda>
                        {busqueda => {
                            const permisos_lista = buscarBusqueda(permisos_todos, busqueda);
                            return (
                                <div className='p-2 row'>
                                    {_.map(permisos_lista, permiso =>
                                        <DivPermiso id_permisos_activos={id_permisos_activos}
                                                    key={permiso.id}
                                                    permiso={permiso} {...props}/>
                                    )}
                                </div>
                            )
                        }
                        }
                    </ListaBusqueda>
                </div>
            </div>
            {
                grupos_todos &&
                <Fragment>
                    <div className="card mt-2">
                        <div className="card-body">
                            <div className="card-title">
                                Grupos:
                            </div>
                            {_.map(_.sortBy(grupos_todos, ['name']), g => {
                                return <DivGrupo key={g.id} grupo={g}  {...props}/>
                            })}
                        </div>
                    </div>
                </Fragment>
            }
        </div>
    )
};

export default PermisosSelect;