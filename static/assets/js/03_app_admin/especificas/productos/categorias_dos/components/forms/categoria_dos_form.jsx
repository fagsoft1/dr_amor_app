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
            categorias_list,
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
                    className="col-12"
                    nombre='Nombre'
                    name='nombre'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-2"
                    nombre='Código'
                    name='codigo'
                    case='U'/>

                <MyCombobox
                    className="col-12 col-md-8"
                    nombre='Categoría'
                    name='categoria'
                    textField='nombre'
                    placeholder='Seleccionar Categoría'
                    valuesField='id'
                    data={_.map(categorias_list, h => {
                        return ({
                            id: h.id,
                            nombre: h.nombre
                        })
                    })}
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
    form: "categoriaDosProductoForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;