import React, {Fragment} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';

const Menu = () => <Fragment>
    <DrawerListItem
        size='lg'
        link='/app/consultas'
        texto='Inicio'
        icono='home'
    />
</Fragment>;

export default Menu;