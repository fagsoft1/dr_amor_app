import React, {Fragment} from 'react';
import Typography from "@material-ui/core/Typography/index";
import {pesosColombianos} from "../../00_utilities/common";
import Button from "@material-ui/core/Button/index";

const ResumenLiquidacion = (props) => {
    const {cuenta, styles} = props;
    const saldo_anterior_cxp = parseFloat(cuenta.saldo_anterior_cxp);
    const saldo_anterior_cxc = parseFloat(cuenta.saldo_anterior_cxc);
    const cxp_por_servicios = parseFloat(cuenta.cxp_por_servicios);
    const cxp_por_comisiones_habitacion = parseFloat(cuenta.cxp_por_comisiones_habitacion);
    const cxp_por_operaciones_caja = parseFloat(cuenta.cxp_por_operaciones_caja);
    const cxc_por_operaciones_caja = parseFloat(cuenta.cxc_por_operaciones_caja);
    const cxc_por_compras_productos = parseFloat(cuenta.cxc_por_compras_productos);
    return (
        <Fragment>
            <div className="col-12">
                <Typography variant="h6" gutterBottom color="primary">
                    Resumen
                </Typography>
            </div>
            <div className='col-12' style={{paddingLeft: '30px'}}>
                <table style={styles.table} className='table-responsive'>
                    <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>CXP</th>
                        <th>CXC</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        style={styles.table.tr}
                    >
                        <td style={styles.table.td}>Saldo Anterior</td>
                        <td style={styles.table.td_right}>{pesosColombianos(saldo_anterior_cxp)}</td>
                        <td style={styles.table.td_right}>{pesosColombianos(saldo_anterior_cxc)}</td>
                    </tr>
                    <tr
                        style={styles.table.tr}
                    >
                        <td style={styles.table.td}>Servicios</td>
                        <td style={styles.table.td_right}>{pesosColombianos(cxp_por_servicios)}</td>
                        <td style={styles.table.td_right}>{pesosColombianos(0)}</td>
                    </tr>
                    <tr
                        style={styles.table.tr}
                    >
                        <td style={styles.table.td}>Comisiones Habitaciones</td>
                        <td style={styles.table.td_right}>{pesosColombianos(cxp_por_comisiones_habitacion)}</td>
                        <td style={styles.table.td_right}>{pesosColombianos(0)}</td>
                    </tr>
                    <tr
                        style={styles.table.tr}
                    >
                        <td style={styles.table.td}>Otras CXP</td>
                        <td style={styles.table.td_right}>{pesosColombianos(cxp_por_operaciones_caja)}</td>
                        <td style={styles.table.td_right}>{pesosColombianos(0)}</td>
                    </tr>
                    <tr
                        style={styles.table.tr}
                    >
                        <td style={styles.table.td}>Consumos Tienda</td>
                        <td style={styles.table.td_right}>{pesosColombianos(0)}</td>
                        <td style={styles.table.td_right}>{pesosColombianos(cxc_por_compras_productos)}</td>
                    </tr>
                    <tr
                        style={styles.table.tr}
                    >
                        <td style={styles.table.td}>Otras CXC</td>
                        <td style={styles.table.td_right}>{pesosColombianos(0)}</td>
                        <td style={styles.table.td_right}>{pesosColombianos(cxc_por_operaciones_caja)}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Subtotal</td>
                        <td style={styles.table.td_right}>{pesosColombianos(cuenta.cxp_total)}</td>
                        <td style={styles.table.td_right}>{pesosColombianos(cuenta.cxc_total)}</td>
                    </tr>
                    <tr>
                        <td>Total a Pagar</td>
                        <td></td>
                        <td></td>
                        <td style={styles.table.td_total}>{pesosColombianos(cuenta.cxp_total - cuenta.cxc_total)}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </Fragment>
    )
};

export default ResumenLiquidacion;