import React, {Fragment, Component} from 'react';
import {hot} from 'react-hot-loader'
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';
import reducers from './02_reducers/index';
import {Notify} from 'react-redux-notify';
import {connect} from "react-redux";
import * as actions from "./01_actions/01_index";
import NotFound from "./00_utilities/components/system/no_found_page";

import 'react-redux-notify/dist/ReactReduxNotify.css';
import "react-table/react-table.css";
import 'react-widgets/dist/css/react-widgets.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import './../../css/custom.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckSquare, faCoffee, far} from '@fortawesome/pro-regular-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/pro-solid-svg-icons';
import {fal} from '@fortawesome/pro-light-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';

library.add(fab, fal, far, fas);

import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import indigo from '@material-ui/core/colors/indigo';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        fontSize: 12,
    },
    palette: {
        primary: green,
        secondary: indigo,
        error: orange,
        // Used by `getContrastText()` to maximize the contrast between the background and
        // the text.
        contrastThreshold: 3,
        // Used to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
    },
});


import {WebSocketAPI} from './ws_api';

const createStoreWithMiddleware = applyMiddleware(ReduxPromise, thunk)(createStore);
const store = configureStore();

function configureStore() {
    const store = createStoreWithMiddleware(reducers);
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        console.log('entro aqui')
        module.hot.accept('./02_reducers', () => {
            const nextRootReducer = require('./02_reducers/index').default;
            store.replaceReducer(nextRootReducer);
        });
    }
    WebSocketAPI.connect();
    WebSocketAPI.listen(store);
    return store;
}

import AppIndex from './IndexApp';
import AppAdmin from './03_app_admin/App';
import AppTienda from './05_app_tienda/App';
import AppServicios from './04_app_servicios/App';
import AppCaja from './07_cajas/App';
import AppAcceso from './06_app_acceso/App';
import Login from './authentication/login/containers/login';
import MiCuenta from './authentication/mi_cuenta/seguridad/containers/dashboard';

class RootContainerComponent extends Component {
    componentDidMount() {
        this.props.loadUser();
    }

    PrivateRoute = ({component: ChildComponent, ...rest}) => {
        return <Route {...rest} render={props => {
            if (this.props.auth.isLoading) {
                return <em>Loading...</em>;
            } else if (!this.props.auth.isAuthenticated) {
                return <Redirect to="/app/login"/>;
            } else {
                return <ChildComponent {...props} />
            }
        }}/>
    };

    render() {
        let {PrivateRoute} = this;
        const {auth: {mi_cuenta, punto_venta}} = this.props;
        return (
            <BrowserRouter>
                <Fragment>
                    <Notify/>
                    <Switch>
                        <PrivateRoute exact path="/" component={AppIndex}/>
                        <PrivateRoute exact path='/app' component={AppIndex}/>
                        <Route path='/app/login' component={Login}/>
                        <PrivateRoute path='/app/mi_cuenta' component={MiCuenta}/>
                        <PrivateRoute path='/app/admin' component={AppAdmin}/>
                        <PrivateRoute path='/app/tienda' component={AppTienda}/>
                        <PrivateRoute path='/app/servicios' component={AppServicios}/>
                        <PrivateRoute path='/app/cajas' component={AppCaja}/>
                        <PrivateRoute path='/app/acceso' component={AppAcceso}/>
                        <PrivateRoute component={NotFound}/>
                    </Switch>
                    <div style={{
                        position: 'fixed',
                        left: 10,
                        bottom: 10,
                        borderRadius: '10px',
                        border: 'solid black 2px',
                        padding: '2px',
                        backgroundColor: 'white'
                    }}>
                        {
                            punto_venta &&
                            punto_venta.nombre &&
                            <Fragment>
                                <strong>Punto de Venta: </strong>
                                <small>{punto_venta.nombre}</small>
                                <br/>
                            </Fragment>
                        }
                        {
                            mi_cuenta &&
                            <Fragment>
                                <strong>Usuario: </strong>
                                <small>{mi_cuenta.username}</small>
                            </Fragment>
                        }
                    </div>
                </Fragment>
            </BrowserRouter>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
    }
}

let RootContainer = hot(module)(connect(mapPropsToState, actions)(RootContainerComponent));


export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <RootContainer/>
                </MuiThemeProvider>
            </Provider>
        )
    }
}