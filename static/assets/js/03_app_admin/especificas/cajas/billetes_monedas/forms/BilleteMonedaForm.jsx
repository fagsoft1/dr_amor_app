import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyDropdownList,
    MyCheckboxSimple
} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


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
            <MyDropdownList
                name='tipo'
                valuesField='id'
                textField='name'
                data={[
                    {id: 1, name: 'BILLETES'},
                    {id: 2, name: 'MONEDAS'},
                ]}
                label='Tipo'
                label_space_xs={4}
                placeholder='Seleccionar Tipo...'
                className='col-12'
            />
            <MyTextFieldSimple
                className="col-12"
                label='Valor'
                name='valor'
                type='number'
            />
            <MyCheckboxSimple
                className="col-12"
                label='Activo'
                name='activo'
            />
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "billetesMonedasForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;