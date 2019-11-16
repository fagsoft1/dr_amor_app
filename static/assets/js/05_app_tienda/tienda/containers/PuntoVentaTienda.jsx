import React, {memo, useState, useEffect} from 'react';
import * as actions from "../../../01_actions";
import {useDispatch, useSelector} from "react-redux";
import Typography from '@material-ui/core/Typography';
import CategoriaUnoMenu from '../components/MenuCategoriaUno';
import TablaPedidoActual from '../components/PedidoActualTable';
import Combobox from 'react-widgets/lib/Combobox';
import QrReaderComponent from '../../../00_utilities/components/system/QrReader';

const PuntoVentaTienda = memo(props => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchMovimientosInventariosDetallesSaldosxPDV(punto_venta_actual.id));
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const [categoria_uno_seleccionada, setCategoriaUnoSeleccionada] = useState(null);
    const [pedido_actual, setPedidoActual] = useState({});
    const auth = useSelector(state => state.auth);
    const {user: {punto_venta_actual}} = auth;
    let inventarios_bodega_origen_list = useSelector(state => state.movimientos_inventarios_detalles);

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

    if (!punto_venta_actual) {
        return <div>Cargando</div>
    }

    const efectuarVenta = (qr_codigo, id_usuario, tipo_venta) => {
        dispatch(
            actions.efectuarVentaTiendaEnPuntoVenta(
                punto_venta_actual.id,
                qr_codigo,
                id_usuario,
                tipo_venta,
                _.map(pedido_actual, e => e),
                {
                    callback: () => {
                        setPedidoActual({});
                        cargarDatos();
                    }
                }
            )
        );
    };

    const adicionarItemAPedidoActual = (item) => {
        const item_actual = pedido_actual[item.producto];
        if (item_actual) {
            console.log('entro a adicionar a pedido actual')
            const item_modificado = {
                ...item_actual,
                cantidad: item_actual.cantidad + 1,
                precio_total: parseFloat((item_actual.cantidad + 1) * item.producto_precio_venta)
            };
            const pedido_actual_nuevo = {...pedido_actual, [item.producto]: item_modificado};
            return setPedidoActual(pedido_actual_nuevo);
        } else {
            console.log('entro a agregar a pedido actual')
            const pedido_actual_nuevo = {
                ...pedido_actual,
                [item.producto]: {
                    cantidad: 1,
                    producto_id: item.producto,
                    nombre: item.producto_nombre,
                    precio_unitario: parseFloat(item.producto_precio_venta),
                    precio_total: parseFloat(item.producto_precio_venta)
                }
            };
            return setPedidoActual(pedido_actual_nuevo);
        }
    };


    const restarUnidadItem = (item) => {
        const item_actual = pedido_actual[item.producto_id];
        if (item_actual) {
            const item_modificado = {
                ...item_actual,
                cantidad: item_actual.cantidad - 1,
                precio_total: parseFloat((item_actual.cantidad - 1) * item.precio_unitario)
            };
            let pedido_actual_nuevo = {...pedido_actual, [item.producto_id]: item_modificado};
            if (item_modificado.cantidad <= 0) {
                pedido_actual_nuevo = _.omit(pedido_actual, item.producto_id);
            }
            setPedidoActual(pedido_actual_nuevo)
        }
    };

    const eliminarItem = (item) => setPedidoActual(_.omit(pedido_actual, item.producto_id));

    const adicionarUnidadItem = (item) => {
        const item_actual = pedido_actual[item.producto_id];
        if (item_actual) {
            const item_modificado = {
                ...item_actual,
                cantidad: item_actual.cantidad + 1,
                precio_total: parseFloat((item_actual.cantidad + 1) * item.precio_unitario)
            };
            let nuevo_pedido_actual = {...pedido_actual, [item.producto_id]: item_modificado};
            setPedidoActual(nuevo_pedido_actual);
        }
    };

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
                    eliminarItem={eliminarItem}
                    restarUnidadItem={restarUnidadItem}
                    adicionarUnidadItem={adicionarUnidadItem}
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
                            onSelect={(e) => adicionarItemAPedidoActual(e)}
                        />
                    </div>
                    {
                        productos &&
                        _.map(productos, cuno => {
                            return (
                                <CategoriaUnoMenu
                                    pedido_actual={pedido_actual}
                                    adicionarItemAPedidoActual={adicionarItemAPedidoActual}
                                    mostrar={!categoria_uno_seleccionada}
                                    onBack={() => setCategoriaUnoSeleccionada(null)}
                                    categoria_uno_seleccionada={categoria_uno_seleccionada}
                                    key={cuno.categoria_uno}
                                    categoria_uno={cuno}
                                    onClick={(seleccion) => setCategoriaUnoSeleccionada(seleccion)}
                                />
                            )
                        })

                    }
                </div>
            </div>
            {
                _.size(pedido_actual) > 0 &&
                <QrReaderComponent onSubmit={efectuarVenta}/>
            }
        </div>
    )

});
export default PuntoVentaTienda;