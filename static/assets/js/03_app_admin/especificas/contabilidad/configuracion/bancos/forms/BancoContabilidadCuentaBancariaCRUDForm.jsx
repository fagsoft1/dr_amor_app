import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate_cuenta_bancaria_form';

let Form = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name,
        error,
    } = props;
    return (
        <MyFormTagModal
            fullScreen={false}
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
            error={error}
        >
            <MyTextFieldSimple
                className="col-12"
                label='Nro. Cuenta'
                name='nro_cuenta'
                case='U'
            />
            <MyTextFieldSimple
                className="col-12"
                label='Titular'
                name='titular_cuenta'
                case='U'
            />
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "cuentaBancariaForm",
    validate,
    enableReinitialize: true
})(Form);


export default Form;