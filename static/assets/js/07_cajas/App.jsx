import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';
import Index from './index';

const AdminApp = (props) => {
    return (
        <Loading>
            <DrawerMenu titulo='Admin'>
                <Switch>
                    <Route exact path='/app/cajas/' component={Index}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default AdminApp;