import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "./01_actions/01_index";
import Loading from "./00_utilities/components/system/loading_overlay";
import {Link} from 'react-router-dom'
import {TIPOS_REGISTRO_INGRESO} from './00_utilities/permisos/types';
import {permisosAdapter} from "./00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Typography from '@material-ui/core/Typography';

const Boton = (props) => {
    const {nombre, icono, link, classes} = props;
    return (
        <div className={'col-6 col-md-4 mt-3'}>
            <Link to={link}>
                <div className={classes.bordeBoton}>
                    <div className="row">
                        <div className="col-12">
                            <FontAwesomeIcon icon={['fas', icono]} size='3x' className={classes.iconoBoton}/>
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
    render() {
        const {auth: {punto_venta, mi_cuenta}, classes} = this.props;
        const permisos_modulo_acceso = permisosAdapter(TIPOS_REGISTRO_INGRESO);
        return <Loading>
            <div className="mt-3">
                <div className="container text-center">
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
                            punto_venta &&
                            //punto_venta.abierto &&
                            <Fragment>
                                {
                                    punto_venta.tipo === 2 &&
                                    <Boton
                                        nombre='Tienda'
                                        link='/app/tienda/'
                                        icono='shopping-cart'
                                        classes={classes}
                                    />
                                }
                                {
                                    punto_venta.tipo === 1 &&
                                    <Boton
                                        nombre='Servicios'
                                        link='/app/servicios/'
                                        icono='bed'
                                        classes={classes}
                                    />
                                }
                                <Boton
                                    nombre='Servicios'
                                    link='/app/servicios/'
                                    icono='bed'
                                    classes={classes}
                                />
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
                            punto_venta &&
                            <Boton
                                nombre='Caja'
                                link='/app/cajas/'
                                icono='money-check-alt'
                                classes={classes}
                            />
                        }
                        <div className="col-4"></div>
                        <div className="col-4 boton-index mt-4">
                            <div className='icono puntero' onClick={() => {
                                if (punto_venta && punto_venta.id) {
                                    const callback = (pdv) => {
                                        if (pdv.abierto) {
                                            this.props.notificarErrorAction('Debe cerrar caja primero')
                                        } else {
                                            this.props.logout();
                                        }
                                    };
                                    this.props.fetchPuntoVenta(punto_venta.id, {callback})
                                }
                            }}>
                                <div className="row">
                                    <div className="col-12">
                                        <FontAwesomeIcon
                                            icon={['fas', 'sign-out-alt']}
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
        auth: state.auth,
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
        }
    })
;
export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(IndexApp));