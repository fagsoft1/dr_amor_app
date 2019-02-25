import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from '../../../../terceros/componentes/forms/validate';
import asyncValidate from './asyncValidate';
import CedulaForm from '../../../../terceros/componentes/forms/datos_cedula_form';
import LectorCedula from '../../../../terceros/componentes/forms/lector_cedula_form';

const modelStyle = {
    width: '100%',
    height: '100%',
    maxWidth: 'none',
};

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
            setSelectItem,
            categorias_list,
        } = this.props;
        return (
            <MyFormTagModal
                modelStyle={modelStyle}
                onCancel={onCancel}
                onSubmit={handleSubmit(onSubmit)}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <LectorCedula
                    setSelectItem={setSelectItem}
                >
                    <CedulaForm/>
                    <MyTextFieldSimple
                        className='col-12 col-md-6'
                        nombre='Alias'
                        name='alias_modelo'
                        case='U'
                    />
                    <MyCombobox
                        className="col-12 col-md-6"
                        name="categoria_modelo"
                        nombre='Categoria'
                        data={_.map(categorias_list, e => {
                            return {
                                id: e.id,
                                nombre: e.nombre,
                            }
                        })}
                        textField='nombre'
                        valuesField='id'
                        placeholder='Categoría Modelo...'
                        filter='contains'
                    />
                </LectorCedula>
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
    form: "acompanantesForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['nro_identificacion', 'tipo_documento'],
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;