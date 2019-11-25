import React, {useEffect, memo} from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import {useSelector, useDispatch} from "react-redux";
import * as actions from '../../../../../../01_actions';
import validate from './validate';

const selector = formValueSelector('metodoPagoForm');
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
        dispatch(actions.fetchDiariosContables());
        dispatch(actions.fetchCuentasBancariasBancos());
        return () => {
            dispatch(actions.clearCuentasContables());
            dispatch(actions.clearDiariosContables());
            dispatch(actions.clearCuentasBancariasBancos());
        };
    }, []);
    const valores = useSelector(state => selector(state, 'tipo', ''));
    const {tipo} = valores;
    const es_bancario = tipo === 2;
    const cuentas_bancarias = useSelector(state => state.contabilidad_cuentas_bancarias);
    const cuentas_contables = useSelector(state => state.contabilidad_cuentas_contables);
    const diarios_contables = useSelector(state => state.contabilidad_diarios_contables);
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
                label='Nombre'
                name='nombre'
                case='U'
            />
            <MyCombobox
                className="col-12"
                label='Tipo de Método de pago'
                label_space_xs={4}
                placeholder='Seleccionart tipo de método...'
                name='tipo'
                textField='nombre'
                valuesField='id'
                data={[
                    {id: 1, nombre: 'Efectivo'},
                    {id: 2, nombre: 'Bancario'},
                    {id: 3, nombre: 'Credito A Mesero'},
                    {id: 4, nombre: 'Credito A Tercero'}
                ]}
                filter='contains'
            />

            <MyCombobox
                label_space_xs={4}
                label='Diario Contable'
                className="col-12"
                placeholder='Seleccionar Diario...'
                name='diario_contable'
                textField='nombre'
                valuesField='id'
                data={_.map(diarios_contables, h => {
                    return ({
                        id: h.id,
                        nombre: h.to_string
                    })
                })}
                filter='contains'
            />
            {es_bancario && <MyCombobox
                label_space_xs={4}
                label='Cuenta Bancaria'
                className="col-12"
                placeholder='Seleccionar Cuenta Bancaria...'
                name='cuenta_bancaria'
                textField='nombre'
                valuesField='id'
                data={_.map(cuentas_bancarias, h => {
                    return ({
                        id: h.id,
                        nombre: h.to_string
                    })
                })}
                filter='contains'
            />}

            <MyCombobox
                label_space_xs={4}
                label='Cuenta para método de pago'
                className="col-12"
                placeholder='Seleccionar Cuenta...'
                name='cuenta_metodo_pago'
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
                label_space_xs={4}
                label='Cuenta para método de pago devolución'
                className="col-12"
                placeholder='Seleccionar Cuenta...'
                name='cuenta_metodo_pago_devolucion'
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
            <div className="col-12" style={{height: '200px'}}>

            </div>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "metodoPagoForm",
    validate,
    enableReinitialize: true
})(Form);


export default Form;