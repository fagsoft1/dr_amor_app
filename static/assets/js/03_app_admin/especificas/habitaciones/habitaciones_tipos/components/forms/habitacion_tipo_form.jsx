import React, {Component} from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../../00_utilities/components/ui/forms/fields';
import {pesosColombianos} from '../../../../../../00_utilities/common';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


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
            valores,
        } = this.props;
        const {porcentaje_impuesto, valor} = valores;
        const valor_sin_iva = (valor / (1 + (porcentaje_impuesto / 100)));
        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit(onSubmit)}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <MyTextFieldSimple
                    className="col-12 col-md-4"
                    nombre='Nombre'
                    name='nombre'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-4"
                    nombre='Valor'
                    name='valor'
                />
                <MyTextFieldSimple
                    className="col-12 col-md-4"
                    nombre='% Impuesto'
                    name='porcentaje_impuesto'
                />
                <div className="col-12">
                    <span><strong>Valor sin Iva: </strong>{pesosColombianos(valor_sin_iva)}</span>
                </div>
            </MyFormTagModal>
        )
    }
}

const selector = formValueSelector('habitacionesTipoForm');

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    const values = selector(state, 'porcentaje_impuesto', 'valor');
    return {
        initialValues: item_seleccionado,
        valores: values,
    }
}

Form = reduxForm({
    form: "habitacionesTipoForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;