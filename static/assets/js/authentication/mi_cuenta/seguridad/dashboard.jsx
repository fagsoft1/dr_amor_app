import React, {memo} from 'react';
import {Route, Switch} from 'react-router-dom';
import Seguridad from "./SeguridadDashboard";
import Loading from '../../../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../../../00_utilities/components/ui/drawer/DrawerMenu';
import Menu from '../00_menu';

const MiCuenta = memo(props => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Mi Cuenta'>
                <Switch>
                    <Route path='/app/mi_cuenta/seguridad' component={Seguridad}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
});

export default MiCuenta