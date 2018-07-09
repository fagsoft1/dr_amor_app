import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import Menu from './00_menu/index';

import AccesoList from "./acceso/containers/acceso_list_container";
//import PuntoVenta from "./acceso/containers/punto_venta_pos";

const AdminApp = (props) => {
    return (
        <Loading>
            <Fragment>
                <Menu/>
                <div className="p-3">
                    <Switch>
                        <Route exact path='/app/acceso/' component={AccesoList}/>
                    </Switch>
                </div>
            </Fragment>
        </Loading>
    )
};

export default AdminApp;