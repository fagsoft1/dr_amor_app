import React from 'react';
import {ListaBusqueda} from '../../../../00_utilities/utiles';
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../../00_utilities/components/ui/icon/table_icon_button_detail';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';

const ItemTabla = (props) => {
    const {
        item,
        item: {name},
        permisos,
        onSelectItemEdit,
        onDelete,
        onSelectItemDetail,
    } = props;
    return (
        <tr>
            <td>{name}</td>
            {permisos.change && <td>
                <IconButtonTableEdit
                    onClick={() => {
                        onSelectItemEdit(item);
                    }}/>
            </td>}
            {permisos.delete && <td>
                <MyDialogButtonDelete
                    element_name={item.name}
                    element_type='Grupo Permisos'
                    onDelete={() => onDelete(item)}/>
            </td>}
            {permisos.detail && <td>
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
    const {data, permisos} = props;
    return (
        <ListaBusqueda>
            {busqueda => {
                const grupos_lista = buscarBusqueda(data, busqueda);
                return (
                    <table className='table tabla-maestra table-responsive'>
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            {permisos.change && <th>Editar</th>}
                            {permisos.delete && <th>Eliminar</th>}
                            {permisos.detail && <th>Ver Permisos</th>}
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