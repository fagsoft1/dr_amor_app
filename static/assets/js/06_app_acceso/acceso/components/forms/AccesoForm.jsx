import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import NumericPad from '../../../../00_utilities/numeric_pad';
import validate from './validate';


class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pin: ''
        };
        this.setPin = this.setPin.bind(this);
        this.resetPin = this.resetPin.bind(this);
    }

    setPin(pin) {
        this.setState(function (state, props) {
            return {
                pin: `${state.pin}${pin}`
            }
        });
    }

    resetPin() {
        this.setState({pin: ''});
    }

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
            list,
            tipo_registro,
            error
        } = this.props;
        const {pin} = this.state;
        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit((v) => {
                    onSubmit({...v, pin})
                })}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={tipo_registro}
                mostrar_submit={false}
                mostrar_limpiar={false}
                mostrar_cancelar={true}
                error={error}
            >
                <MyCombobox
                    data={list}
                    name='id_tercero'
                    className="col-12 col-md-4"
                    textField='nombre'
                    valuesField='id'
                    filter='contains'
                />
                <NumericPad pin={pin} setPin={this.setPin} resetPin={this.resetPin}/>
            </MyFormTagModal>
        )
    }
}

Form = reduxForm({
    form: "registarAccesoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;