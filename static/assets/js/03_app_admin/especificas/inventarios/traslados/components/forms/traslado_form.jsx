import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyCombobox} from '../../../../../../00_utilities/components/ui/forms/fields';
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
            bodegas_list,
            error
        } = this.props;
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
                <MyCombobox
                    className="col-12 col-md-6"
                    nombre='Bodega Origen'
                    name='bodega_origen'
                    valuesField='id'
                    textField='nombre'
                    data={_.map(bodegas_list, e => e)}
                    placeholder='Seleccione Bodega Origen...'
                    filter={'contains'}
                />
                <MyCombobox
                    className="col-12 col-md-6"
                    nombre='Bodega Destino'
                    name='bodega_destino'
                    valuesField='id'
                    textField='nombre'
                    data={_.map(bodegas_list, e => e)}
                    placeholder='Seleccione Bodega Destino...'
                    filter={'contains'}
                />

                <div style={{height: '300px'}}>

                </div>
            </MyFormTagModal>
        )
    }
}

Form = reduxForm({
    form: "trasladoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;