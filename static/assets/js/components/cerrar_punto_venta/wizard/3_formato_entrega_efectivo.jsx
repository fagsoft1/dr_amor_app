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

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class EntregaEfectivoForm extends Component {
    render() {
        const {handleSubmit, classes, getBack, valores} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <div>
                    <Paper className={classes.root} elevation={2}>
                        {this.props.children}
                    </Paper>
                </div>
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

const selector = formValueSelector('wizard');

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    const values = selector(state, 'dolares_cantidad', 'dolares_tasa');
    return {
        initialValues: item_seleccionado,
        valores: values,
    }
}

EntregaEfectivoForm = (connect(mapPropsToState, null)(EntregaEfectivoForm));

export default withStyles(styles)(reduxForm({
    form: 'wizard', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    validate
})(EntregaEfectivoForm))