import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';

import validate from './validate_comprobante_contable';

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
                className="col-12 col-md-4"
                label='Código Comprobante'
                name='codigo_comprobante'
                case='U'
            />
            <MyTextFieldSimple
                className="col-12 col-md-8"
                label='Descripción'
                name='descripcion'
                case='U'
            />
            <MyTextFieldSimple
                className="col-12"
                label='Título'
                name='titulo_comprobante'
                case='U'
            />
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "tipoComprobanteContableForm",
    validate,
    enableReinitialize: true
})(Form);


export default Form;