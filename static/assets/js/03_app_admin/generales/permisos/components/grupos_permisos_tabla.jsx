import React from 'react';
import {ListaBusqueda} from '../../../../00_utilities/utiles';
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableSee from '../../../../00_utilities/components/ui/icon/TableIconButtonDetail';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/TableIconButtonEdit';

const ItemTabla = (props) => {
    const {
        item,
        item: {name},
        permisos_object,
        onSelectItemEdit,
        onDelete,
        onSelectItemDetail,
    } = props;
    return (
        <tr>
            <td>{name}</td>
            {permisos_object.change && <td>
                <IconButtonTableEdit
                    onClick={() => {
                        onSelectItemEdit(item);
                    }}/>
            </td>}
            {permisos_object.delete && <td>
                <MyDialogButtonDelete
                    element_name={item.name}
                    element_type='Grupo Permisos'
                    onDelete={() => onDelete(item)}/>
            </td>}
            {permisos_object.view && <td>
                <IconButtonTableSee
                    onClick={() => {
                        onSelectItemDetail(item)
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
    const {data, permisos_object} = props;
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
                        {_.map(grupos_lista, item => <ItemTabla key={item.id} item={item} {...props}/>)}
                        </tbody>
                    </table>
                )
            }}
        </ListaBusqueda>
    )

};

export default Tabla;