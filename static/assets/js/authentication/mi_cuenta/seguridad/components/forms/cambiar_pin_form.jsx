import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import validate from "./validate_cambiar_pin_form";
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {FlatIconModal} from '../../../../../00_utilities/components/ui/icon/iconos_base';

class Form extends Component {
    constructor(props) {
        super(props);
        this.cambiarPin = this.cambiarPin.bind(this);
    }

    cambiarPin(values) {
        const {onSubmit, reset} = this.props;
        onSubmit(values, reset);
    }

    render() {
        const {
            pristine,
            submitting,
            reset,
            handleSubmit,
        } = this.props;
        return (
            <form onSubmit={handleSubmit(this.cambiarPin)}>
                <MyTextFieldSimple
                    className='col-4'
                    nombre='Contraseña'
                    name='password'
                    type='password'
                />
                <MyTextFieldSimple
                    className='col-12 col-md-3'
                    nombre='Nuevo Pin'
                    name='pin'
                    type='password'
                />
                <MyTextFieldSimple
                    className='col-12 col-md-3'
                    nombre='Confirmar Nuevo Pin'
                    name='confirmar_pin'
                    type='password'
                />

                <div className="col-12">
                    <FlatIconModal
                        text='Cambiar Pin'
                        disabled={submitting || pristine}
                        type='submit'
                    />
                    <FlatIconModal
                        text="Limpiar"
                        disabled={submitting || pristine}
                        onClick={reset}
                    />
                </div>
            </form>
        )
    }
}

Form = reduxForm({
    form: "cambiarPinForm",
    validate,
    enableReinitialize: true
})(Form);
export default Form;