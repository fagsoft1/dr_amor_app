import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from '../../../../terceros/componentes/forms/validate';
import asyncValidate from './asyncValidate';
import CedulaForm from '../../../../terceros/componentes/forms/datos_cedula_form';
import LectorCedula from '../../../../terceros/componentes/forms/lector_cedula_form';

const modelStyle = {
    width: '100%',
    height: '100%',
    maxWidth: 'none',
};

class Form extends Component {
    render() {
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
            setSelectItem,
            error
        } = this.props;
        return (
            <MyFormTagModal
                modelStyle={modelStyle}
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
                <LectorCedula
                    setSelectItem={setSelectItem}
                >
                    <CedulaForm/>
                </LectorCedula>
            </MyFormTagModal>
        )
    }
}

Form = reduxForm({
    form: "colaboradorForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['nro_identificacion'],
    enableReinitialize: true
})(Form);


export default Form;