import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import Menu from './00_menu/index';

import Index from './index';
import LiquidarAcompananteDashboard from "./liquidaciones_acompanantes/containers/liquidar_acompanante_dashboard";
import CierreCaja from "./cierres_cajas/containers/cierre_caja_dashboard";
import OperacionesCaja from "./operaciones_caja/containers/registro_operacion_dashboard";

const AdminApp = (props) => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Admin'>
                <Switch>
                    <Route exact path='/app/cajas/registro_operaciones' component={OperacionesCaja}/>
                    <Route exact path='/app/cajas/liquidar_acompanante' component={LiquidarAcompananteDashboard}/>
                    <Route exact path='/app/cajas/cierre_caja' component={CierreCaja}/>
                    <Route exact path='/app/cajas/' component={Index}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default AdminApp;