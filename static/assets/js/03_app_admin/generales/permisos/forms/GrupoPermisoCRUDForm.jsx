import React, {memo} from 'react';
import {reduxForm, reset} from 'redux-form';
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './grupo_permiso_validate';
import asyncValidate from './grupo_permiso_asyncValidate';

const afterSubmit = (result, dispatch) => {
    dispatch(reset('grupoPermisosForm'));
};

let Form = memo((props) => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        handleClose,
        modal_open,
        error,
    } = props;
    return (
        <MyFormTagModal
            fullScreen={false}
            onCancel={() => {
                onCancel();
                reset()
            }}
            onSubmit={handleSubmit(onSubmit)}
            handleClose={handleClose}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type='Grupo Permisos'
            error={error}
        >
            <MyTextFieldSimple
                className="col-12"
                label='Nombre del Grupo'
                name='name'
                case='U'/>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "grupoPermisosForm",
    onSubmitSuccess: afterSubmit,
    validate,
    asyncValidate,
    asyncBlurFields: ['name'],
    enableReinitialize: true
})(Form);

export default Form;