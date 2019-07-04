import React, {memo} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/DrawerMenuListItem';
import ListCollapse from '../../00_utilities/components/ui/drawer/DrawerMenuListCollapse';


const MenuPermisos = memo(props => {
    const {permisos_menu} = props;
    const {
        admin_permisos,
        admin_permisos_grupos
    } = permisos_menu;
    return (
        (
            admin_permisos ||
            admin_permisos_grupos
        ) &&
        <ListCollapse icono='lock' texto='Permisos'>
            {
                admin_permisos &&
                <DrawerListItem
                    size='1x'
                    link='/app/admin/permisos/list'
                    texto='Permisos'
                    icono='lock'
                    type='nested'
                />
            }
            {
                admin_permisos_grupos &&
                <DrawerListItem
                    size='1x'
                    link='/app/admin/grupos_permisos/list'
                    texto='Grupos'
                    icono='object-group'
                    type='nested'
                />
            }
        </ListCollapse>
    )
});


export default MenuPermisos;
