import React from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox
} from '../../../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


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
                className="col-12 col-md-8"
                nombre='Nombre'
                name='nombre'
                case='U'
            />
            <MyTextFieldSimple
                className="col-12 col-md-8"
                nombre='Código Corto'
                name='codigo'
                case='U'
            />
            <MyCombobox
                className="col-12 col-md-4"
                nombre='Tipo de Diario'
                name='tipo'
                textField='nombre'
                valuesField='id'
                data={[
                    {id: 'General', nombre: 'General'},
                    {id: 'Venta', nombre: 'Venta'},
                    {id: 'Compra', nombre: 'Compra'},
                    {id: 'Efectivo', nombre: 'Efectivo'},
                    {id: 'Banco', nombre: 'Banco'},
                ]}
                filter='contains'
            />
            <div className="col-12" style={{height: '300px'}}>

            </div>
        </MyFormTagModal>
    )
};

Form = reduxForm({
    form: "diarioContableForm",
    validate,
    enableReinitialize: true
})(Form);


export default Form;