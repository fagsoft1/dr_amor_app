import React from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from '../../../terceros/componentes/forms/validate';

let Form = (props) => {
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
            onSubmit={handleSubmit((v) => onSubmit({...v, tipo_documento: 'NI', es_proveedor: true}))}
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
                nombre='Nombre'
                name='nombre'
                case='U'
            />
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Nit'
                name='nro_identificacion'
            />
        </MyFormTagModal>
    )
};

Form = reduxForm({
    form: "proveedoresForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;