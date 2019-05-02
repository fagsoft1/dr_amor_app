import React, {Fragment} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';

const Menu = () => {
        return (
            <Fragment>
                <DrawerListItem
                    size='lg'
                    link='/app/cajas/'
                    texto='Principal'
                    icono='home'
                />
                <Fragment>
                    <DrawerListItem
                        size='lg'
                        link='/app/cajas/liquidar_acompanante'
                        texto='Liquidación Acompañante'
                        icono='female'
                    />
                </Fragment>
            </Fragment>
        )
    }
;

export default Menu;