import React, {memo} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';

import AppIndex from './index/dashboard/ServicioDashboard';
import CuentaDetail from '../07_cajas/cuentas/cuenta_detail';
import LiquidacionDetail from '../07_cajas/liquidar_cuenta/liquidacion_detail';
import LiquidarCuenta from '../07_cajas/liquidar_cuenta/liquidacion_acompanante/liquidar_cuenta_acompanante';
import DrawerMenu from '../00_utilities/components/ui/drawer/DrawerMenu';

const App = memo(() => {
    return (
        <Loading>
            <DrawerMenu titulo='Servicios'>
                <Switch>
                    <Route exact path='/app/servicios/' component={AppIndex}/>
                    <Route exact path='/app/servicios/liquidar_cuenta/detail/:id' component={LiquidarCuenta}/>
                    <Route exact path='/app/servicios/cuenta/detail/:id' component={CuentaDetail}/>
                    <Route exact path='/app/servicios/liquidacion/detail/:id' component={LiquidacionDetail}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
});
export default App;