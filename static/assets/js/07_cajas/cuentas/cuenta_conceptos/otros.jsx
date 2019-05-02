import React, {Fragment} from 'react';
import {fechaHoraFormatoUno, pesosColombianos} from "../../../00_utilities/common";
import Typography from "@material-ui/core/Typography/index";

const OperacionCajaTabla = (props) => {
    const {operaciones, descripcion, styles} = props;
    const cxc = _.map(_.pickBy(operaciones, o => (o.tipo_cuenta === 'CXC')));
    const cxp = _.map(_.pickBy(operaciones, o => (o.tipo_cuenta === 'CXP')));
    const total_cxc = Math.abs(cxc.reduce((v, s) => parseFloat(v) + parseFloat(s.valor), 0));
    const total_cxp = Math.abs(cxp.reduce((v, s) => parseFloat(v) + parseFloat(s.valor), 0));
    return (
        <Fragment>
            <div className='col-12'>
                <Typography variant="h6" gutterBottom color="primary">
                    {descripcion}
                </Typography>
            </div>
            <div className='col-12' style={{paddingLeft: '30px'}}>
                <table style={styles.table} className='table-responsive table-striped'>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Concepto</th>
                        <th>Fecha</th>
                        <th>Observación</th>
                        <th>Cajero</th>
                        <th>CXP</th>
                        <th>CXC</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        _.map(
                            _.orderBy(operaciones, ['id'], ['desc'])
                            , s => {
                                return (
                                    <tr
                                        key={s.id}
                                        style={styles.table.tr}
                                    >
                                        <td style={styles.table.td}>{s.id}</td>
                                        <td style={styles.table.td}>{s.descripcion}</td>
                                        <td style={styles.table.td}>{fechaHoraFormatoUno(s.hora_inicio)}</td>
                                        <td style={styles.table.td}>{s.observacion}</td>
                                        <td style={styles.table.td}>{s.usuario_cajero_username}</td>
                                        <td style={styles.table.td_right}>{s.tipo_cuenta === 'CXP' ? pesosColombianos(s.valor) : '$0'}</td>
                                        <td style={styles.table.td_right}>{s.tipo_cuenta === 'CXC' ? pesosColombianos(Math.abs(s.valor)) : '$0'}</td>
                                    </tr>
                                )
                            })
                    }
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={2}>Subtotal</td>
                        <td colSpan={3}></td>
                        <td style={styles.table.td_right}>{pesosColombianos(total_cxp)}</td>
                        <td style={styles.table.td_right}>{pesosColombianos(total_cxc)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>Total
                            a {`${total_cxp > total_cxc ? 'Pagar' : 'Cobrar'}`}</td>
                        <td colSpan={5}></td>
                        <td style={styles.table.td_total}>{pesosColombianos(Math.abs(total_cxc - total_cxp))}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </Fragment>
    )
};


const ListadoOperaciones = (props) => {
    const {
        cuenta,
        styles
    } = props;
    const {operaciones_caja} = cuenta;

    const operaciones_caja_otros = _.pickBy(operaciones_caja, o => !o.reporte_independiente);
    const operaciones_caja_reporte_independientes = _.pickBy(operaciones_caja, o => o.reporte_independiente);
    const operaciones_caja_reporte_independientes_agrupado = _.groupBy(operaciones_caja_reporte_independientes, 'descripcion');
    const descripciones_independientes = _.uniq(_.map(operaciones_caja_reporte_independientes, e => e.descripcion));
    return (
        <div className='row'>
            {
                _.size(operaciones_caja_otros) > 0 &&
                <OperacionCajaTabla
                    operaciones={operaciones_caja_otros}
                    descripcion={'Otros Conceptos'}
                    styles={styles}
                />
            }
            {
                descripciones_independientes.length > 0 &&
                descripciones_independientes.map(
                    di => <OperacionCajaTabla
                        key={di}
                        operaciones={operaciones_caja_reporte_independientes_agrupado[di]}
                        descripcion={di}
                        styles={styles}
                    />
                )
            }
        </div>
    )
};

export default ListadoOperaciones;