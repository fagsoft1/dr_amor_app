import React, {memo, Fragment, useState, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import * as actions from "./01_actions";
import Loading from "./00_utilities/components/system/LoadingOverlay";
import {Link} from 'react-router-dom'
import {MODULO_PERMISSIONS, TIPOS_REGISTRO_INGRESO as permisos_view} from './permisos';
import {permisosAdapter} from "./00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {makeStyles} from "@material-ui/core/styles/index";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import QrIdentificacion from './00_utilities/components/system/ModalQrAcceso';
import AbrirPuntoVentaDialog from './07_cajas/apertura_de_caja/PuntoVentaAbrirForm';
import CerrarPuntoVentaDialog from './07_cajas/cierre_de_caja/punto_venta_cerrar';
import Button from "@material-ui/core/Button";
import PrinJs from 'print-js';
import useTengoPermisos from "./00_utilities/hooks/useTengoPermisos";
import Logo from './00_utilities/components/ui/Logo';

const useStyles = makeStyles(theme => ({
    boton: {
        borderRadius: '25px',
        border: `2px solid ${theme.palette.primary.dark}`,
        padding: '1rem',
        width: '100%',
        marginTop: '1rem',
        color: theme.palette.primary.dark,
        '&:hover': {
            border: `2px solid transparent`,
            backgroundColor: theme.palette.primary.main,
            color: 'white'
        },
        '&:active': {
            padding: '0.5rem',
            margin: '0.5rem',
            marginTop: '1.5rem',
            border: `2px solid transparent`,
            backgroundColor: theme.palette.secondary.main,
            color: 'white'
        }
    },
    bigAvatar: {
        width: 70,
        height: 70,
        border: `2px solid ${theme.palette.primary.main}`,
        '&:hover': {
            width: 80,
            height: 80,
        }
    }
}));

const Boton = memo((props) => {
    const classes = useStyles();
    const {nombre, icono, link, onClick = null} = props;
    const contenido = <div className={classes.boton}>
        <div className="row">
            <div className="col-12">
                <FontAwesomeIcon icon={['far', icono]} size='2x'/>
            </div>
            <div className="col-12">
                <Typography variant="h6" noWrap>
                    {nombre}
                </Typography>
            </div>
        </div>
    </div>;
    if (!onClick) {
        return (
            <div className={'col-6 col-sm-4 col-md-4 col-lg-2'}>
                <Link to={link}>
                    {contenido}
                </Link>
            </div>
        )
    }
    return (
        <div onClick={onClick} className={'col-6 col-sm-4 col-md-4 col-lg-2 puntero'}>
            {contenido}
        </div>
    )
});


const IndexApp = memo((props) => {
    const classes = useStyles();
    const permisos_modulos = useTengoPermisos(MODULO_PERMISSIONS);
    const {
        modulo_admin,
        modulo_acceso,
        modulo_consultas,
        modulo_mi_cuenta,
    } = permisos_modulos;
    const [abrir_punto_venta, setAbrirPuntoVenta] = useState(false);
    const [cerrar_punto_venta, setCerrarPuntoVenta] = useState(false);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const {user: {username, punto_venta_actual}, user} = auth;
    const mis_permisos = useSelector(state => state.mis_permisos);
    const puntos_ventas = useSelector(state => state.puntos_ventas);
    const arqueos_cajas = useSelector(state => state.arqueos_cajas);
    const permisos_modulo_acceso = permisosAdapter(mis_permisos, permisos_view);
    const configuracion_aplicacion = useSelector(state => state.configuracion_aplicacion);
    const {datos_generales} = configuracion_aplicacion;

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
            {abrir_punto_venta && <AbrirPuntoVentaDialog
                modal_open={abrir_punto_venta}
                onCancel={() => setAbrirPuntoVenta(false)}
                onSubmit={(v) => {
                    const callback = () => dispatch(actions.loadUser({callback: () => setAbrirPuntoVenta(false)}));
                    dispatch(actions.abrirPuntoVenta(v.punto_venta_id, v.base_inicial_efectivo, {callback}));
                }}
                puntos_venta_list={puntos_ventas}
            />}
            {cerrar_punto_venta && <CerrarPuntoVentaDialog
                modal_open={cerrar_punto_venta}
                onCancel={() => setCerrarPuntoVenta(false)}
                onSubmit={(v) => {
                    console.log(v)
                }}
            />}
            {user.tercero && <QrIdentificacion/>}
            <div className="container text-center">
                <Button
                    color="secondary"
                    variant="contained"
                    className='ml-3'
                    onClick={() => dispatch(actions.fetchMiUltimoArqueoCaja({callback: imprimirEntrega}))}
                >
                    Imprimir
                </Button>
                {user && user.imagen_perfil_url && <div style={{
                    position: 'absolute',
                    top: -10,
                    right: 10
                }}>
                    <Grid container justify="center" alignItems="center">
                        <Avatar alt="Remy Sharp" src={user.imagen_perfil_url}
                                className={classes.bigAvatar}/>
                    </Grid>
                </div>}
                <div className="row">
                    <div className="col-12 p-5">
                        <Logo/>
                    </div>
                    {modulo_admin && <Boton
                        nombre='Admin'
                        link='/app/admin/'
                        icono='cogs'
                    />}
                    {_.size(puntos_ventas) > 0 && !punto_venta_actual && <Boton
                        onClick={() => setAbrirPuntoVenta(true)}
                        nombre='Abrir Punto Venta'
                        link={`/app/tienda/`}
                        icono='shopping-cart'
                    />}
                    {punto_venta_actual &&
                    //punto_venta_actual.abierto &&
                    <Fragment>
                        {<Boton
                            nombre='Tienda'
                            link={`/app/tienda/`}
                            icono='shopping-cart'
                        />}
                        {punto_venta_actual.tipo === 1 && <Boton
                            nombre='Servicios'
                            link='/app/servicios/'
                            icono='bed'
                        />}
                        {punto_venta_actual.tipo === 3 && <Boton
                            nombre='Parqueadero'
                            link='/app/parqueadero/'
                            icono='car'
                        />}
                    </Fragment>}
                    {modulo_acceso && <Boton
                        nombre='Acceso'
                        link='/app/acceso/'
                        icono='user-lock'
                    />}
                    {modulo_mi_cuenta && <Boton
                        nombre='Mi Cuenta'
                        link='/app/mi_cuenta/'
                        icono='sliders-h'
                    />}
                    {modulo_consultas && <Boton
                        nombre='Consultas'
                        link='/app/consultas/'
                        icono='search'
                    />}
                    {punto_venta_actual && <Boton
                        nombre='Caja'
                        link='/app/cajas/'
                        icono='money-check-alt'
                    />}
                    {punto_venta_actual && <Boton
                        nombre='Cerrar Caja'
                        onClick={() => setCerrarPuntoVenta(true)}
                        icono='door-open'
                    />}
                    <div className="col-12 boton-index mt-4">
                        <div className='icono puntero' onClick={() => dispatch(actions.logout())}>
                            <div className="row">
                                <div className="col-12">
                                    <FontAwesomeIcon
                                        icon={['far', 'sign-out-alt']}
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

export default IndexApp;