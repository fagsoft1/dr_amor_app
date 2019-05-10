import React, {Fragment} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';

import MenuTerceros from './terceros';
import MenuPermisos from './permisos';
import MenuInventarios from './inventarios';
import MenuCaja from "./caja";
import MenuContabilidad from "./contabilidad";

const Menu = () => <Fragment>
    <DrawerListItem
        size='lg'
        link='/app/admin/empresas/empresas/list'
        texto='Empresas'
        icono='building'
    />
    <DrawerListItem
        size='lg'
        link='/app/admin/habitaciones/dashboard'
        texto='Habitaciones'
        icono='bed'
    />
    <DrawerListItem
        size='lg'
        link='/app/admin/productos/dashboard'
        texto='Productos'
        icono='glass-martini'
    />
    <DrawerListItem
        size='lg'
        link='/app/admin/puntos_ventas/puntos_ventas/list'
        texto='Puntos de Venta'
        icono='cash-register'
    />
    <DrawerListItem
        size='lg'
        link='/app/admin/parqueadero/dashboard'
        texto='Parqueadero'
        icono='car'
    />
    <MenuPermisos/>
    <MenuTerceros/>
    <MenuInventarios/>
    <MenuCaja/>
    <MenuContabilidad/>
</Fragment>;

export default Menu;