import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
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
        cuentas_contables,
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
                nombre='Descripción'
                name='descripcion'
                case='U'
            />
            <MyCombobox
                className="col-12 col-md-4"
                nombre='Naturaleza de la cuenta'
                name='naturaleza'
                textField='nombre'
                valuesField='id'
                data={[
                    {id: 'D', nombre: 'Débito'},
                    {id: 'C', nombre: 'Crédito'},
                ]}
                filter='contains'
            />
            <MyCombobox
                className="col-12"
                nombre='Cuenta padre'
                name='cuenta_padre'
                textField='nombre'
                valuesField='id'
                data={_.map(_.pickBy(cuentas_contables, c => c.tipo === 'T'), h => {
                    return ({
                        id: h.id,
                        nombre: h.to_string
                    })
                })}
                filter='contains'
            />
            <MyCombobox
                className="col-12 col-md-4"
                nombre='Tipo de cuenta'
                name='tipo'
                textField='nombre'
                valuesField='id'
                data={[
                    {id: 'T', nombre: 'Título'},
                    {id: 'D', nombre: 'Detalle'},
                ]}
                filter='contains'
            />
            <MyTextFieldSimple
                className="col-12 col-md-5"
                nombre='Código'
                name='codigo'
                type='number'
            />
            <div className="col-12" style={{height: '300px'}}>

            </div>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "cuentaContableForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;