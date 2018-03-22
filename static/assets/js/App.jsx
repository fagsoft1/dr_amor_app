import React, {Fragment} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';
import reducers from './02_reducers/index';
import {Notify} from 'react-redux-notify';

import 'react-redux-notify/dist/ReactReduxNotify.css';
import "react-table/react-table.css";
import 'react-widgets/dist/css/react-widgets.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'tether/dist/js/tether';
import 'bootstrap/dist/js/bootstrap';
import './../../css/custom.css';

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const createStoreWithMiddleware = applyMiddleware(ReduxPromise, thunk)(createStore);
const store = configureStore();

function configureStore() {
    const store = createStoreWithMiddleware(reducers);
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./02_reducers', () => {
            const nextRootReducer = require('./02_reducers/index').default;
            store.replaceReducer(nextRootReducer);
        });
    }
    return store;
}

import AppIndex from './IndexApp';
import AppAdmin from './03_app_admin/App';
import AppTienda from './05_app_tienda/App';
import AppServicios from './04_app_servicios/App';

const App = () => {
    return (
        <Provider store={store}>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <BrowserRouter>
                    <Fragment>
                        <Notify/>
                        <Switch>
                            <Route exact path='/' component={AppIndex}/>
                            <Route exact path='/app' component={AppIndex}/>
                            <Route path='/app/admin' component={AppAdmin}/>
                            <Route path='/app/tienda' component={AppTienda}/>
                            <Route path='/app/servicios' component={AppServicios}/>
                        </Switch>
                    </Fragment>
                </BrowserRouter>
            </MuiThemeProvider>
        </Provider>
    )
};

export default App;