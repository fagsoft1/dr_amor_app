import React, {Component} from 'react'
import {reduxForm, formValueSelector} from 'redux-form'
import validate from './validate'
import {MyTextFieldSimple} from '../../../00_utilities/components/ui/forms/fields';
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import {connect} from "react-redux";
import {pesosColombianos} from "../../../00_utilities/common";

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class DolaresTarjetasForm extends Component {
    render() {
        const {handleSubmit, classes, valores, handleChange} = this.props;
        const {dolares_cantidad, dolares_tasa} = valores;
        return (
            <form onSubmit={handleSubmit}>
                <div className='row'>
                    <div className="col-12 col-md-4">
                        <Paper className={classes.root} elevation={2}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Pagos con Dolares
                            </Typography>
                            <MyTextFieldSimple
                                nombre='Dolares'
                                name='dolares_cantidad'
                                type='number'
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">USD</InputAdornment>,
                                }}
                                onChange={handleChange('dolares_cantidad')}
                            />
                            <MyTextFieldSimple
                                nombre='Tasa'
                                name='dolares_tasa'
                                type='number'
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                onChange={handleChange('dolares_tasa')}
                            />
                            Total: {pesosColombianos(dolares_cantidad * dolares_tasa)}
                        </Paper>
                    </div>
                    <div className="col-12 col-md-4">
                        <Paper className={classes.root} elevation={2}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Pagos con Tarjetas
                            </Typography>
                            <MyTextFieldSimple
                                nombre='Valor Tarjeta'
                                name='valor_en_tarjetas'
                                type='number'
                                onChange={handleChange('valor_en_tarjetas')}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                            <MyTextFieldSimple
                                onChange={handleChange('numero_vauchers')}
                                nombre='Nro. Vauchers'
                                name='numero_vauchers'
                                type='number'
                            />
                        </Paper>
                    </div>
                </div>
                <div className='mt-2'>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Siguiente
                    </Button>
                </div>
            </form>
        )
    }
}

const selector = formValueSelector('wizard');

function mapPropsToState(state, ownProps) {
    const values = selector(state, 'dolares_cantidad', 'dolares_tasa');
    return {
        valores: values,
    }
}

DolaresTarjetasForm = (connect(mapPropsToState, null)(DolaresTarjetasForm));

export default withStyles(styles)(reduxForm({
    form: 'wizard', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    validate
})(DolaresTarjetasForm))