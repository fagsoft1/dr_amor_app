import React, {Component, Fragment} from 'react';
import {MyTextFieldSimple, MyDropdownList} from '../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {reduxForm, formValueSelector} from 'redux-form'
import {pesosColombianos} from "../../../../00_utilities/common";
import {FlatIconModal} from '../../../../00_utilities/components/ui/icon/iconos_base';
import validate from './validate';


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

                        <Fragment>

                        </Fragment>
                        <FlatIconModal
                            text='Cerrar Caja'
                            className='btn btn-primary'
                            //disabled={submitting || pristine}
                            type='submit'
                        />
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