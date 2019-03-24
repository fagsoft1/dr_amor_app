import React, {Fragment, Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import TrasladosPendientesTabla from '../components/traslados_inventarios_pendientes_tabla';
import Typography from '@material-ui/core/Typography';

class DashboarInventarios extends Component {
    componentDidMount() {
        this.cargarDatos();
    }

    cargarDatos() {
        const cargarTrasladosParaValidar = (bodega_id) => this.props.fetchTrasladosInventariosxBodegaDestino(bodega_id);
        this.props.fetchMiCuenta({callback: e => cargarTrasladosParaValidar(e.punto_venta_actual.bodega)});
    }

    render() {
        const {mi_cuenta, mi_cuenta: {punto_venta_actual}} = this.props;
        if (!mi_cuenta) {
            return <Fragment></Fragment>
        }
        let {traslados_inventarios} = this.props;
        traslados_inventarios = _.pickBy(
            traslados_inventarios,
            t => (
                t.bodega_destino = punto_venta_actual.bodega &&
                    !t.trasladado &&
                    t.estado === 2
            )
        );
        return (
            <div className='row'>
                {
                    _.size(traslados_inventarios) > 0 &&
                    <div className="col-12 col-md-6">
                        <Typography variant="h6" gutterBottom color="primary">
                            Traslados Pendientes
                        </Typography>
                        <table className='table table-striped table-responsive'>
                            <thead>

                            </thead>
                            <tbody>

                            </tbody>

                        </table>
                    </div>
                }
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mi_cuenta: state.mi_cuenta,
        traslados_inventarios: state.traslados_inventarios
    }
}

export default connect(mapPropsToState, actions)(DashboarInventarios)