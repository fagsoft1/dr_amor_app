import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyCombobox, MyTextFieldSimple} from '../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../00_utilities/components/ui/forms/MyFormTagModal';
import InputAdornment from "@material-ui/core/InputAdornment/index";


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
        error,
        puntos_venta_list
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
            element_type='Apertura de punto de venta'
            error={error}
        >
            <MyCombobox
                className="col-12 col-md-8"
                label='Punto de Venta'
                label_space_xs={4}
                name='punto_venta_id'
                textField='nombre'
                placeholder='Seleccionar Punto de Venta...'
                valuesField='id'
                data={_.map(puntos_venta_list, h => {
                    return ({
                        id: h.id,
                        nombre: h.nombre
                    })
                })}
                filter='contains'
            />
            <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Valor Base'
                name='base_inicial_efectivo'
                type='number'
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
            />
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "aperturaPuntoVentaForm",
    enableReinitialize: true
})(Form);

export default Form;