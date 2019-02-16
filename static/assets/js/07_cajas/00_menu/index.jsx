import React, {Fragment} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';

const Menu = () => {
        const punto_venta = JSON.parse(localStorage.getItem('punto_venta'));
        return (
            <Fragment>
                <DrawerListItem
                    size='lg'
                    link='/app/cajas/'
                    texto='Principal'
                    icono='home'
                />
                {
                    punto_venta.id &&
                    punto_venta.abierto &&
                    <Fragment>
                        <DrawerListItem
                            size='lg'
                            link='/app/cajas/registro_operaciones/'
                            texto='Registrar Operacionese'
                            icono='exchange-alt'
                        />
                        <DrawerListItem
                            size='lg'
                            link='/app/cajas/liquidar_acompanante'
                            texto='Liquidación Acompañante'
                            icono='female'
                        />
                        <DrawerListItem
                            size='lg'
                            link='/app/cajas/cierre_caja'
                            texto='Cierre de Caja'
                            icono='door-open'
                        />
                    </Fragment>

                }
            </Fragment>
        )
    }
;

export default Menu;