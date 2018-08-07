import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "./01_actions/01_index";
import Loading from "./00_utilities/components/system/loading_overlay";
import {Link} from 'react-router-dom'
import {TIPOS_REGISTRO_INGRESO} from './00_utilities/permisos/types';
import {permisosAdapter} from "./00_utilities/common";

const Boton = (props) => {
    const {nombre, icono, link} = props;
    return (
        <div className='col-6 col-md-4 mt-3 boton-index'>
            <Link to={link}>
                <div className='icono'>
                    <div className="row">
                        <div className="col-12"><i className={`fas ${icono} fa-3x`}></i></div>
                        <div className="col-12">{nombre}</div>
                    </div>
                </div>
            </Link>
        </div>
    )
};

class IndexApp extends Component {
    render() {
        const {auth: {punto_venta, mi_cuenta}} = this.props;
        const permisos_modulo_acceso = permisosAdapter(TIPOS_REGISTRO_INGRESO);
        return <Loading>
            <div className="mt-3">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-12 p-5">
                            <img className='img-fluid' src={`${img_static_url}/logo.png`} alt=""/>
                        </div>
                        {
                            (mi_cuenta && (mi_cuenta.is_staff || mi_cuenta.is_superuser)) &&
                            <Boton
                                nombre='Admin'
                                link='/app/admin/'
                                icono='fa-cogs'
                            />
                        }
                        {
                            punto_venta &&
                            <Fragment>
                                {
                                    punto_venta.tipo === 2 &&
                                    <Boton
                                        nombre='Tienda'
                                        link='/app/tienda/'
                                        icono='fa-shopping-cart'
                                    />
                                }
                                {
                                    punto_venta.tipo === 1 &&
                                    <Boton
                                        nombre='Servicios'
                                        link='/app/servicios/'
                                        icono='fa-bed'
                                    />
                                }
                            </Fragment>
                        }
                        {
                            permisos_modulo_acceso.add &&
                            <Boton
                                nombre='Acceso'
                                link='/app/acceso/'
                                icono='fa-user-lock'
                            />
                        }
                        <Boton
                            nombre='Mi Cuenta'
                            link='/app/mi_cuenta/'
                            icono='fa-sliders-h'
                        />
                        {
                            punto_venta &&
                            <Boton
                                nombre='Caja'
                                link='/app/cajas/'
                                icono='fa-money-check-alt'
                            />
                        }
                        <div className="col-4"></div>
                        <div className="col-4 boton-index mt-4">
                            <div className='icono puntero' onClick={() => {
                                if (punto_venta && punto_venta.id) {
                                    const callback = () => {
                                        this.props.logout();
                                    };
                                    this.props.updatePuntoVenta(punto_venta.id, {
                                            ...punto_venta,
                                            usuario_actual: null,
                                            abierto: false
                                        },
                                        {callback}
                                    )
                                }
                                else {
                                    this.props.logout();
                                }
                            }}>
                                <div className="row">
                                    <div className="col-12"><i className={`fas fa-sign-out-alt`}></i></div>
                                    <div className="col-12">Salir</div>
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

export default connect(mapPropsToState, actions)(IndexApp);