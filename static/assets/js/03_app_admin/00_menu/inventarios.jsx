import React from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/DrawerMenuListItem';
import ListCollapse from '../../00_utilities/components/ui/drawer/DrawerMenuListCollapse';


const MenuInventarios = () => (
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