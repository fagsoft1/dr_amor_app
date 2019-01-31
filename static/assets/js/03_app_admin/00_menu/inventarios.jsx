import React from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';


const MenuInventarios = (props) => (
    <ListCollapse icono='warehouse' texto='Inventarios'>
        <DrawerListItem
            size='1x'
            link='/app/admin/inventarios/bodegas/list'
            texto='Bodegas'
            icono='warehouse'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/inventarios/movimientos_inventarios/list'
            texto='Kardex'
            icono='inventory'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/inventarios/traslados/list'
            texto='Kardex Traslados'
            icono='exchange'
            type='nested'
        />
    </ListCollapse>
);

export default MenuInventarios;