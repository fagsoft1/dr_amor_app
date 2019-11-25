import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import validate from "./validate_cambiar_pin_form";
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

let Form = memo((props) => {
    const {
        onSubmit,
        pristine,
        submitting,
        reset,
        handleSubmit,
        error
    } = props;
    const cambiarPin = (values) => {
        onSubmit(values, reset);
    };
    const classes = useStyles();
    return (
        <form onSubmit={handleSubmit(cambiarPin)}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h4" gutterBottom color="primary">
                        Cambiar Pin
                    </Typography>
                    <MyTextFieldSimple
                        className='col-12'
                        label='Contraseña'
                        name='password'
                        type='password'
                    />
                    <MyTextFieldSimple
                        className='col-12'
                        label='Nuevo Pin'
                        name='pin'
                        type='password'
                    />
                    <MyTextFieldSimple
                        className='col-12'
                        label='Confirmar Nuevo Pin'
                        name='confirmar_pin'
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
                    </CardActions>
                </CardContent>
            </Card>
        </form>
    )
});

Form = reduxForm({
    form: "cambiarPinForm",
    validate,
    enableReinitialize: true
})(Form);
export default Form;