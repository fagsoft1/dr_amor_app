import React, {useState, memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyCombobox} from '../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../00_utilities/components/ui/forms/MyFormTagModal';
import NumericPad from '../../../00_utilities/NumericPad';
import validate from './validate';

let Form = memo(props => {
    const [pin, setPin] = useState('');
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        list,
        tipo_registro,
        error
    } = props;
    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit((v) => {
                onSubmit({...v, pin})
            })}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={tipo_registro}
            mostrar_submit={false}
            mostrar_limpiar={false}
            mostrar_cancelar={true}
            error={error}
        >
            <MyCombobox
                data={list}
                label_space_xs={4}
                label='Tercero'
                placeholder='Seleccionar Tercero...'
                name='id_tercero'
                className="col-12 col-md-4"
                textField='nombre'
                valuesField='id'
                filter='contains'
            />
            <NumericPad pin={pin} setPin={setPin}/>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "registarAccesoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;