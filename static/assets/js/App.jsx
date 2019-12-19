import React, {Fragment, memo, useEffect, Suspense, lazy} from 'react';
import {hot} from 'react-hot-loader'
import {BrowserRouter, Switch, Route} from 'react-router-dom';
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
import orange from '@material-ui/core/colors/orange';


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
        primary: orange,
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
import {ProvideAuth, useAuth} from "./00_utilities/hooks";

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

import useRequireAuth from './00_utilities/hooks/useRequireAuth';

let ContainerRoot = () => {
    const dispatch = useDispatch();
    const authentication = useRequireAuth('/app/login');
    const {auth: {isAuthenticated, isLoading}} = authentication;
    useEffect(() => {
        if (isAuthenticated) {
            const cargarConfiguracionAplicacion = () => dispatch(actions.fetchConfiguracionAplicacion({
                callback: (response) => {
                    const {datos_generales} = response;
                    document.title = datos_generales.nombre_aplicacion;
                }
            }));
            dispatch(actions.fetchServerInformation({callback: cargarConfiguracionAplicacion}));
        }
    }, [isAuthenticated]);
    if (isLoading) {
        return <div>Esta cargando...</div>
    }
    if (!isAuthenticated) {
        return (
            <Switch>
                <Route path='/app/login' component={Login}/>
            </Switch>
        )
    }
    return (
        <Fragment>
            <Notification/>
            <RouteLocationManager/>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path='/app/login' component={Login}/>
                    <Route path='/app/mi_cuenta' component={MiCuenta}/>
                    <Route path='/app/admin' component={AppAdmin}/>
                    <Route path='/app/tienda' component={AppTienda}/>
                    <Route path='/app/parqueadero' component={AppParqueadero}/>
                    <Route path='/app/consultas' component={AppConsultas}/>
                    <Route path='/app/servicios' component={AppServicios}/>
                    <Route path='/app/cajas' component={AppCaja}/>
                    <Route path='/app/acceso' component={AppAcceso}/>
                    <Route path='/app' component={AppIndex}/>
                    <Route path='/' component={AppIndex}/>
                </Switch>
            </Suspense>
            <InfoUsuario/>
        </Fragment>
    )
};

ContainerRoot = hot(module)(ContainerRoot);

const App = () => {
    return (
        <Provider store={store}>
            <ProvideAuth>
                <MuiThemeProvider theme={theme}>
                    <StylesContextProvider>
                        <BrowserRouter>
                            <ContainerRoot/>
                        </BrowserRouter>
                    </StylesContextProvider>
                </MuiThemeProvider>
            </ProvideAuth>
        </Provider>
    )
};

export default App;