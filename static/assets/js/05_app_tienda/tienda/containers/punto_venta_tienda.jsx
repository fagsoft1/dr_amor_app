import React, {Component} from 'react';
import * as actions from "../../../01_actions/01_index";
import {connect} from "react-redux";
import Typography from '@material-ui/core/Typography';
import CategoriaUnoMenu from '../components/menu_categoria_uno';
import TablaPedidoActual from '../components/tabla_pedido_actual';
import Combobox from 'react-widgets/lib/Combobox';
import QrReaderComponent from '../../../00_utilities/components/system/qrreader';

class PuntoVentaTienda extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            categoria_uno_seleccionada: null,
            pedido_actual: {}
        });
        this.adicionarItemAPedidoActual = this.adicionarItemAPedidoActual.bind(this);
        this.restarUnidadItem = this.restarUnidadItem.bind(this);
        this.adicionarUnidadItem = this.adicionarUnidadItem.bind(this);
        this.eliminarItem = this.eliminarItem.bind(this);
        this.efectuarVenta = this.efectuarVenta.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        this.props.fetchMovimientosInventariosDetallesSaldosxPDV(id);
    }

    efectuarVenta(qr_codigo, id_usuario, tipo_venta) {
        const {pedido_actual} = this.state;
        const {id} = this.props.match.params;
        this.props.efectuarVentaTiendaEnPuntoVenta(
            id,
            qr_codigo,
            id_usuario,
            tipo_venta,
            _.map(pedido_actual, e => e),
            {
                callback: () => {
                    this.setState({pedido_actual: {}});
                    this.cargarDatos();
                }
            }
        );
    }

    adicionarItemAPedidoActual(item) {
        this.setState(s => {
            if (s.pedido_actual[item.producto]) {
                const item_actual = s.pedido_actual[item.producto];
                const item_modificado = {
                    ...item_actual,
                    cantidad: item_actual.cantidad + 1,
                    precio_total: parseFloat((item_actual.cantidad + 1) * item.producto_precio_venta)
                };
                const pedido_actual = {...s.pedido_actual, [item.producto]: item_modificado};
                return {pedido_actual}
            } else {
                const pedido_actual = {
                    ...s.pedido_actual,
                    [item.producto]: {
                        cantidad: 1,
                        id: item.producto,
                        nombre: item.producto_nombre,
                        precio_unitario: parseFloat(item.producto_precio_venta),
                        precio_total: parseFloat(item.producto_precio_venta)
                    }
                };
                return {pedido_actual}
            }
        });
    }

    restarUnidadItem(item) {
        this.setState(s => {
            if (s.pedido_actual[item.id]) {
                const item_actual = s.pedido_actual[item.id];
                const item_modificado = {
                    ...item_actual,
                    cantidad: item_actual.cantidad - 1,
                    precio_total: parseFloat((item_actual.cantidad - 1) * item.precio_unitario)
                };
                let pedido_actual = {...s.pedido_actual, [item.id]: item_modificado};
                if (item_modificado.cantidad <= 0) {
                    pedido_actual = _.omit(s.pedido_actual, item.id);
                }
                return {pedido_actual}
            } else {
                return {pedido_actual: s.pedido_actual}
            }
        })
    }

    eliminarItem(item) {
        this.setState(s => {
            if (s.pedido_actual[item.id]) {
                const pedido_actual = _.omit(s.pedido_actual, item.id);
                return {pedido_actual}
            } else {
                return {pedido_actual: s.pedido_actual}
            }
        })
    }

    adicionarUnidadItem(item) {
        this.setState(s => {
            if (s.pedido_actual[item.id]) {
                const item_actual = s.pedido_actual[item.id];
                const item_modificado = {
                    ...item_actual,
                    cantidad: item_actual.cantidad + 1,
                    precio_total: parseFloat((item_actual.cantidad + 1) * item.precio_unitario)
                };
                let pedido_actual = {...s.pedido_actual, [item.id]: item_modificado};
                return {pedido_actual}
            } else {
                return {pedido_actual: s.pedido_actual}
            }
        })
    }

    render() {
        const {categoria_uno_seleccionada, pedido_actual} = this.state;
        let {mi_cuenta: {punto_venta_actual}, inventarios_bodega_origen_list} = this.props;
        if (!punto_venta_actual) {
            return <div>Cargando</div>
        }
        inventarios_bodega_origen_list = _.pickBy(inventarios_bodega_origen_list, e => (e.es_ultimo_saldo && e.bodega === punto_venta_actual.bodega));

        let inventario_disponible = _.map(inventarios_bodega_origen_list, e => {
            return {
                ...e,
                saldo_cantidad: e.saldo_cantidad - (pedido_actual[e.producto] ? pedido_actual[e.producto].cantidad : 0)
            }
        });
        inventario_disponible = _.mapKeys(inventario_disponible, 'producto');


        const productos_x_categoria_dos = _.groupBy(inventario_disponible, 'producto_categoria_dos_nombre');
        let productos = _.uniqBy(_.map(inventario_disponible, e => ({categoria_uno: e.producto_categoria_nombre})), 'categoria_uno');
        productos = productos.map(e => ({
            ...e,
            categorias_dos: _.uniqBy(_.map(
                _.pickBy(
                    inventario_disponible,
                    s => s.producto_categoria_nombre === e.categoria_uno
                ),
                c => ({
                    categoria_dos: c.producto_categoria_dos_nombre,
                    productos: productos_x_categoria_dos[c.producto_categoria_dos_nombre]
                })
            ), 'categoria_dos')
        }));
        productos = _.mapKeys(productos, 'categoria_uno');

        return (
            <div className="row">
                <div className="col-12">
                    <Typography variant="h4" gutterBottom color="primary">
                        {punto_venta_actual && punto_venta_actual.nombre}
                    </Typography>
                </div>
                <div className="col-7">
                    <TablaPedidoActual
                        inventario_disponible={inventario_disponible}
                        pedido_actual={pedido_actual}
                        eliminarItem={this.eliminarItem}
                        restarUnidadItem={this.restarUnidadItem}
                        adicionarUnidadItem={this.adicionarUnidadItem}
                    />
                </div>
                <div className="col-5">
                    <div className="row">
                        <div className="col-12 p-0 m-0">
                            <Combobox
                                data={_.map(_.pickBy(inventario_disponible, p => p.saldo_cantidad > 0), e => e)}
                                filter='contains'
                                valueField='producto'
                                textField='producto_nombre'
                                onSelect={(e) => this.adicionarItemAPedidoActual(e)}
                            />
                        </div>
                        {
                            productos &&
                            _.map(productos, cuno => {
                                return (
                                    <CategoriaUnoMenu
                                        pedido_actual={pedido_actual}
                                        adicionarItemAPedidoActual={this.adicionarItemAPedidoActual}
                                        mostrar={!categoria_uno_seleccionada}
                                        onBack={() => this.setState({categoria_uno_seleccionada: null})}
                                        categoria_uno_seleccionada={categoria_uno_seleccionada}
                                        key={cuno.categoria_uno}
                                        categoria_uno={cuno}
                                        onClick={(seleccion) => this.setState({categoria_uno_seleccionada: seleccion})}
                                    />
                                )
                            })

                        }
                    </div>
                </div>
                {
                    _.size(pedido_actual) > 0 &&
                    <QrReaderComponent onSubmit={this.efectuarVenta}/>
                }
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mi_cuenta: state.mi_cuenta,
        inventarios_bodega_origen_list: state.movimientos_inventarios_detalles,
    }
}

export default connect(mapPropsToState, actions)(PuntoVentaTienda)