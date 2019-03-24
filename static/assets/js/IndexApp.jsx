import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "./01_actions/01_index";
import Loading from "./00_utilities/components/system/loading_overlay";
import {Link} from 'react-router-dom'
import {TIPOS_REGISTRO_INGRESO as permisos_view} from './00_utilities/permisos/types';
import {permisosAdapter} from "./00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import QrIdentificacion from './00_utilities/components/system/modal_qr_acceso';

const Boton = (props) => {
    const {nombre, icono, link, classes} = props;
    return (
        <div className={'col-6 col-md-4 mt-3'}>
            <Link to={link}>
                <div className={classes.bordeBoton}>
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
                </div>
            </Link>
        </div>
    )
};

class IndexApp extends Component {
    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view])
    }

    render() {
        const {classes, mi_cuenta, mi_cuenta: {punto_venta_actual}, mis_permisos} = this.props;
        const permisos_modulo_acceso = permisosAdapter(mis_permisos, permisos_view);
        return <Loading>
            <div className="mt-3">
                {
                    mi_cuenta.tercero &&
                    <QrIdentificacion/>
                }
                <div className="container text-center">
                    {
                        mi_cuenta &&
                        mi_cuenta.imagen_perfil_url &&
                        <div style={{
                            position: 'absolute',
                            top: -10,
                            right: 10
                        }}>
                            <Grid container justify="center" alignItems="center">
                                <Avatar alt="Remy Sharp" src={mi_cuenta.imagen_perfil_url}
                                        className={classes.bigAvatar}/>
                            </Grid>
                        </div>
                    }
                    <div className="row">
                        <div className="col-12 p-5">
                            <img width='400px' className='img-fluid' src={`${img_static_url}/logo.png`} alt=""/>
                        </div>
                        {
                            (mi_cuenta && (mi_cuenta.is_staff || mi_cuenta.is_superuser)) &&
                            <Boton
                                nombre='Admin'
                                link='/app/admin/'
                                icono='cogs'
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
                        {
                            punto_venta_actual &&
                            <Boton
                                nombre='Caja'
                                link='/app/cajas/'
                                icono='money-check-alt'
                                classes={classes}
                            />
                        }
                        <div className="col-4"></div>
                        <div className="col-4 boton-index mt-4">
                            <div className='icono puntero' onClick={() => this.props.logout()}>
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
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mi_cuenta: state.mi_cuenta,
        mis_permisos: state.mis_permisos,
    }
}

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
export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(IndexApp));