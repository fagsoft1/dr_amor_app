import React, {Fragment, memo} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/DrawerMenuListItem';
import useWhyDidYouUpdate from '../../00_utilities/hooks/useWhyDidYouUpdate';

import MenuTerceros from './terceros';
import MenuPermisos from './permisos';
import MenuInventarios from './inventarios';
import MenuCaja from "./caja";
import MenuContabilidad from "./contabilidad";
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {MENU_ADMIN_PERMISSIONS} from "../../permisos";

const Menu = memo(props => {
    const permisos_menu = useTengoPermisos(MENU_ADMIN_PERMISSIONS);
    const {
        admin_empresas,
        admin_habitaciones,
        admin_productos,
        admin_puntos_ventas,
        admin_parqueadero
    } = permisos_menu;
    console.log('RENDERIZÓ MENU')
    useWhyDidYouUpdate('MenU', permisos_menu);
    console.log('RENDERIZÓ MENU')
    return (
        <Fragment>
            {
                admin_empresas &&
                <DrawerListItem
                    size='lg'
                    link='/app/admin/empresas/empresas/list'
                    texto='Empresas'
                    icono='building'
                />
            }
            {
                admin_habitaciones &&
                <DrawerListItem
                    size='lg'
                    link='/app/admin/habitaciones/dashboard'
                    texto='Habitaciones'
                    icono='bed'
                />
            }
            {
                admin_productos &&
                <DrawerListItem
                    size='lg'
                    link='/app/admin/productos/dashboard'
                    texto='Productos'
                    icono='glass-martini'
                />
            }
            {
                admin_puntos_ventas &&
                <DrawerListItem
                    size='lg'
                    link='/app/admin/puntos_ventas/puntos_ventas/list'
                    texto='Puntos de Venta'
                    icono='cash-register'
                />
            }
            {
                admin_parqueadero &&
                <DrawerListItem
                    size='lg'
                    link='/app/admin/parqueadero/dashboard'
                    texto='Parqueadero'
                    icono='car'
                />
            }
            <MenuPermisos permisos_menu={permisos_menu}/>
            <MenuTerceros permisos_menu={permisos_menu}/>
            <MenuInventarios permisos_menu={permisos_menu}/>
            <MenuCaja permisos_menu={permisos_menu}/>
            <MenuContabilidad permisos_menu={permisos_menu}/>
        </Fragment>
    )
});

export default Menu;