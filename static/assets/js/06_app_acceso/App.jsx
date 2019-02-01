import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import AppBarMenu from '../00_utilities/components/ui/menu/app_bar';

import AccesoList from "./acceso/containers/acceso_list_container";

const AdminApp = (props) => {
    return (
        <Loading>
            <AppBarMenu titulo='Acceso'>
                <Switch>
                    <Route exact path='/app/acceso/' component={AccesoList}/>
                </Switch>
            </AppBarMenu>
        </Loading>
    )
};

export default AdminApp;