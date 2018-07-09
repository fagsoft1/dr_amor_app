import React, {Fragment, Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import Menu from './00_menu/index';
import AppIndex from './index/dashboard/containers/dashboard';
import * as actions from "../01_actions/01_index";
import {connect} from "react-redux";

class App extends Component {
    render() {
        return (
            <Loading>
                <Fragment>
                    <Menu/>
                    <div className="p-3">
                        <Switch>
                            <Route exact path='/app/servicios/' component={AppIndex}/>
                        </Switch>
                    </div>
                </Fragment>
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