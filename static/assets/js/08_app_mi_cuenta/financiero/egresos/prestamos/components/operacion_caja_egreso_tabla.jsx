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
    let {operaciones_caja} = props;
    operaciones_caja = _.pickBy(operaciones_caja, e => e.tipo_operacion === 'E');
    const valor_total = _.sumBy(_.map(operaciones_caja, e => e), v => parseFloat(v.valor));
    return (
        <Paper className={classes.root}>
            <Typography variant="h6" gutterBottom color="primary">
                Prestamos
            </Typography>
            <div className="row">
                <table className='table table-responsive' style={{fontSize: '0.8rem'}}>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Descripción</th>
                        <th>Valor</th>
                    </tr>
                    </thead>
                    <tbody>
                    {_.map(operaciones_caja, s => {
                        return (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.descripcion}</td>
                                <td className='text-right'>{pesosColombianos(parseFloat(s.valor))}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Total</td>
                        <td className='text-right'></td>
                        <td className='text-right'>{pesosColombianos(valor_total)}</td>
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