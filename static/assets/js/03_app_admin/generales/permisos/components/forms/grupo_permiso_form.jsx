import React, {Component} from 'react';
import {reduxForm, reset} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './grupo_permiso_validate';
import asyncValidate from './grupo_permiso_asyncValidate';

const afterSubmit = (result, dispatch) => {
    dispatch(reset('grupoPermisosForm'));
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
            handleClose,
            modal_open,
        } = this.props;
        return (
            <MyFormTagModal
                onCancel={() => {
                    onCancel();
                    reset()
                }}
                onSubmit={handleSubmit(onSubmit)}
                handleClose={handleClose}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type='Grupo Permisos'
            >
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Nombre del Grupo'
                    name='name'
                    case='U'/>
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
    form: "grupoPermisosForm",
    onSubmitSuccess: afterSubmit,
    validate,
    asyncValidate,
    asyncBlurFields: ['name'],
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;