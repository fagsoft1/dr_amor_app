import React, {Fragment, Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import TrasladosPendientesTabla from '../components/traslados_inventarios_pendientes';

class DashboarInventarios extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    cargarDatos() {
        const cargarTrasladosParaValidar = (bodega_id) => this.props.fetchTrasladosInventariosxBodegaDestino(bodega_id);
        this.props.fetchMiCuenta({callback: e => cargarTrasladosParaValidar(e.punto_venta_actual.bodega)});
    }

    render() {
        const {
            mi_cuenta,
            mi_cuenta: {punto_venta_actual},
            traslados_inventarios,
            traslados_inventarios_detalles
        } = this.props;
        if (!mi_cuenta) {
            return <Fragment></Fragment>
        }
        return (
            <div className='row'>
                {
                    _.size(traslados_inventarios) > 0 &&
                    <TrasladosPendientesTabla
                        traslados_inventarios_detalles={traslados_inventarios_detalles}
                        traslados_inventarios={traslados_inventarios}
                        punto_venta_actual={punto_venta_actual}
                        cargarDatos={this.cargarDatos}
                        {...this.props}
                    />
                }
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mi_cuenta: state.mi_cuenta,
        traslados_inventarios: state.traslados_inventarios,
        traslados_inventarios_detalles: state.traslados_inventarios_detalles
    }
}

export default connect(mapPropsToState, actions)(DashboarInventarios)