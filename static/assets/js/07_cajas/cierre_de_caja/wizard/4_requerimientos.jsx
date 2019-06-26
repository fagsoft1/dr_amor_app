import React, {Component} from 'react'
import {reduxForm} from 'redux-form'
import validate from './validate'
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import classNames from "classnames";
import {pesosColombianos} from "../../../00_utilities/common";
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    table: {
        fontSize: '0.7rem',
        td: {
            padding: '0 !important',
            margin: '0 !important',
        },
        tr: {
            padding: '0 !important',
            margin: '0 !important'
        }
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

class RequerimientosForm extends Component {
    render() {
        const {
            handleSubmit,
            classes,
            getBack,
            conceptos_cierre,
            operaciones_caja,
            onChangeOperacionCaja
        } = this.props;
        const suma_requerimientos = _.map(operaciones_caja, e => e.valor).reduce((acu, ele) => acu + ele, 0);
        return (
            <form onSubmit={handleSubmit}>
                <Paper className={classes.root} elevation={2}>
                    <table className={classes.table}>
                        <thead>
                        <tr className={classes.table.tr}>
                            <th>Concepto</th>
                            <th>Valor Entrega</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            _.map(conceptos_cierre, c => {
                                return <tr className={classes.table.tr} key={c.id}>
                                    <td className={classes.table.td}>{c.descripcion}</td>
                                    <td className={classNames(classes.table.td, 'text-right')}>
                                        <TextField
                                            name={`${c.id}`}
                                            className={classes.textField}
                                            onChange={e => {
                                                onChangeOperacionCaja(c.id, c.descripcion, e.target.value, c.tipo)
                                            }}
                                            margin="normal"
                                            type='number'
                                            value={operaciones_caja && operaciones_caja[c.id] ? operaciones_caja[c.id].valor : 0}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                        />
                                    </td>
                                </tr>
                            })
                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td className={classes.table.td}>Total</td>
                            <td className={classNames(classes.table.td, 'text-right')}>{pesosColombianos(suma_requerimientos)}</td>
                        </tr>
                        </tfoot>
                    </table>
                </Paper>
                <div className='mt-2'>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Siguiente
                    </Button>
                    <Button
                        onClick={getBack}
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                    >
                        Atras
                    </Button>
                </div>
            </form>
        )
    }
}


export default withStyles(styles)(reduxForm({
    form: 'wizard', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    validate
})(RequerimientosForm))