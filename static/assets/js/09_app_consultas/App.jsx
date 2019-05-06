import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';
import Menu from './00_menu/index';
import App from "./index";

const AdminApp = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Admin'>
                <Switch>
                    <Route exact path='/app/consultas/' component={App}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default AdminApp;