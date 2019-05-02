import React, {Fragment} from 'react';
import Typography from "@material-ui/core/Typography/index";
import {fechaHoraFormatoUno, pesosColombianos} from "../../../00_utilities/common";

const ListadoConsumos = (props) => {
    const {
        cuenta: {compras_productos},
        cuenta,
        styles
    } = props;
    return (
        <div className="row">
            {
                compras_productos &&
                compras_productos.length > 0 &&
                <Fragment>
                    <div className='col-12'>
                        <Typography variant="h6" gutterBottom color="primary">
                            CXC Consumos Tienda
                        </Typography>
                    </div>
                    <div className='col-12' style={{paddingLeft: '30px'}}>
                        <table style={styles.table} className='table-responsive table-striped'>
                            <thead>
                            <tr>
                                <th>Id Compra</th>
                                <th>Id Item</th>
                                <th>Producto</th>
                                <th>Cajero</th>
                                <th>Hora Compra</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                _.map(compras_productos, c =>
                                    <Fragment key={c.id}>
                                        {
                                            _.map(
                                                c.productos, dp =>
                                                    <tr key={dp.id}>
                                                        <td style={styles.table.td}>{c.id}</td>
                                                        <td style={styles.table.td}>{dp.id}</td>
                                                        <td style={styles.table.td}>{dp.producto_nombre}</td>
                                                        <td style={styles.table.td}>{dp.usuario_cajero_username}</td>
                                                        <td style={styles.table.td}>{fechaHoraFormatoUno(c.created)}</td>
                                                        <td style={styles.table.td_right}>{dp.cantidad}</td>
                                                        <td style={styles.table.td_right}>{pesosColombianos(dp.precio_unitario)}</td>
                                                        <td style={styles.table.td_right}>{pesosColombianos(dp.precio_total)}</td>
                                                    </tr>
                                            )
                                        }
                                    </Fragment>
                                )
                            }
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan={2}>Total a Cobrar</td>
                                <td colSpan={6}></td>
                                <td style={styles.table.td_total}>{pesosColombianos(cuenta.cxc_por_compras_productos)}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </Fragment>
            }
        </div>
    )
};

export default ListadoConsumos;