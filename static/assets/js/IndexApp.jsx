import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "./01_actions/01_index";
import Loading from "./00_utilities/components/system/loading_overlay";
import CargarDatos from "./00_utilities/components/system/cargar_datos";
import {Link} from 'react-router-dom'

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
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos()
    }

    cargarDatos() {
        const {notificarErrorAjaxAction, cargando, noCargando} = this.props;
        cargando();
        this.props.fetchMiCuenta(() => noCargando(), notificarErrorAjaxAction);
    }

    render() {
        const {mi_cuenta: {is_staff, is_superuser}} = this.props;
        return <Loading>
            <div className="mt-3">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-12 p-5">
                            <img className='img-fluid' src={`${img_static_url}/logo.png`} alt=""/>
                        </div>
                        {
                            (is_staff || is_superuser) &&
                            <Boton
                                nombre='Admin'
                                link='/app/admin/'
                                icono='fa-cogs'
                            />
                        }
                        <Boton
                            nombre='Tienda'
                            link='/app/tienda/'
                            icono='fa-shopping-cart'
                        />
                        <Boton
                            nombre='Servicios'
                            link='/app/servicios/'
                            icono='fa-bed'
                        />
                        <div className="col-4"></div>
                        <div className="col-4 boton-index mt-4">
                            <a href="/accounts/logout/?next=/">
                                <div className='icono'>
                                    <div className="row">
                                        <div className="col-12"><i className={`fas fa-sign-out-alt`}></i></div>
                                        <div className="col-12">Salir</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-4"></div>
                        <CargarDatos cargarDatos={this.cargarDatos}/>
                    </div>
                </div>
            </div>
        </Loading>
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        mi_cuenta: state.mi_cuenta
    }
}

export default connect(mapPropsToState, actions)(IndexApp);