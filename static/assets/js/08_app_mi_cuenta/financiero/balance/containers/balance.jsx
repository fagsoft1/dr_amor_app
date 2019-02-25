import React, {Component} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {connect} from "react-redux";
import ServiciosTabla from '../../ingresos/servicios/components/servicios_ingreso_tabla';
import PrestamosTabla from '../../egresos/prestamos/components/operacion_caja_egreso_tabla';
import ConsumosTiendaTabla from '../../egresos/gasto_tienda/componentes/consumos_tienda_tabla';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import {withStyles} from '@material-ui/core/styles';
import {pesosColombianos} from "../../../../00_utilities/common";
import Typography from '@material-ui/core/Typography';

class Balance extends Component {
    componentDidMount() {
        this.cargarDatos();
        this.state = {
            dialog_open: false
        };
    }

    cargarDatos() {
        const cargarComprasTienda = (tercero_id) => this.props.fetchMovimientoIntentariosDetalles_por_tercero_cuenta_abierta(tercero_id);
        const cargarOperacionesCaja = (tercero_id) => this.props.fetchOperacionesCajas_por_tercero_cuenta_abierta(tercero_id, {callback: () => cargarComprasTienda(tercero_id)});
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
        const {mi_cuenta, classes} = this.props;
        let {movimientos_inventarios_detalles, servicios, operaciones_caja} = this.props;
        movimientos_inventarios_detalles = mi_cuenta ? _.pickBy(
            movimientos_inventarios_detalles,
            e => (
                e.cuenta_usuario === mi_cuenta.id &&
                e.cuenta_liquidada === false &&
                e.cuenta_tipo === 1
            )
        ) : null;
        servicios = mi_cuenta ? _.pickBy(
            servicios,
            e => (
                e.cuenta_usuario === mi_cuenta.id &&
                e.cuenta_liquidada === false &&
                !e.anulado &&
                e.cuenta_tipo === 1
            )
        ) : null;
        operaciones_caja = mi_cuenta ? _.pickBy(
            operaciones_caja,
            e => (e.cuenta_usuario === mi_cuenta.id &&
                e.cuenta_liquidada === false &&
                e.tipo_operacion === 'E'
            )
        ) : null;

        const valor_total_servicios = _.sumBy(_.map(servicios), e => parseFloat(e.valor_servicio));
        const valor_total_consumo_tienda = _.sumBy(_.map(movimientos_inventarios_detalles, e => e), v => parseFloat(v.precio_venta_total));
        const valor_total_prestamos = _.sumBy(_.map(operaciones_caja, e => e), v => parseFloat(v.valor));
        const valor_total = valor_total_prestamos + valor_total_servicios + valor_total_consumo_tienda;

        return <div className={classes.root}>
            {
                _.size(servicios) > 0 &&
                <ServiciosTabla
                    classes={classes}
                    servicios={servicios}
                    valor_total_servicios={valor_total_servicios}
                />
            }
            {
                _.size(operaciones_caja) > 0 &&
                <PrestamosTabla
                    classes={classes}
                    operaciones_caja={operaciones_caja}
                    valor_total_prestamos={valor_total_prestamos}
                />
            }
            {
                _.size(movimientos_inventarios_detalles) > 0 &&
                <ConsumosTiendaTabla
                    classes={classes}
                    consumos_tienda={movimientos_inventarios_detalles}
                    valor_total_consumo_tienda={valor_total_consumo_tienda}
                />
            }
            {
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={null}>
                        <div className="row" style={{width: '100%'}}>
                            <div className="col-9">
                                <Typography className={classes.heading}>
                                    Total
                                </Typography>

                            </div>
                            <div className="col-3 text-right">
                                <Typography className={classes.heading}>
                                    {pesosColombianos(valor_total)}
                                </Typography>
                            </div>
                        </div>
                    </ExpansionPanelSummary>
                </ExpansionPanel>
            }
        </div>
    }
}

function mapPropsToState(state, ownProps) {
    return {
        operaciones_caja: state.operaciones_caja,
        servicios: state.servicios,
        mi_cuenta: state.mi_cuenta,
        movimientos_inventarios_detalles: state.movimientos_inventarios_detalles
    }
}

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    table: {
        minWidth: 700,
    },
});

export default withStyles(styles)(connect(mapPropsToState, actions)(Balance))