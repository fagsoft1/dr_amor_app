import React, {memo} from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {useSelector} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import InputAdornment from "@material-ui/core/InputAdornment/index";

const selector = formValueSelector('impuestosForm');

let Form = memo((props) => {
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
        error
    } = props;
    const valores = useSelector(state => selector(state, 'tipo_calculo_impuesto', ''));
    const {tipo_calculo_impuesto} = valores;
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
                nombre='Nombre'
                name='nombre'
                case='U'
            />
            <MyCombobox
                className="col-12"
                nombre='Forma Calculo Impuesto'
                name='tipo_calculo_impuesto'
                textField='nombre'
                valuesField='id'
                data={[
                    {id: 1, nombre: 'Porcentaje sobre el precio con impuestos incluidos'},
                    //{id: 2, nombre: 'Porcentaje sobre el precio'},
                    {id: 3, nombre: 'Fijo'},
                ]}
                filter='contains'
            />
            <MyCombobox
                className="col-12"
                nombre='Cuenta'
                name='cuenta_impuesto'
                textField='nombre'
                valuesField='id'
                data={_.map(cuentas_contables, h => {
                    return ({
                        id: h.id,
                        nombre: h.to_string
                    })
                })}
                filter='contains'
            />

            <MyCombobox
                className="col-12"
                nombre='Cuenta Notas Credito'
                name='cuenta_impuesto_notas_credito'
                textField='nombre'
                valuesField='id'
                data={_.map(cuentas_contables, h => {
                    return ({
                        id: h.id,
                        nombre: h.to_string
                    })
                })}
                filter='contains'
            />
            <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Impuesto Venta'
                name='tasa_importe_venta'
                InputProps={{
                    startAdornment: <InputAdornment
                        position="end">{tipo_calculo_impuesto === 3 ? '$' : '%'}</InputAdornment>,
                }}
            />
            <MyTextFieldSimple
                className="col-12 col-md-4 ml-2"
                nombre='Impuesto Compra'
                name='tasa_importe_compra'
                InputProps={{
                    startAdornment: <InputAdornment
                        position="end">{tipo_calculo_impuesto === 3 ? '$' : '%'}</InputAdornment>,
                }}
            />
            <div className="col-12" style={{height: '200px'}}>

            </div>
        </MyFormTagModal>
    )
});


Form = reduxForm({
    form: "impuestosForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;