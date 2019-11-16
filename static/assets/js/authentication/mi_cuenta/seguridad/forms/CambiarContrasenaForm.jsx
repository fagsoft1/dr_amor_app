import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import validate from "./validate_cambiar_contrasena_form";
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";

import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
    card: {
        minWidth: 275,
        marginTop: '10px'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

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
        const classes = useStyles();
        return (
            <form onSubmit={handleSubmit(cambiarContrasena)}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom color="primary">
                            Cambiar Contraseña
                        </Typography>
                        <MyTextFieldSimple
                            className='col-12'
                            nombre='Contraseña Actual'
                            name='password_old'
                            type='password'
                        />
                        <MyTextFieldSimple
                            className='col-12'
                            nombre='Contraseña Nueva'
                            name='password'
                            type='password'
                        />
                        <MyTextFieldSimple
                            className='col-12'
                            nombre='Confirmar Contraseña Nueva'
                            name='password_2'
                            type='password'
                        />
                        <div className='mt-3'>
                            <Typography variant="caption" gutterBottom color="error">
                                {error && <strong>{error}</strong>}
                            </Typography>
                        </div>
                        <CardActions>
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
                                    color="secondary"
                                    variant="contained"
                                    onClick={reset}
                                    className='ml-3'
                                    disabled={submitting || pristine}
                                >
                                    Limpiar
                                </Button>
                            </div>
                        </CardActions>
                    </CardContent>
                </Card>
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