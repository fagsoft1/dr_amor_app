import React, {memo} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/DrawerMenu';

import PuntoVenta from "./tienda/containers/PuntoVentaTienda";
import Menu from "./00_menu/index";
import DashboarInventarios from "./inventarios/containers/InventarioTiendaDashboard";

const AdminApp = memo(() => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Punto de venta Tienda'>
                <div className="p-3">
                    <Switch>
                        <Route exact path='/app/tienda/' component={PuntoVenta}/>
                        <Route exact path='/app/tienda/inventarios/dashboard' component={DashboarInventarios}/>
                    </Switch>
                </div>
            </DrawerMenu>
        </Loading>
    )
});

export default AdminApp;