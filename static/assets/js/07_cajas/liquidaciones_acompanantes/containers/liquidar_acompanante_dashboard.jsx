import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import {
    COLABORADORES as permisos_view
} from "../../../00_utilities/permisos/types";
import {permisosAdapter, pesosColombianos} from "../../../00_utilities/common";
import SelectAcompanante from "../components/liquidacion_caja_select_acompanante";
import TablaServicios from "../components/tabla_servicios";
import FormaPago from '../components/forms/forma_pago'

class LiquidarAcompanante extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.setTercero = this.setTercero.bind(this);
        this.onPagar = this.onPagar.bind(this);
        this.efectuarConsulta = this.efectuarConsulta.bind(this);
        this.state = {
            id_tercero: null
        }
    }

    setTercero(id_tercero) {
        this.setState({id_tercero});
    }

    efectuarConsulta() {
        const {
            fetchServicios_por_tercero_cuenta_abierta
        } = this.props;
        const {id_tercero} = this.state;

        fetchServicios_por_tercero_cuenta_abierta(id_tercero, null);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearServicios();
    }

    cargarDatos() {
        const {
            fetchAcompanantesPresentes,
        } = this.props;

        fetchAcompanantesPresentes();
    }

    onPagar(pago) {
        const {
            liquidarCuentaTercero,
            auth:{punto_venta}
        } = this.props;

        liquidarCuentaTercero(
            this.state.id_tercero,
            {
                ...pago,
                punto_venta_id: punto_venta.id
            },
            () => {

                this.setState({id_tercero: null});
                this.props.clearAcompanantes();
                this.cargarDatos();
            }
        )
    }

    render() {
        const {id_tercero} = this.state;
        const {acompanantes, servicios} = this.props;
        const acompanante = acompanantes ? acompanantes[id_tercero] : null;
        const servicios_acompanante_sin_liquidar = _.map(_.pickBy(servicios, e => !e.cuenta_liquidada && e.acompanante === id_tercero))
        const total_servicios = servicios_acompanante_sin_liquidar.filter(s => s.estado === 2).reduce((v, s) => parseFloat(v) + parseFloat(s.valor_servicio), 0);

        const saldo_anterior = acompanante && acompanante.saldo_final ? parseFloat(acompanante.saldo_final, 2) : 0;
        const total_a_pagar = total_servicios + saldo_anterior;
        return (
            <div className='liquidacion_acompanantes'>
                <h4>Liquidaciones</h4>
                <SelectAcompanante
                    acompanantes={acompanantes}
                    onSubmit={this.efectuarConsulta}
                    setTercero={this.setTercero}
                    id_tercero={id_tercero}
                />

                {
                    acompanante &&
                    <div className="row">
                        <div className="col-12 col-xl-6">
                            <TablaServicios servicios={servicios_acompanante_sin_liquidar}
                                            total_servicios={total_servicios}/>
                        </div>
                        {
                            total_servicios > 0 &&
                            <div className="col-12">
                                <FormaPago
                                    onSubmit={this.onPagar}
                                    valor_total_a_pagar={total_a_pagar}
                                >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td><strong>Saldo Anterior: </strong></td>
                                            <td>{pesosColombianos(saldo_anterior)}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Por Servicios: </strong></td>
                                            <td>{pesosColombianos(total_servicios)}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total: </strong></td>
                                            <td><strong>{pesosColombianos(total_a_pagar)}</strong></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </FormaPago>
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
        acompanantes: state.acompanantes,
        servicios: state.servicios,
    }
}

export default connect(mapPropsToState, actions)(LiquidarAcompanante)