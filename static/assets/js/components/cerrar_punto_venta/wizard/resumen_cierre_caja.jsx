import React, {Component} from 'react'
import {reduxForm, formValueSelector} from 'redux-form'
import validate from './validate'
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import classNames from "classnames";
import {pesosColombianos} from "../../../00_utilities/common";

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
            margin: '0 !important',
        }
    },
});

class ResumenForm extends Component {
    render() {
        const {
            reset,
            handleSubmit,
            handleReset,
            getBack,
            classes,
            estados
        } = this.props;
        const {
            dolares_cantidad,
            dolares_tasa,
            valor_en_tarjetas,
            numero_vauchers,
            denominaciones_base,
            denominaciones_entrega,
            operaciones_caja
        } = estados;
        const suma_requerimientos = _.map(operaciones_caja, e => e.valor).reduce((acu, ele) => acu + ele, 0);
        const suma_base = _.map(denominaciones_base, e => e.total).reduce((acu, ele) => acu + ele, 0);
        const suma_efectivo = _.map(denominaciones_entrega, e => e.total).reduce((acu, ele) => acu + ele, 0);
        return (
            <form onSubmit={handleSubmit}>
                <Paper className={classes.root} elevation={2}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Resumen Cierre de Caja
                    </Typography>
                    <table className='table table-responsive'>
                        <thead>
                        <tr className={classes.table.tr}>
                            <th>Tipo</th>
                            <th>Valor</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className={classes.table.tr}>
                            <td className={classes.table.td}>Base</td>
                            <td className={classNames(classes.table.td, 'text-right')}>{pesosColombianos(suma_base)}</td>
                        </tr>
                        <tr className={classes.table.tr}>
                            <td className={classes.table.td}>En Efectivo</td>
                            <td className={classNames(classes.table.td, 'text-right')}>{pesosColombianos(suma_efectivo)}</td>
                        </tr>
                        <tr className={classes.table.tr}>
                            <td className={classes.table.td}>En Dolares
                                ({dolares_cantidad} USD
                                x {pesosColombianos(dolares_tasa)})
                            </td>
                            <td className={classNames(classes.table.td, 'text-right')}>{pesosColombianos(dolares_cantidad * dolares_tasa)}</td>
                        </tr>
                        <tr className={classes.table.tr}>
                            <td className={classes.table.td}>En Tarjetas
                                ({numero_vauchers} Vauchers)
                            </td>
                            <td className={classNames(classes.table.td, 'text-right')}>{pesosColombianos(valor_en_tarjetas)}</td>
                        </tr>
                        {
                            _.size(operaciones_caja) > 0 &&
                            _.map(operaciones_caja, o =>
                                <tr className={classes.table.tr} key={o.id}>
                                    <td className={classes.table.td}>
                                        {o.concepto_descripcion}
                                    </td>
                                    <td className={classNames(classes.table.td, 'text-right')}>{pesosColombianos(o.valor)}</td>
                                </tr>
                            )
                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td className={classes.table.td}>Total</td>
                            <td className={classNames(classes.table.td, 'text-right')}>{pesosColombianos(suma_base + suma_efectivo + suma_requerimientos + (parseFloat(dolares_cantidad) * parseFloat(dolares_tasa)) + parseFloat(valor_en_tarjetas))}</td>
                        </tr>
                        </tfoot>
                    </table>
                </Paper>
                <div className='mt-2 text-right'>
                    <Button
                        onClick={getBack}
                        color="secondary"
                        variant="contained"
                    >
                        Atras
                    </Button>
                    <Button
                        onClick={() => {
                            reset();
                            handleReset();
                        }}
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                    >
                        Limpiar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className='ml-3'
                    >
                        Cerrar Caja
                    </Button>
                </div>
            </form>
        )
    }
}

const selector = formValueSelector('wizard');

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    const values = selector(state, 'dolares_cantidad', 'dolares_tasa');
    return {
        initialValues: item_seleccionado,
        valores: values,
    }
}

ResumenForm = (connect(mapPropsToState, null)(ResumenForm));

export default withStyles(styles)(reduxForm({
    form: 'wizard', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    validate
})(ResumenForm))