import React, {Component, Fragment} from 'react';
import {LIQUIDACIONES_CUENTAS as permisos_view} from "../../00_utilities/permisos/types";
import {connect} from "react-redux";
import * as actions from "../../01_actions/01_index";
import {fechaHoraFormatoUno, permisosAdapter, pesosColombianos} from "../../00_utilities/common";
import ValidarPermisos from "../../00_utilities/permisos/validar_permisos";
import DetalleCuenta from '../cuentas/cuenta_conceptos';
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PrinJs from 'print-js';
import Button from "@material-ui/core/Button";

class LiquidacionDetail extends Component {
    constructor(props) {
        super(props);
        this.imprimirComprobante = this.imprimirComprobante.bind(this);
    }

    cargarDatos(id = null, callback = null) {
        if (!id) {
            id = this.props.match.params.id;
        }
        const cargarCuenta = (res) => this.props.fetchTerceroCuenta(res.cuenta, {callback});
        this.props.fetchLiquidacionCuenta(id, {callback: cargarCuenta})
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos()});
    }

    imprimirComprobante() {
        const {id} = this.props.match.params;
        const imprimir_liquidacion = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            PrinJs(url);
        };
        this.props.printComprobanteLiquidacionCuenta(id, {callback: imprimir_liquidacion});

    }

    irSiguienteLiquidacionTercero() {
        const {object: {liquidacion_siguiente}} = this.props;
        this.cargarDatos(liquidacion_siguiente, () => this.props.history.push(`/app/servicios/liquidacion/detail/${liquidacion_siguiente}`));
    }

    irAnteriorLiquidacionTercero() {
        const {object: {liquidacion_anterior}} = this.props;
        this.cargarDatos(liquidacion_anterior, () => this.props.history.push(`/app/servicios/liquidacion/detail/${liquidacion_anterior}`));
    }

    render() {
        const {mis_permisos, object, cuentas} = this.props;
        if (!object) {
            return <div>Cargando...</div>
        }
        const {liquidacion_siguiente, liquidacion_anterior} = object;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        return <ValidarPermisos can_see={permisos.view} nombre='Liquidación Cuenta'>
            <div className="row">
                {
                    cuentas &&
                    cuentas[object.cuenta] &&
                    <Fragment>
                        <div className="col-12">
                            <Typography variant="h4" gutterBottom color="primary">
                                Liquidación Nro. {object.id} para {cuentas[object.cuenta].nombre}
                            </Typography>
                        </div>
                        <div className="col-12 text-center">
                            <Button
                                disabled={!liquidacion_anterior}
                                color="primary"
                                onClick={() => this.irAnteriorLiquidacionTercero()}
                            >
                                Anterior Nr.{liquidacion_anterior}
                            </Button>
                            <Button
                                color="primary"
                                disabled={!liquidacion_siguiente}
                                onClick={() => this.irSiguienteLiquidacionTercero()}
                            >
                                Siguiente Nr.{liquidacion_siguiente}
                            </Button>
                        </div>
                        <div className="col-12 col-md-8">
                            Total pagado: {pesosColombianos(object.pagado)}<br/>
                            Saldo que pasa: {pesosColombianos(object.saldo)}
                        </div>
                        <div className="col-12 col-md-4">
                            <FontAwesomeIcon
                                className='puntero'
                                icon={['far', 'print']}
                                size='2x'
                                onClick={() => this.imprimirComprobante()}
                            />
                        </div>
                        <DetalleCuenta cuenta={cuentas[object.cuenta]}/>
                    </Fragment>
                }
                <div className="col-12">
                    <strong>Liquidada por:</strong> {object.usuario_cajero_username}<br/>
                    <strong>Rango
                        Liquidado:</strong> {fechaHoraFormatoUno(object.fecha_inicial_cuenta)} - {fechaHoraFormatoUno(object.created)}<br/>
                </div>
            </div>
        </ValidarPermisos>
    }
}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        object: state.liquidaciones_cuentas[id],
        cuentas: state.terceros_cuentas
    }
}

export default connect(mapPropsToState, actions)(LiquidacionDetail)