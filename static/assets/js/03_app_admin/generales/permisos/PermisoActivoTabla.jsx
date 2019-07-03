import React, {Fragment, memo, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import ListaBusqueda from '../../../00_utilities/utiles';
import * as actions from "../../../01_actions/01_index";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {PERMISSION} from "../../../00_utilities/permisos/types";
import CargarDatos from "../../../00_utilities/components/system/CargarDatos";
import Typography from "@material-ui/core/Typography/index";
import PermisoActivoTablaItem from './PermisoActivoTablaItem';

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


const Tabla = memo(props => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchPermisos());
    };
    const permisos_permissions = useTengoPermisos(PERMISSION);
    const permisos = useSelector(state => state.permisos);

    const updatePermiso = (permiso) => {
        const callback = () => {
            dispatch(actions.notificarAction(`Se ha actualizado con éxito el permiso ${permiso.codename}`));
        };
        dispatch(actions.updatePermiso(permiso.id, permiso, {callback}))
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearPermisos());
        };
    }, []);

    return (
        <Fragment>
            <Typography variant="h5" gutterBottom color="primary">
                Lista de Permisos
            </Typography>
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
                                        permisos_permissions.change_plus &&
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
                                        return <PermisoActivoTablaItem
                                            key={item.id}
                                            item={item} updatePermiso={updatePermiso}
                                            can_change={permisos_permissions.change_plus}
                                        />
                                    })
                                }
                                </tbody>
                            </table>
                        )
                    }}
            </ListaBusqueda>
            <CargarDatos cargarDatos={cargarDatos}/>
        </Fragment>
    )
});

export default Tabla;