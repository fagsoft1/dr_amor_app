import React, {memo} from 'react';
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/DeleteDialog';
import IconButtonTableSee from '../../../00_utilities/components/ui/icon/TableIconButtonDetail';
import IconButtonTableEdit from '../../../00_utilities/components/ui/icon/TableIconButtonEdit';

const GrupoPermisoTablaItem = memo(props => {
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
            {permisos_object.detail && <td>
                <IconButtonTableSee
                    onClick={() => {
                        onSelectItemDetail(item)
                    }}
                />
            </td>}
        </tr>
    )
});

export default GrupoPermisoTablaItem;