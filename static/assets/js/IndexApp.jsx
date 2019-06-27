import React, {memo, Fragment, useState, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import * as actions from "./01_actions/01_index";
import Loading from "./00_utilities/components/system/LoadingOverlay";
import {Link} from 'react-router-dom'
import {TIPOS_REGISTRO_INGRESO as permisos_view} from './00_utilities/permisos/types';
import {permisosAdapter} from "./00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import QrIdentificacion from './00_utilities/components/system/modal_qr_acceso';
import AbrirPuntoVentaDialog from './07_cajas/apertura_de_caja/PuntoVentaAbrirForm';
import CerrarPuntoVentaDialog from './07_cajas/cierre_de_caja/punto_venta_cerrar';
import Button from "@material-ui/core/Button";
import PrinJs from 'print-js';

const Boton = memo((props) => {
    const {nombre, icono, link, classes, onClick = null} = props;
    const contenido = <div className={classes.bordeBoton}>
        <div className="row">
            <div className="col-12">
                <FontAwesomeIcon icon={['far', icono]} size='3x' className={classes.iconoBoton}/>
            </div>
            <div className="col-12">
                <Typography variant="h6" color="primary" noWrap>
                    {nombre}
                </Typography>
            </div>
        </div>
    </div>;
    if (!onClick) {
        return (
            <div className={'col-6 col-md-4 mt-3'}>
                <Link to={link}>
                    {contenido}
                </Link>
            </div>
        )
    }
    return (
        <div onClick={onClick} className={'col-6 col-md-4 mt-3 puntero'}>
            {contenido}
        </div>
    )
});


const IndexApp = memo((props) => {
    const {classes} = props;
    const [abrir_punto_venta, setAbrirPuntoVenta] = useState(false);
    const [cerrar_punto_venta, setCerrarPuntoVenta] = useState(false);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const {user: {username, punto_venta_actual}, user} = auth;
    const mis_permisos = useSelector(state => state.mis_permisos);
    const puntos_ventas = useSelector(state => state.puntos_ventas);
    const arqueos_cajas = useSelector(state => state.arqueos_cajas);
    const permisos_modulo_acceso = permisosAdapter(mis_permisos, permisos_view);
    useEffect(() => {
        const cargarPuntosVenta = () => dispatch(actions.fetchPuntosVentas_por_usuario_username(username));
        dispatch(actions.fetchMisPermisosxListado([permisos_view], {callback: cargarPuntosVenta}));
    }, []);


    const callback_impresiones_dos = (response) => {
        const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
        PrinJs(url);
    };

    const callback_impresiones = (response) => {
        const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
        window.open(url, "_blank");

    };

    console.log('RENDERIZO INDEX APP');

    const imprimirEntrega = (arqueo) => dispatch(actions.printArqueosCajas(arqueo.id, {callback: callback_impresiones_dos}));

    return <Loading>
        <div className="mt-3">
            {
                abrir_punto_venta &&
                <AbrirPuntoVentaDialog
                    modal_open={abrir_punto_venta}
                    onCancel={() => setAbrirPuntoVenta(false)}
                    onSubmit={(v) => {
                        const callback = () => dispatch(actions.loadUser({callback: () => setAbrirPuntoVenta(false)}));
                        dispatch(actions.abrirPuntoVenta(v.punto_venta_id, v.base_inicial_efectivo, {callback}));
                    }}
                    puntos_venta_list={puntos_ventas}
                />
            }
            {
                cerrar_punto_venta &&
                <CerrarPuntoVentaDialog
                    modal_open={cerrar_punto_venta}
                    onCancel={() => setCerrarPuntoVenta(false)}
                    onSubmit={(v) => {
                        console.log(v)
                    }}
                />
            }
            {
                user.tercero &&
                <QrIdentificacion/>
            }
            <div className="container text-center">
                <Button
                    color="secondary"
                    variant="contained"
                    className='ml-3'
                    onClick={() => dispatch(actions.fetchMiUltimoArqueoCaja({callback: imprimirEntrega}))}
                >
                    Imprimir
                </Button>
                {
                    user &&
                    user.imagen_perfil_url &&
                    <div style={{
                        position: 'absolute',
                        top: -10,
                        right: 10
                    }}>
                        <Grid container justify="center" alignItems="center">
                            <Avatar alt="Remy Sharp" src={user.imagen_perfil_url}
                                    className={classes.bigAvatar}/>
                        </Grid>
                    </div>
                }
                <div className="row">
                    <div className="col-12 p-5">
                        <img width='400px' className='img-fluid' src={`${img_static_url}/logo.png`} alt=""/>
                    </div>
                    {
                        (user && (user.is_staff || user.is_superuser)) &&
                        <Boton
                            nombre='Admin'
                            link='/app/admin/'
                            icono='cogs'
                            classes={classes}
                        />
                    }
                    {
                        _.size(puntos_ventas) > 0 &&
                        !punto_venta_actual &&
                        <Boton
                            onClick={() => setAbrirPuntoVenta(true)}
                            nombre='Abrir Punto Venta'
                            link={`/app/tienda/`}
                            icono='shopping-cart'
                            classes={classes}
                        />
                    }
                    {
                        punto_venta_actual &&
                        //punto_venta_actual.abierto &&
                        <Fragment>
                            {
                                punto_venta_actual.tipo === 2 &&
                                <Boton
                                    nombre='Tienda'
                                    link={`/app/tienda/`}
                                    icono='shopping-cart'
                                    classes={classes}
                                />
                            }
                            {
                                punto_venta_actual.tipo === 1 &&
                                <Boton
                                    nombre='Servicios'
                                    link='/app/servicios/'
                                    icono='bed'
                                    classes={classes}
                                />
                            }
                            {
                                punto_venta_actual.tipo === 3 &&
                                <Boton
                                    nombre='Parqueadero'
                                    link='/app/parqueadero/'
                                    icono='car'
                                    classes={classes}
                                />
                            }
                        </Fragment>
                    }
                    {
                        permisos_modulo_acceso.add &&
                        <Boton
                            nombre='Acceso'
                            link='/app/acceso/'
                            icono='user-lock'
                            classes={classes}
                        />
                    }
                    <Boton
                        nombre='Mi Cuenta'
                        link='/app/mi_cuenta/'
                        icono='sliders-h'
                        classes={classes}
                    />
                    <Boton
                        nombre='Consultas'
                        link='/app/consultas/'
                        icono='search'
                        classes={classes}
                    />
                    {
                        punto_venta_actual &&
                        <Boton
                            nombre='Caja'
                            link='/app/cajas/'
                            icono='money-check-alt'
                            classes={classes}
                        />
                    }
                    {
                        punto_venta_actual &&
                        <Boton
                            nombre='Cerrar Caja'
                            onClick={() => setCerrarPuntoVenta(true)}
                            icono='door-open'
                            classes={classes}
                        />
                    }
                    <div className="col-4"></div>
                    <div className="col-4 boton-index mt-4">
                        <div className='icono puntero' onClick={() => dispatch(actions.logout())}>
                            <div className="row">
                                <div className="col-12">
                                    <FontAwesomeIcon
                                        icon={['far', 'sign-out-alt']}
                                        className={classes.iconoBoton}
                                    />
                                </div>
                                <div className="col-12">
                                    <Typography variant="h6" color="primary" noWrap>
                                        Salir
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-4"></div>
                </div>
            </div>
        </div>
    </Loading>
});

const styles = theme => (
    {
        iconoBoton: {
            color: theme.palette.primary.dark
        },
        bordeBoton: {
            borderRadius: '25px',
            border: `2px solid ${theme.palette.primary.dark}`,
            padding: '1rem',
            width: '100%'
        },
        bigAvatar: {
            width: 75,
            height: 75,
            border: `2px solid ${theme.palette.primary.main}`
        }
    })
;
export default withStyles(styles, {withTheme: true})(IndexApp);