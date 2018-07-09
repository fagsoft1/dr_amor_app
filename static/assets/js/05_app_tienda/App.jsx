import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import Menu from './00_menu/index';

import App1 from "./tienda/containers/puntos_ventas_list";
import PuntoVenta from "./tienda/containers/punto_venta_pos";

const AdminApp = (props) => {
    return (
        <Loading>
            <Fragment>
                <Menu/>
                <div className="p-3">
                    <Switch>
                        <Route exact path='/app/tienda/' component={App1}/>
                        <Route exact path='/app/tienda/punto_venta/:id' component={PuntoVenta}/>
                    </Switch>
                </div>
            </Fragment>
        </Loading>
    )
};

export default AdminApp;