import React from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';


const MenuTerceros = (props) => (
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
            texto='Acompañante'
            icono='user-nurse'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/terceros/proveedores/list'
            texto='Colaborador'
            icono='user-hard-hat'
            type='nested'
        />
    </ListCollapse>
);


export default MenuTerceros;