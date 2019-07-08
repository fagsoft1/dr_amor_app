import React, {Component} from 'react';
import PrinJs from 'print-js';
import Badge from '@material-ui/core/Badge';

import EntradaParqueaderoDialog from '../../entrada/components/EntredaParqueaderoModal';
import SalidaParqueaderoDialog from '../../salida/components/SalidaParqueaderoModal';
import CajaParqueaderoDialog from '../../caja/components/CajaModal';
import VehiculoParqueaderoListado from '../components/VehiculoParqueaderoList';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const styles = {
    table: {
        fontSize: '0.8rem',
        td: {
            padding: '0',
            margin: '0',
            paddingLeft: '3px',
            paddingRight: '3px',
            border: '1px solid black'
        },
        td_right: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            border: '1px solid black'
        },
        td_total: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            borderBottom: 'double 3px'
        },
        tr: {
            padding: '0',
            margin: '0',
        }
    },
};

class DashboardParqueadero extends Component {
    constructor(props) {
        super(props);
        this.state = {
            busqueda: '',
            entrada_dialog_open: false,
            salida_dialog_open: false,
            caja_dialog_open: false,
            actual_time: Date.now(),
            vehiculo_parqueadero_seleccionado: null,
            info_pago: null
        };
        this.onSelectVehiculoParqueadero = this.onSelectVehiculoParqueadero.bind(this);
        this.onImprimirComprobante = this.onImprimirComprobante.bind(this);
        this.onRegistrarSalida = this.onRegistrarSalida.bind(this);
        this.onImprimirFactura = this.onImprimirFactura.bind(this);
        this.onPagar = this.onPagar.bind(this);
    }

    onImprimirComprobante(id) {
        const callback_impresion = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            PrinJs(url);
        };
        this.props.printReciboEntradaParqueadero(id, {callback: callback_impresion});
    }

    onImprimirFactura(id) {
        const callback_impresion = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            PrinJs(url);
        };
        this.props.printFacturaPagoParqueadero(id, {callback: callback_impresion});
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({actual_time: new Date()})
        }, 1000);
        this.interval2 = setInterval(() => {
            const {
                entrada_dialog_open,
                salida_dialog_open,
                caja_dialog_open
            } = this.state;
            if (
                !entrada_dialog_open &&
                !caja_dialog_open &&
                !salida_dialog_open
            ) {
                this.props.fetchRegistrosEntradasParqueos_por_salir({show_cargando: false, limpiar_coleccion: false});
            }
        }, 5000);
        this.cargarDatos();
    }

    cargarDatos() {
        this.props.fetchRegistrosEntradasParqueos_por_salir();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.interval2);
        this.props.clearTiposVehiculos();
        this.props.clearModalidadesFraccionesTiempos();
        this.props.clearModalidadesFraccionesTiemposDetalles();
    }

    onPagar() {
        const {info_pago: {modalidad_fraccion_tiempo_id}, vehiculo_parqueadero_seleccionado} = this.state;
        const cargarRegistro = () => {
            this.props.fetchRegistroEntradaParqueo(vehiculo_parqueadero_seleccionado, {
                callback: () => {
                    this.setState({
                        info_pago: null,
                        vehiculo_parqueadero_seleccionado: null,
                        caja_dialog_open: null
                    });
                    this.cargarDatos();
                }
            })
        };
        this.props.pagarRegistroEntradaParqueo(vehiculo_parqueadero_seleccionado, modalidad_fraccion_tiempo_id, {callback: cargarRegistro})
    }

    onRegistrarSalida() {
        const {vehiculo_parqueadero_seleccionado} = this.state;
        const cargarRegistro = () => {
            this.props.fetchRegistroEntradaParqueo(vehiculo_parqueadero_seleccionado, {
                callback: () => {
                    this.setState({
                        vehiculo_parqueadero_seleccionado: null,
                        salida_dialog_open: null
                    });
                    this.cargarDatos();
                }
            })
        };
        this.props.registrarSalidaRegistroEntradaParqueo(vehiculo_parqueadero_seleccionado, {callback: cargarRegistro});
    }

    getValorAPagar(id) {
        this.props.valorAPagarRegistroEntradaParqueo(id, {
            callback: (res) => {
                this.setState({info_pago: res})
            }
        })
    }

    onSelectVehiculoParqueadero(id) {
        const callback = (res) => {
            let estados_nuevos = {vehiculo_parqueadero_seleccionado: id};
            if (!res.hora_salida && res.hora_pago) {
                estados_nuevos = {...estados_nuevos, salida_dialog_open: true}
            }
            if (!res.hora_salida && !res.hora_pago) {
                this.getValorAPagar(id);
                estados_nuevos = {...estados_nuevos, caja_dialog_open: true};
            }
            if (!res.hora_salida || !res.hora_pago) {
                this.setState(estados_nuevos)
            }
        };
        this.props.fetchRegistroEntradaParqueo(id, {callback})
    }

    render() {
        const {
            entrada_dialog_open,
            salida_dialog_open,
            caja_dialog_open,
            actual_time,
            vehiculo_parqueadero_seleccionado,
            info_pago,
            busqueda
        } = this.state;
        const {registros_entradas_parqueos} = this.props;
        let por_grupos = _.countBy(registros_entradas_parqueos, 'tipo_vehiculo_nombre');
        let por_grupo_array = [];
        _.mapKeys(por_grupos, (cantidad, tipo) =>
            por_grupo_array = [...por_grupo_array, {cantidad: cantidad, tipo: tipo}]
        );

        let pendiente_por_salir = _.pickBy(registros_entradas_parqueos, e => (e.hora_pago && !e.hora_salida));
        let en_proceso = _.pickBy(registros_entradas_parqueos, e => (!e.hora_pago && !e.hora_salida));
        if (busqueda !== '') {
            pendiente_por_salir = _.pickBy(pendiente_por_salir, e => {
                return (
                    e.vehiculo_placa.toLowerCase().includes(busqueda.toLowerCase()) ||
                    e.tipo_vehiculo_nombre.toLowerCase().includes(busqueda.toLowerCase())
                )
            });
            en_proceso = _.pickBy(en_proceso, e => {
                return (
                    e.vehiculo_placa.toLowerCase().includes(busqueda.toLowerCase()) ||
                    e.tipo_vehiculo_nombre.toLowerCase().includes(busqueda.toLowerCase())
                )
            })
        }
        return (
            <div className='row' style={{marginTop: '-30px'}}>
                {
                    entrada_dialog_open &&
                    <EntradaParqueaderoDialog
                        {...this.props}
                        is_open={true}
                        onCerrar={() => this.setState({
                            entrada_dialog_open: false,
                            info_pago: null,
                            vehiculo_parqueadero_seleccionado: null
                        })}
                    />
                }
                {
                    caja_dialog_open &&
                    <CajaParqueaderoDialog
                        {...this.props}
                        is_open={true}
                        info_pago={info_pago}
                        vehiculo={registros_entradas_parqueos[vehiculo_parqueadero_seleccionado]}
                        onCerrar={() => this.setState({
                            caja_dialog_open: false,
                            info_pago: null,
                            vehiculo_parqueadero_seleccionado: null
                        })}
                        onPagar={this.onPagar}
                    />
                }
                {
                    salida_dialog_open &&
                    <SalidaParqueaderoDialog
                        {...this.props}
                        is_open={true}
                        onRegistrarSalida={this.onRegistrarSalida}
                        vehiculo={registros_entradas_parqueos[vehiculo_parqueadero_seleccionado]}
                        onCerrar={() => this.setState({
                            salida_dialog_open: false,
                            info_pago: null,
                            vehiculo_parqueadero_seleccionado: null
                        })}
                    />
                }
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <FontAwesomeIcon
                                className='puntero'
                                icon={['far', 'plus-circle']}
                                size='4x'
                                onClick={() => this.setState({entrada_dialog_open: true})}
                            />
                        </div>
                        <div className="col-12 col-md-8">
                            <input id="busqueda" className="form-control" type="text"
                                   value={busqueda}
                                   placeholder="Placa a buscar..."
                                   onChange={(event) => this.setState({busqueda: event.target.value})}/>
                        </div>
                    </div>
                </div>
                {
                    _.size(pendiente_por_salir) > 0 &&
                    <div className="col-12 mt-2">
                        <Badge color="secondary" badgeContent={_.size(pendiente_por_salir)}>
                            <Typography variant="h5" color="primary" noWrap>
                                Pendientes por salir
                            </Typography>
                        </Badge>
                        <VehiculoParqueaderoListado
                            onSelectVehiculoParqueadero={this.onSelectVehiculoParqueadero}
                            listado_vehiculos={pendiente_por_salir}
                            actual_time={actual_time}
                            onImprimir={this.onImprimirFactura}
                        />
                    </div>
                }
                {
                    _.size(en_proceso) > 0 &&
                    <div className="col-12 mt-2">
                        <Badge color="secondary" badgeContent={_.size(en_proceso)}>
                            <Typography variant="h5" color="primary" noWrap>
                                En Proceso
                            </Typography>
                        </Badge>
                        <VehiculoParqueaderoListado
                            onImprimir={this.onImprimirComprobante}
                            onSelectVehiculoParqueadero={this.onSelectVehiculoParqueadero}
                            listado_vehiculos={en_proceso}
                            actual_time={actual_time}
                        />
                    </div>
                }
                <div className="col12">
                    <Typography variant="h5" color="primary" noWrap>
                        Resumen
                    </Typography>
                    <table
                        style={styles.table}
                        className='table table-striped table-responsive'
                    >
                        <tbody>
                        {por_grupo_array.map(e =>
                            <tr key={e.tipo}
                                style={styles.table.tr}
                            >
                                <td style={styles.table.td}>{e.tipo}</td>
                                <td style={styles.table.td}>{e.cantidad}</td>
                            </tr>)}
                        </tbody>
                        <tfoot>
                        <tr style={styles.table.tr}>
                            <td style={styles.table.td}>Total</td>
                            <td style={styles.table.td}>{_.size(pendiente_por_salir) + _.size(en_proceso)}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
        tipos_vehiculos: state.parqueadero_tipos_vehiculos,
        modalidades_fracciones_tiempo: state.parqueadero_modalidades_fracciones_tiempo,
        modalidades_fracciones_tiempo_detalles: state.parqueadero_modalidades_fracciones_tiempo_detalles,
        registros_entradas_parqueos: state.parqueadero_registros_entradas_parqueos,
    }
}

export default connect(mapPropsToState, actions)(DashboardParqueadero)