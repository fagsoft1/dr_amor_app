import React, {memo} from 'react';
import ListaBusqueda from '../../../00_utilities/utiles';
import GrupoPermisoTablaItem from './GrupoPermisoTablaItem';

const buscarBusqueda = (lista, busqueda) => {
    return _.pickBy(lista, (permiso) => {
        return (
            permiso.name.toString().toLowerCase().includes(busqueda)
        )
    });
};

const areEqual = (prevProps, nextProps) => {
    return prevProps.list === nextProps.list;
};

const Tabla = memo((props) => {
    const {permisos_object} = props;
    const data = _.map(props.list);
    return (
        <ListaBusqueda>
            {busqueda => {
                const grupos_lista = buscarBusqueda(data, busqueda);
                return (
                    <table className='table tabla-maestra table-responsive'>
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            {permisos_object.change && <th>Editar</th>}
                            {permisos_object.delete && <th>Eliminar</th>}
                            {permisos_object.detail && <th>Ver Permisos</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {_.map(grupos_lista, item => <GrupoPermisoTablaItem key={item.id} item={item} {...props}/>)}
                        </tbody>
                    </table>
                )
            }}
        </ListaBusqueda>
    )

}, areEqual);

export default Tabla;