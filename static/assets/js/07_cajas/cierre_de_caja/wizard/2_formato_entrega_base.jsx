import React, {Component} from 'react'
import {reduxForm, formValueSelector} from 'redux-form'
import validate from './validate';
import classNames from 'classnames';
import {MyTextFieldSimple} from '../../../00_utilities/components/ui/forms/fields';
import Button from "@material-ui/core/Button/index";
import Paper from '@material-ui/core/Paper/index';
import {withStyles} from '@material-ui/core/styles/index';
import {connect} from "react-redux";

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class EntregaBaseForm extends Component {
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
                        variant="contained"
                        color="secondary"
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
    const values = selector(state, 'dolares_cantidad', 'dolares_tasa');
    return {
        valores: values,
    }
}

EntregaBaseForm = (connect(mapPropsToState, null)(EntregaBaseForm));

export default withStyles(styles)(reduxForm({
    form: 'wizard', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    validate
})(EntregaBaseForm))