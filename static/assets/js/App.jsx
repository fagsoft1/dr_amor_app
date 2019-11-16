import React, {Fragment, memo, useEffect, Suspense, lazy} from 'react';
import {hot} from 'react-hot-loader'
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';
import reducers from './02_reducers/index';
import {useSelector, useDispatch} from "react-redux";
import * as actions from "./01_actions";
import NotFound from "./00_utilities/components/system/no_found_page";
import Notification from './00_utilities/components/system/Notifications';
import RouteLocationManager from './00_utilities/components/system/RouteLocationManager';

import StylesContextProvider from './00_utilities/contexts/StylesContextProvider';

import "react-table/react-table.css";
import 'react-widgets/dist/css/react-widgets.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import './../../css/custom.css';
import {far} from '@fortawesome/pro-regular-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core'

library.add(far);

import {createMuiTheme, makeStyles, MuiThemeProvider} from '@material-ui/core/styles';

import indigo from '@material-ui/core/colors/indigo';
import red from '@material-ui/core/colors/red';
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
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
});


import {WebSocketAPI} from './ws_api';

const createStoreWithMiddleware = applyMiddleware(ReduxPromise, thunk)(createStore);
const store = configureStore();

function configureStore() {
    const store = createStoreWithMiddleware(reducers);
    if (module.hot) {
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

const AppAdmin = lazy(() => import('./03_app_admin/App'));
const AppTienda = lazy(() => import('./05_app_tienda/App'));
const AppServicios = lazy(() => import('./04_app_servicios/App'));
const AppParqueadero = lazy(() => import('./10_app_parqueadero/App'));
const AppCaja = lazy(() => import('./07_cajas/App'));
const AppAcceso = lazy(() => import('./06_app_acceso/App'));
const AppConsultas = lazy(() => import('./09_app_consultas/App'));
const MiCuenta = lazy(() => import('./08_app_mi_cuenta/App'));
import Login from './authentication/login/Login';

const useStyles = makeStyles(theme => ({
        info_usuario: {
            fontSize: '0.8rem',
            position: 'fixed',
            right: 10,
            bottom: 10,
            borderRadius: '5px',
            border: `solid ${theme.palette.primary.main} 2px`,
            color: `${theme.palette.primary.main}`,
            padding: '2px',
            backgroundColor: 'white'
        }
    })
);


const InfoUsuario = memo(() => {
    const auth = useSelector(state => state.auth);
    const classes = useStyles();
    const {user} = auth;
    if (!user) {
        return <Fragment></Fragment>
    }
    return (
        <div className={classes.info_usuario}>
            {
                user &&
                user.punto_venta_actual &&
                user.punto_venta_actual.nombre &&
                <Fragment>
                    <strong>Punto de Venta: </strong>
                    <small>{user.punto_venta_actual.nombre}</small>
                    <br/>
                </Fragment>
            }
            {
                user &&
                <Fragment>
                    <strong>Usuario: </strong>{user.username}
                </Fragment>
            }
        </div>
    )
});

const PrivateRoute = ({component: ChildComponent, ...rest}) => {
    const auth = useSelector(state => state.auth);
    return <Route {...rest} render={props => {
        if (auth.isLoading) {
            return <em>Loading...</em>;
        } else if (!auth.isAuthenticated) {
            return <Redirect to="/app/login"/>;
        } else {
            return <ChildComponent {...props} />
        }
    }}/>
};

let ContainerRoot = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.loadUser());
    });
    return (
        <BrowserRouter>
            <Fragment>
                <Notification/>
                <RouteLocationManager/>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <PrivateRoute exact path="/" component={AppIndex}/>
                        <PrivateRoute exact path='/app' component={AppIndex}/>
                        <Route path='/app/login' component={Login}/>
                        <PrivateRoute path='/app/mi_cuenta' component={MiCuenta}/>
                        <PrivateRoute path='/app/admin' component={AppAdmin}/>
                        <PrivateRoute path='/app/tienda' component={AppTienda}/>
                        <PrivateRoute path='/app/parqueadero' component={AppParqueadero}/>
                        <PrivateRoute path='/app/consultas' component={AppConsultas}/>
                        <PrivateRoute path='/app/servicios' component={AppServicios}/>
                        <PrivateRoute path='/app/cajas' component={AppCaja}/>
                        <PrivateRoute path='/app/acceso' component={AppAcceso}/>
                        <PrivateRoute component={NotFound}/>
                    </Switch>
                </Suspense>
                <InfoUsuario/>
            </Fragment>
        </BrowserRouter>
    )
};

ContainerRoot = hot(module)(ContainerRoot);

const App = () => {
    return (
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <StylesContextProvider>
                    <ContainerRoot/>
                </StylesContextProvider>
            </MuiThemeProvider>
        </Provider>
    )
};

export default App;