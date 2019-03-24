import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import PuntoVenta from "./tienda/containers/punto_venta_tienda";
import Menu from "./00_menu/index";
import DashboarInventarios from "./inventarios/containers/dashboard";

const AdminApp = () => {
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
};

export default AdminApp;