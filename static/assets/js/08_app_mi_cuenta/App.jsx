import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/DrawerMenu';
import Menu from './00_menu/index';
import Seguridad from "../authentication/mi_cuenta/seguridad/components/seguridad";
import App from "./index";
import Balance from "./financiero/balance/containers/balance";

const AdminApp = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Admin'>
                <Switch>
                    <Route exact path='/app/mi_cuenta/' component={App}/>
                    <Route exact path='/app/mi_cuenta/seguridad/' component={Seguridad}/>
                    <Route exact path='/app/mi_cuenta/financiero/' component={Balance}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default AdminApp;