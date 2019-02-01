import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import validate from "./validate_cambiar_contrasena_form";
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
                    nombre='Contraseña Actual'
                    name='password_old'
                    type='password'
                />
                <MyTextFieldSimple
                    className='col-4'
                    nombre='Contraseña Nueva'
                    name='password'
                    type='password'
                />
                <MyTextFieldSimple
                    className='col-12 col-md-3'
                    nombre='Confirmar Contraseña Nueva'
                    name='password_2'
                    type='password'
                />

                <div className="col-12">
                    <Button
                        color="primary"
                        variant="contained"
                        type='submit'
                        className='ml-3'
                        disabled={submitting || pristine}
                    >
                        Cambiar Contraseña
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        type='submit'
                        onClick={reset}
                        className='ml-3'
                        disabled={submitting || pristine}
                    >
                        Limpiar
                    </Button>
                </div>
            </form>
        )
    }
}

Form = reduxForm({
    form: "cambiarContrasenaForm",
    validate,
    enableReinitialize: true
})(Form);
export default Form;