import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import PuntoVenta from "./tienda/containers/punto_venta_tienda";

const AdminApp = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={null} titulo='Punto de venta Tienda'>
                <div className="p-3">
                    <Switch>
                        <Route exact path='/app/tienda/:id' component={PuntoVenta}/>
                    </Switch>
                </div>
            </DrawerMenu>
        </Loading>
    )
};

export default AdminApp;