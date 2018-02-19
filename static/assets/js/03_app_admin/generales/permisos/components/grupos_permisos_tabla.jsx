import React from 'react';
import {ListaBusqueda} from '../../../../00_utilities/utiles';
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';

const ItemTabla = (props) => {
    const {
        item,
        item: {name},
        can_delete,
        can_see,
        can_change,
        onSelectItem,
        onDelete,
        handleOpen
    } = props;
    return (
        <tr>
            <td>{name}</td>
            {can_change && <td>
                <IconButtonTableEdit
                    onClick={() => {
                        onSelectItem(item);
                        handleOpen()
                    }}/>
            </td>}
            {can_delete && <td>
                <MyDialogButtonDelete
                    element_name={item.name}
                    element_type='Grupo Permisos'
                    onDelete={() => onDelete(item)}/>
            </td>}
            {can_see && <td>
                <IconButtonTableSee
                    onClick={() => {
                        onSelectItem(item)
                    }}
                />
            </td>}
        </tr>
    )
};

const buscarBusqueda = (lista, busqueda) => {
    return _.pickBy(lista, (permiso) => {
        return (
            permiso.name.toString().toLowerCase().includes(busqueda)
        )
    });
};

const Tabla = (props) => {
    const {grupo_permisos, can_see, can_delete, can_change} = props;
    return (
        <ListaBusqueda>
            {busqueda => {
                const grupos_lista = buscarBusqueda(grupo_permisos, busqueda);
                return (
                    <table className='table tabla-maestra table-responsive'>
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            {can_change && <th>Editar</th>}
                            {can_delete && <th>Eliminar</th>}
                            {can_see && <th>Ver Permisos</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {_.map(grupos_lista, item => <ItemTabla key={item.id} item={item} {...props}/>)}
                        </tbody>
                    </table>
                )
            }}
        </ListaBusqueda>
    )

};

export default Tabla;