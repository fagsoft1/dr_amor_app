import React, {Component} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {connect} from "react-redux";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import ServiciosTabla from '../../ingresos/servicios/components/servicios_ingreso_tabla';
import PrestamosTabla from '../../egresos/prestamos/components/operacion_caja_egreso_tabla';
import Grid from '@material-ui/core/Grid';


class Balance extends Component {
    componentDidMount() {
        this.cargarDatos();
        this.state = {
            dialog_open: false
        };
    }

    cargarDatos() {
        const cargarOperacionesCaja = (tercero_id) => this.props.fetchOperacionesCajas_por_tercero_cuenta_abierta(tercero_id);
        const cargarServicios = (tercero_id) => {
            if (tercero_id) {
                this.props.fetchServicios_por_tercero_cuenta_abierta(
                    tercero_id,
                    {callback: () => cargarOperacionesCaja(tercero_id)}
                )
            }
        };
        this.props.fetchMiCuenta({callback: res => cargarServicios(res.tercero)});
    }

    render() {
        const {servicios, operaciones_caja} = this.props;
        return <Grid container spacing={24}>
            {
                _.size(servicios) > 0 &&
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <ServiciosTabla
                        servicios={servicios}
                    />
                </Grid>
            }
            {
                _.size(operaciones_caja) > 0 &&
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <PrestamosTabla
                        operaciones_caja={operaciones_caja}
                    />
                </Grid>
            }
        </Grid>
    }
}

function mapPropsToState(state, ownProps) {
    return {
        operaciones_caja: state.operaciones_caja,
        servicios: state.servicios,
        mi_cuenta: state.mi_cuenta
    }
}

export default connect(mapPropsToState, actions)(Balance)