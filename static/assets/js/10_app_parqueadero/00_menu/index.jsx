import React, {Fragment, memo} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/DrawerMenuListItem';

const Menu = () => <Fragment>
    <DrawerListItem
        size='lg'
        link='/app/parqueadero'
        texto='Inicio'
        icono='home'
    />
</Fragment>;

export default memo(Menu);