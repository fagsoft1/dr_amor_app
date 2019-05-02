import React from 'react';
import {fechaHoraFormatoUno, pesosColombianos} from "../../../00_utilities/common";
import Typography from "@material-ui/core/Typography/index";


const ListadoServicios = (props) => {
    const {
        cuenta,
        styles
    } = props;
    const {servicios, cxp_por_servicios, cxp_por_comisiones_habitacion} = cuenta;
    return (
        <div className="row">
            <div className='col-12'>
                <Typography variant="h6" gutterBottom color="primary">
                    CXP Servicios
                </Typography>
            </div>
            <div className='col-12' style={{paddingLeft: '30px'}}>
                <table style={styles.table} className='table-responsive table-striped'>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Habitación</th>
                        <th>Hora Inicio</th>
                        <th>Hora Fin</th>
                        <th>Tiempo</th>
                        <th>Estado</th>
                        <th>Cajero</th>
                        <th>Valor</th>
                        <th>Comisión</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        _.map(
                            _.orderBy(servicios, ['id'], ['desc'])
                            , s => {
                                return (
                                    <tr
                                        key={s.id}
                                        style={styles.table.tr}
                                    >
                                        <td style={styles.table.td}>{s.id}</td>
                                        <td style={styles.table.td}>{s.habitacion_nombre}</td>
                                        <td style={styles.table.td}>{fechaHoraFormatoUno(s.hora_inicio)}</td>
                                        <td style={styles.table.td}>{s.estado === 2 ? fechaHoraFormatoUno(s.hora_final_real) : ''}</td>
                                        <td style={styles.table.td_right}>{s.tiempo_minutos}</td>
                                        <td style={styles.table.td}>{s.estado_nombre}</td>
                                        <td style={styles.table.td}>{s.usuario_cajero_username}</td>
                                        <td style={styles.table.td_right}>{s.estado === 2 ? pesosColombianos(s.valor_servicio) : 0}</td>
                                        <td style={styles.table.td_right}>{s.estado === 2 ? pesosColombianos(s.comision) : 0}</td>
                                    </tr>
                                )
                            })
                    }
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={2}>Subtotal</td>
                        <td colSpan={5}></td>
                        <td style={styles.table.td_right}>{pesosColombianos(cxp_por_servicios)}</td>
                        <td style={styles.table.td_right}>{pesosColombianos(cxp_por_comisiones_habitacion)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>Total a Pagar</td>
                        <td colSpan={7}></td>
                        <td style={styles.table.td_total}>{pesosColombianos(parseFloat(cxp_por_comisiones_habitacion) + parseFloat(cxp_por_servicios))}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
};

export default ListadoServicios;