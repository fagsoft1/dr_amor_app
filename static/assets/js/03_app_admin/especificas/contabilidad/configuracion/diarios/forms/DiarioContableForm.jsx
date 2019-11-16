import React, {useEffect, memo} from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import {useSelector, useDispatch} from "react-redux";
import * as actions from '../../../../../../01_actions';

const selector = formValueSelector('diarioContableForm');
let Form = memo(props => {
    const dispatch = useDispatch();
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
    useEffect(() => {
        dispatch(actions.fetchCuentasContablesDetalles());
        return () => dispatch(actions.clearCuentasContables());
    }, []);
    const valores = useSelector(state => selector(state, 'tipo', ''));
    const {tipo} = valores;
    const cuentas_contables = useSelector(state => state.contabilidad_cuentas_contables);
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

            <MyCombobox
                className="col-12"
                nombre='Cuenta Débito Defecto'
                name='cuenta_debito_defecto'
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
                nombre='Cuenta Crédito Defecto'
                name='cuenta_credito_defecto'
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
            <div className="col-12" style={{height: '300px'}}>

            </div>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "diarioContableForm",
    validate,
    enableReinitialize: true
})(Form);


export default Form;