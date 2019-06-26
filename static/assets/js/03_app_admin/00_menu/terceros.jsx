import React from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/DrawerMenuListItem';
import ListCollapse from '../../00_utilities/components/ui/drawer/DrawerMenuListCollapse';


const MenuTerceros = () => (
    <ListCollapse icono='users' texto='Terceros'>
        <DrawerListItem
            size='1x'
            link='/app/admin/usuarios/list'
            texto='Usuarios'
            icono='user'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/usuarios/acompanantes/dashboard'
            texto='Acompañantes'
            icono='user-nurse'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/terceros/colaboradores/list'
            texto='Colaboradores'
            icono='user-hard-hat'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/terceros/proveedores/list'
            texto='Proveedores'
            icono='user-tie'
            type='nested'
        />
    </ListCollapse>
);


export default MenuTerceros;