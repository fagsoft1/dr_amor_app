import React, {Fragment} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';


const Menu = () => <Fragment>
    <DrawerListItem
        size='lg'
        link='/app/tienda/'
        texto='Inicio'
        icono='home'
    />
    <DrawerListItem
        size='lg'
        link='/app/tienda/inventarios/dashboard'
        texto='Inventarios'
        icono='inventory'
    />
</Fragment>;

export default Menu;