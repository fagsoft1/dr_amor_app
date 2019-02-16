import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {pesosColombianos} from "../../../00_utilities/common";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const TablaBilletesMonedas = (props) => {
    const {nombre, styles, lista, onChange, denominaciones} = props;
    const sum = _.map(denominaciones, e => e.total).reduce((acu, ele) => acu + ele, 0);
    return (
        <Fragment>
            <Typography variant="h6" gutterBottom color="primary">
                {nombre}
            </Typography>
            <table className='table table-responsive' style={styles.table}>
                <thead>
                <tr>
                    <th>Denominación</th>
                    <th># Cantidad</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                {_.map(_.orderBy(lista, e => parseFloat(e.valor), ['desc']), d => {
                    return (
                        <tr key={d.id}>
                            <td className='text-right' style={styles.table.td}>
                                <span>{pesosColombianos(d.valor)} </span>
                                <FontAwesomeIcon
                                    icon={['far', d.tipo === 0 ? 'money-bill-wave' : 'coins']}
                                />
                            </td>
                            <td style={styles.table.td}>
                                <input
                                    value={denominaciones && denominaciones[d.id] ? denominaciones[d.id].cantidad : 0}
                                    name={d.valor} type='number'
                                    onChange={(e) => onChange(d.id, e.target.value, d.valor, d.tipo)}
                                />
                            </td>
                            <td style={styles.table.td}>
                                {denominaciones && denominaciones[d.id] ? pesosColombianos(denominaciones[d.id].total) : 0}
                            </td>
                        </tr>
                    )
                })}
                </tbody>
                <tfoot>
                <tr>
                    <td>Total {nombre.toLowerCase()}</td>
                    <td>{pesosColombianos(sum)}</td>
                </tr>
                </tfoot>
            </table>
        </Fragment>
    )
};

const GrupoTablaDinero = (props) => {
    const {billetes_monedas, styles, onChange, denominaciones, titulo} = props;
    const sum = _.map(denominaciones, e => e.total).reduce((acu, ele) => acu + ele, 0);
    return (
        <Fragment>
            <Typography variant="h5" gutterBottom color="primary">
                {titulo}
            </Typography>
            <div className="row pl-2">
                <div className="col-12 col-md-6">
                    <TablaBilletesMonedas
                        lista={_.pickBy(billetes_monedas, e => e.tipo === 0)}
                        nombre='Billetes'
                        styles={styles}
                        onChange={onChange}
                        denominaciones={_.pickBy(denominaciones, e => e.tipo === 0)}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <TablaBilletesMonedas
                        lista={_.pickBy(billetes_monedas, e => e.tipo === 1)}
                        nombre='Monedas'
                        styles={styles}
                        onChange={onChange}
                        denominaciones={_.pickBy(denominaciones, e => e.tipo === 1)}
                    />
                </div>
            </div>
            <div className='text-center'><strong>Total {titulo}: </strong> {pesosColombianos(sum)}</div>
        </Fragment>
    )
};


class LiquidarAcompanante extends Component {
    constructor(props) {
        super(props);
        this.state = {
            denominaciones_entrega: {},
            denominaciones_base: {},
            valor_tarjeta: 0,
            nro_voucher: 0,
            dolares: 0,
            dolares_tasa: 0,
            punto_venta_id: null,
        };
        this.cargarDatos = this.cargarDatos.bind(this);
        this.onChangeEntrega = this.onChangeEntrega.bind(this);
        this.onChangeBase = this.onChangeBase.bind(this);
        this.onCerrarCajaPuntoVenta = this.onCerrarCajaPuntoVenta.bind(this);
    }

    componentDidMount() {
        const {auth: {punto_venta}} = this.props;
        this.setState({punto_venta_id: punto_venta.id});
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearBilletesMonedas();
    }

    onChangeEntrega(id, cantidad, valor, tipo) {
        const {denominaciones_entrega} = this.state;
        const nueva = {cantidad, valor, total: cantidad * valor, tipo};
        this.setState({denominaciones_entrega: {...denominaciones_entrega, [id]: nueva}});
    }

    onChangeBase(id, cantidad, valor, tipo) {
        const {denominaciones_base} = this.state;
        const nueva = {cantidad, valor, total: cantidad * valor, tipo};
        this.setState({denominaciones_base: {...denominaciones_base, [id]: nueva}});
    }

    cargarDatos() {
        const {
            fetchBilletesMonedas,
        } = this.props;

        fetchBilletesMonedas();
    }

    onCerrarCajaPuntoVenta() {
        const {
            hacerEntregaEfectivoCajaPuntoVenta,
            printEntregasArqueosCajas,
            envioEmailArqueo,
            auth: {punto_venta}
        } = this.props;

        const cierre = this.state;
        const cierre2 = {
            denominaciones_base: _.map(cierre.denominaciones_base, e => {
                return {cantidad: e.cantidad, valor: e.valor, tipo: e.tipo}
            }),
            denominaciones_entrega: _.map(cierre.denominaciones_entrega, e => {
                return {cantidad: e.cantidad, valor: e.valor, tipo: e.tipo}
            }),
            cierre_para_arqueo: {
                valor_tarjeta: cierre.valor_tarjeta,
                nro_voucher: cierre.nro_voucher,
                dolares: cierre.dolares,
                dolares_tasa: cierre.dolares_tasa,
                punto_venta_id: cierre.punto_venta_id
            }
        };
        const callback = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            window.open(url, "_blank");
            localStorage.removeItem('punto_venta');
            this.props.history.push('/app');

        };
        const imprimirEntrega = (arqueo_id) => printEntregasArqueosCajas(arqueo_id, {callback});
        const enviarEmail = (arqueo_id) => {
            envioEmailArqueo(
                arqueo_id,
                {callback: () => imprimirEntrega(arqueo_id)}
            )
        };
        hacerEntregaEfectivoCajaPuntoVenta(punto_venta.id, cierre2, {callback: res => enviarEmail(res.arqueo_id)});
    }

    render() {
        const {billetes_monedas} = this.props;
        const styles = {
            titulo: {
                color: 'red'
            },
            table: {
                fontSize: '0.8rem',
                td: {
                    padding: 0,
                    margin: 0,
                },
                tr: {
                    padding: 0,
                    margin: 0,
                }
            },

        };
        const {
            denominaciones_entrega,
            denominaciones_base,
            valor_tarjeta,
            nro_voucher,
            dolares,
            dolares_tasa,
        } = this.state;
        const sum_billetes_entrega = _.map(_.pickBy(denominaciones_entrega, e => e.tipo === 0), e => e.total).reduce((acu, ele) => acu + ele, 0);
        const sum_monedas_entrega = _.map(_.pickBy(denominaciones_entrega, e => e.tipo === 1), e => e.total).reduce((acu, ele) => acu + ele, 0);
        const sum_billetes_base = _.map(_.pickBy(denominaciones_base, e => e.tipo === 0), e => e.total).reduce((acu, ele) => acu + ele, 0);
        const sum_monedas_base = _.map(_.pickBy(denominaciones_base, e => e.tipo === 1), e => e.total).reduce((acu, ele) => acu + ele, 0);

        const total_efectivo_entrega = sum_billetes_entrega + sum_monedas_entrega;
        const total_efectivo_base = sum_billetes_base + sum_monedas_base;
        const total_efectivo = total_efectivo_entrega + total_efectivo_base;
        const total_dolares = dolares * dolares_tasa;

        return (
            <div>
                <Typography variant="h4" gutterBottom color="primary">
                    Cierre Caja
                </Typography>
                <div className="row">
                    <div className="col-12 col-md-6 card p-2 mt-2">
                        <Typography variant="h5" gutterBottom color="primary">
                            Tarjeta de Crédito
                        </Typography>
                        <table className='table table-responsive' style={styles.table}>
                            <tbody>
                            <tr>
                                <td style={styles.table.td}>Tarjeta de Crédito</td>
                                <td style={styles.table.td}>
                                    <input
                                        value={valor_tarjeta}
                                        name='valor_tarjeta'
                                        type='number'
                                        onChange={(e) => this.setState({valor_tarjeta: e.target.value})}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={styles.table.td}>Nro. Vouchers</td>
                                <td style={styles.table.td}>
                                    <input
                                        value={nro_voucher}
                                        name='valor_tarjeta'
                                        type='number'
                                        onChange={(e) => this.setState({nro_voucher: e.target.value})}
                                    />
                                </td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td>$ Total Tarjetas</td>
                                <td>{pesosColombianos(valor_tarjeta)}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="col-12 col-md-6 card p-2 mt-2">
                        <Typography variant="h5" gutterBottom color="primary">
                            Dolares
                        </Typography>
                        <table className='table table-responsive' style={styles.table}>
                            <tbody>
                            <tr>
                                <td style={styles.table.td}>Dolares</td>
                                <td style={styles.table.td}>
                                    <input
                                        value={dolares}
                                        name='dolares'
                                        type='number'
                                        onChange={(e) => this.setState({dolares: e.target.value})}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={styles.table.td}>Tasa Recibida</td>
                                <td style={styles.table.td}>
                                    <input
                                        value={dolares_tasa}
                                        name='dolares_tasa'
                                        type='number'
                                        onChange={(e) => this.setState({dolares_tasa: e.target.value})}
                                    />
                                </td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td>$ Total en Dolares</td>
                                <td>{pesosColombianos(dolares * dolares_tasa)}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="col-12 card p-2 mt-2">
                        <GrupoTablaDinero
                            titulo='Base Día Siguiente'
                            styles={styles}
                            onChange={this.onChangeBase}
                            denominaciones={denominaciones_base}
                            billetes_monedas={billetes_monedas}
                        />
                    </div>
                    <div className="col-12 card p-2 mt-2">
                        <GrupoTablaDinero
                            titulo='Entrega Efectivo'
                            styles={styles}
                            onChange={this.onChangeEntrega}
                            denominaciones={denominaciones_entrega}
                            billetes_monedas={billetes_monedas}
                        />
                    </div>
                </div>
                <div className='text-center'>
                    Dolares: {pesosColombianos(parseFloat(total_dolares))}<br/>
                    Tarjeta: {pesosColombianos(parseFloat(valor_tarjeta))}<br/>
                    Efectivo Entrega: {pesosColombianos(parseFloat(total_efectivo_entrega))}<br/>
                    Efectivo Base que pasa: {pesosColombianos(parseFloat(total_efectivo_base))}<br/>
                    <strong>Total: {pesosColombianos(parseFloat(total_dolares) + parseFloat(total_efectivo) + parseFloat(valor_tarjeta))}</strong><br/>

                    <Button
                        color="primary"
                        variant="contained"
                        className='ml-3'
                        onClick={() => this.onCerrarCajaPuntoVenta()}
                        disabled={submitting || pristine}
                    >
                        {`Cerrar Caja ${pesosColombianos(parseFloat(total_dolares) + parseFloat(total_efectivo) + parseFloat(valor_tarjeta))}`}
                    </Button>
                </div>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
        billetes_monedas: state.billetes_monedas,
    }
}

export default connect(mapPropsToState, actions)(LiquidarAcompanante)