import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {pesosColombianos} from '../../../../../00_utilities/common';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    table: {
        minWidth: 700,
    },
});

function SimpleTable(props) {
    const {classes} = props;
    let {servicios} = props;
    servicios = _.pickBy(servicios, s => !s.anulado);
    const servicios_por_tiempo = _.groupBy(servicios, 'tiempo_nombre');

    let servicios_por_tiempo_dos = [];
    _.mapKeys(servicios_por_tiempo, (v, k) => {
        servicios_por_tiempo_dos = [...servicios_por_tiempo_dos, {tiempo: k, servicios: v}]
    });
    const nro_servicios = _.size(servicios);
    const valor_servicios = _.sumBy(_.map(servicios, e => e), e => parseFloat(e.valor_servicio));

    return (
        <Paper className={classes.root}>
            <Typography variant="h6" gutterBottom color="primary">
                Servicios
            </Typography>
            <div className="row">
                <table className='table table-responsive' style={{fontSize: '1rem'}}>
                    <thead>
                    <tr>
                        <th>Tiempo</th>
                        <th>Cantidad</th>
                        <th>Valor</th>
                    </tr>
                    </thead>
                    <tbody>
                    {_.map(servicios_por_tiempo_dos, s => {
                        return (
                            <tr key={s.tiempo}>
                                <td>{s.tiempo}</td>
                                <td className='text-right'>{s.servicios.length}</td>
                                <td className='text-right'>{pesosColombianos(_.sumBy(s.servicios, e => parseFloat(e.valor_servicio)))}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Total</td>
                        <td className='text-right'>{nro_servicios}</td>
                        <td className='text-right'>{pesosColombianos(valor_servicios)}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </Paper>
    );
}

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);