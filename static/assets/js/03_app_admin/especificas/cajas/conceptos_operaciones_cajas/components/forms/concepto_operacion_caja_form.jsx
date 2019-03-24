import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../../../00_utilities/components/ui/forms/fields';
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
            error,
        } = this.props;
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
                fullScreen = {false}
                error={error}
            >
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Descripción'
                    name='descripcion'
                    case='U'/>
                <MyCombobox
                    className="col-12"
                    name="tipo"
                    nombre='Tipo'
                    data={[
                        {id: "I", nombre: "Ingreso"},
                        {id: "E", nombre: "Egreso"},
                    ]}
                    textField='nombre'
                    valuesField='id'
                    placeholder='Tipo Operación...'
                    filter='contains'
                />
                <MyCombobox
                    className="col-12"
                    name="grupo"
                    nombre='Grupo'
                    data={[
                        {id: "A", nombre: "Acompañantes"},
                        {id: "C", nombre: "Colaboradores"},
                        {id: "P", nombre: "Proveedores"},
                        {id: "T", nombre: "Taxis"},
                        {id: "O", nombre: "Otros"},
                    ]}
                    textField='nombre'
                    valuesField='id'
                    placeholder='Tipo Operación...'
                    filter='contains'

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
    form: "algoForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;