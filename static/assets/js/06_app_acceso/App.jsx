import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import AccesoList from "./acceso/containers/AccesoDashboard";

const AdminApp = (props) => {
    return (
        <Loading>
            <DrawerMenu lista_menu={null} titulo='Admin'>
                <Switch>
                    <Route exact path='/app/acceso/' component={AccesoList}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default AdminApp;