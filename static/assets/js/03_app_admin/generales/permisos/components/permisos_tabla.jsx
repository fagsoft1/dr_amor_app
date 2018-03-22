import React, {Component, Fragment} from 'react';
import {ListaBusqueda} from '../../../../00_utilities/utiles';

class ItemTabla extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            cambiar_nombre: false,
            nombre_permiso: ''
        })
    }

    render() {
        const {item, item: {name, codename, activo, nombre}, updatePermiso, can_change} = this.props;
        const {cambiar_nombre, nombre_permiso} = this.state;
        return (
            <tr>
                <td>{name}</td>
                <td>{codename}</td>
                {
                    can_change &&
                    <Fragment>
                        <td>
                            <i className={`${activo ? 'fas fa-check' : 'fal fa'}-square`}
                               onClick={() => {
                                   updatePermiso({...item, activo: !activo});
                                   this.setState({cambiar_nombre: false})
                               }}>
                            </i>
                        </td>
                        <td onClick={() => {
                            activo && this.setState({cambiar_nombre: true, nombre_permiso: nombre})
                        }}>
                            {
                                cambiar_nombre ?
                                    <input
                                        type="text" value={nombre_permiso ? nombre_permiso : ''}
                                        onChange={(e) => this.setState({nombre_permiso: e.target.value})}
                                        onBlur={() => {
                                            this.setState({cambiar_nombre: false});
                                            updatePermiso({...item, nombre: nombre_permiso.toUpperCase()})
                                        }}
                                    /> :
                                    nombre
                            }
                        </td>
                    </Fragment>
                }
            </tr>
        )
    }
};

const buscarBusqueda = (lista, busqueda) => {
    return _.pickBy(lista, (permiso) => {
        return (
            permiso.codename.toString().toLowerCase().includes(busqueda) ||
            permiso.name.toString().toLowerCase().includes(busqueda) ||
            (
                permiso.nombre ? permiso.nombre.toString().toLowerCase().includes(busqueda) : false
            )
        )
    });
};

export const Tabla = (props) => {
    const {permisos, can_change} = props;
    return (
        <ListaBusqueda>
            {
                busqueda => {
                    const permisos_lista = buscarBusqueda(permisos, busqueda);
                    return (
                        <table className='table tabla-maestra table-responsive'>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Codename</th>
                                {
                                    can_change &&
                                    <Fragment>
                                        <th>Activo</th>
                                        <th> Nombre</th>
                                    </Fragment>
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                _.map(permisos_lista, item => {
                                    return <ItemTabla key={item.id} item={item} {...props}/>
                                })
                            }
                            </tbody>
                        </table>
                    )
                }}
        </ListaBusqueda>
    )
};