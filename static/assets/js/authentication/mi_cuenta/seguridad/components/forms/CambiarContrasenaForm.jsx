import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import validate from "./validate_cambiar_contrasena_form";
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";

let Form = memo(props => {
        const {
            pristine,
            submitting,
            reset,
            onSubmit,
            handleSubmit,
            error
        } = props;
        const cambiarContrasena = (values) => {
            return onSubmit(values, reset);
        };
        return (
            <form onSubmit={handleSubmit(cambiarContrasena)}>
                <MyTextFieldSimple
                    className='col-12 col-lg-4'
                    nombre='Contraseña Actual'
                    name='password_old'
                    type='password'
                />
                <MyTextFieldSimple
                    className='col-12 col-md-6 col-lg-4'
                    nombre='Contraseña Nueva'
                    name='password'
                    type='password'
                />
                <MyTextFieldSimple
                    className='col-12 col-md-6 col-lg-4'
                    nombre='Confirmar Contraseña Nueva'
                    name='password_2'
                    type='password'
                />
                <div className='mt-3'>
                    <Typography variant="caption" gutterBottom color="error">
                        {error && <strong>{error}</strong>}
                    </Typography>
                </div>

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
);

Form = reduxForm({
    form: "cambiarContrasenaForm",
    validate,
    enableReinitialize: true
})(Form);
export default Form;