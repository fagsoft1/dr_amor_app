import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox,
    MyCheckboxSimple
} from '../../../../../../00_utilities/components/ui/forms/fields';
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
            empresas_list,
            habitaciones_tipos_list,
        } = this.props;
        return (
            <MyFormTagModal
                fullScreen = {false}
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
                    className="col-12 col-md-2"
                    nombre='Número'
                    name='numero'
                />
                <MyCombobox
                    className="col-12 col-md-5"
                    nombre='Tipo Habitación'
                    name='tipo'
                    textField='nombre'
                    placeholder='Seleccionar Tipo Habitación'
                    valuesField='id'
                    data={_.map(habitaciones_tipos_list, h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
                    filter='contains'
                />
                <MyCombobox
                    className="col-12 col-md-5"
                    nombre='Empresa'
                    name='empresa'
                    textField='nombre'
                    placeholder='Seleccionar Empresa'
                    valuesField='id'
                    data={_.map(empresas_list, h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
                    filter='contains'
                />
                <MyCheckboxSimple
                    nombre='Activo'
                    className="col-12"
                    name='activa'
                />
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado
    }
}

Form = reduxForm({
    form: "habitacionesForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;