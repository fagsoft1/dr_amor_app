import React, {memo} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/DrawerMenuListItem';
import ListCollapse from '../../00_utilities/components/ui/drawer/DrawerMenuListCollapse';


const MenuTerceros = memo(props => {
    const {permisos_menu} = props;
    const {
        admin_terceros_usuarios,
        admin_terceros_acompanantes,
        admin_terceros_colaboradores,
        admin_terceros_proveedores
    } = permisos_menu;
    return (
        (
            admin_terceros_proveedores ||
            admin_terceros_colaboradores ||
            admin_terceros_usuarios ||
            admin_terceros_acompanantes
        ) &&
        <ListCollapse icono='users' texto='Terceros'>
            {admin_terceros_usuarios &&
            <DrawerListItem
                size='1x'
                link='/app/admin/usuarios/list'
                texto='Usuarios'
                icono='user'
                type='nested'
            />}
            {admin_terceros_acompanantes &&
            <DrawerListItem
                size='1x'
                link='/app/admin/usuarios/acompanantes/dashboard'
                texto='Acompañantes'
                icono='user-nurse'
                type='nested'
            />}
            {admin_terceros_colaboradores &&
            <DrawerListItem
                size='1x'
                link='/app/admin/terceros/colaboradores/list'
                texto='Colaboradores'
                icono='user-hard-hat'
                type='nested'
            />}
            {admin_terceros_proveedores &&
            <DrawerListItem
                size='1x'
                link='/app/admin/terceros/proveedores/list'
                texto='Proveedores'
                icono='user-tie'
                type='nested'
            />}
        </ListCollapse>
    )
});


export default MenuTerceros;