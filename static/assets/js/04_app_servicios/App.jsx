import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import AppIndex from './index/dashboard/containers/dashboard';
import CuentaDetail from '../07_cajas/cuentas/cuenta_detail';
import LiquidacionDetail from '../07_cajas/liquidar_cuenta/liquidacion_detail';
import LiquidarCuenta from '../07_cajas/liquidar_cuenta/liquidacion_acompanante/liquidar_cuenta_acompanante';
import * as actions from "../01_actions/01_index";
import {connect} from "react-redux";
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

class App extends Component {
    render() {
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
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(App)