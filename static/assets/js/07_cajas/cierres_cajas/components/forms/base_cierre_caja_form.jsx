import React, {Component} from 'react';
import {connect} from "react-redux";
import {reduxForm} from 'redux-form'
import validate from './validate';
import Button from '@material-ui/core/Button';

class BaseCierreCajaForm extends Component {
    render() {
        const {
            handleSubmit,
            onSubmit,
            initialValues,
        } = this.props;

        return (

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row p-1">
                    <div className='col-12'>
                        <Button
                            color="secondary"
                            variant="contained"
                            className='ml-3'
                            type='submit'
                        >
                            Cerrar Caja
                        </Button>
                    </div>
                </div>
            </form>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        initialValues: null
    }
}

BaseCierreCajaForm = reduxForm({
    form: "baseCierreCajaForm",
    validate,
    enableReinitialize: true
})(BaseCierreCajaForm);

BaseCierreCajaForm = (connect(mapPropsToState, null)(BaseCierreCajaForm));

export default BaseCierreCajaForm;