import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import Menu from "./00_menu/index";
import DashboardParqueadero from "./parqueadero/dashboard/containers/parqueadero_dashboard";

const AdminApp = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Parqueadero'>
                <div className="p-3">
                    <Switch>
                        <Route exact path='/app/parqueadero/' component={DashboardParqueadero}/>
                    </Switch>
                </div>
            </DrawerMenu>
        </Loading>
    )
};

export default AdminApp;