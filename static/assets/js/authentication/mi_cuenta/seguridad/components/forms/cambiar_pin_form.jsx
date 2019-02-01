import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import validate from "./validate_cambiar_pin_form";
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import Button from '@material-ui/core/Button';

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
                    <Button
                        color="primary"
                        type='submit'
                        variant="contained"
                        className='ml-3'
                        disabled={submitting || pristine}
                    >
                        Cambiar Pin
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                        disabled={submitting || pristine}
                        onClick={reset}
                    >
                        Limpiar
                    </Button>
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