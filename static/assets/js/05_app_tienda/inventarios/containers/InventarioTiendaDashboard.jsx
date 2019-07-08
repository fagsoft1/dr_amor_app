import React, {Fragment, Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../01_actions";
import TrasladosPendientesTabla from '../components/TrasladoInventarioPendiente';

class DashboarInventarios extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    cargarDatos() {
        const {auth: {user: {punto_venta_actual: {bodega}}}} = this.props;
        if (bodega) {
            this.props.fetchTrasladosInventariosxBodegaDestino(bodega);
        }
    }

    render() {
        const {
            auth: {user},
            auth: {user: {punto_venta_actual}},
            traslados_inventarios,
            traslados_inventarios_detalles
        } = this.props;
        if (!user) {
            return <Fragment></Fragment>
        }
        return (
            <div className='row'>
                {
                    _.size(traslados_inventarios) > 0 &&
                    <TrasladosPendientesTabla
                        {...this.props}
                        traslados_inventarios_detalles={traslados_inventarios_detalles}
                        traslados_inventarios={traslados_inventarios}
                        punto_venta_actual={punto_venta_actual}
                        cargarDatos={this.cargarDatos}
                    />
                }
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
        traslados_inventarios: state.traslados_inventarios,
        traslados_inventarios_detalles: state.traslados_inventarios_detalles
    }
}

export default connect(mapPropsToState, actions)(DashboarInventarios)