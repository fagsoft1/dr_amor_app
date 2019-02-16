import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import AppIndex from './index/dashboard/containers/dashboard';
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