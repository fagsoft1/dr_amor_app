import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/DrawerMenu';
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