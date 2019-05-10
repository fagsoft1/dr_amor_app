import React from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';


const MenuPermisos = (props) => (
    <ListCollapse icono='coins' texto='Contabilidad'>
        <DrawerListItem
            size='1x'
            link='/app/admin/permisos/list'
            texto='Contabilidad'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/contabilidad/configuracion/dashboard'
            texto='Configuración'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/permisos/list'
            texto='Informes'
            type='nested'
        />
    </ListCollapse>
);


export default MenuPermisos;
