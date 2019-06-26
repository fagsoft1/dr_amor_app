import React from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/DrawerMenuListItem';
import ListCollapse from '../../00_utilities/components/ui/drawer/DrawerMenuListCollapse';


const MenuCaja = (props) => (
    <ListCollapse icono='money-bill-alt' texto='Inventarios'>
        <DrawerListItem
            size='1x'
            link='/app/admin/cajas/billetes_monedas/list'
            texto='Billetes y Monedas'
            icono='money-bill-alt'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/cajas/conceptos_operaciones_caja/list'
            texto='Conceptos Operaciones Caja'
            icono='list'
            type='nested'
        />
    </ListCollapse>
);

export default MenuCaja;