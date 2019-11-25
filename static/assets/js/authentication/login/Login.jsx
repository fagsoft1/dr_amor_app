import React, {Fragment} from "react";
import {useSelector, useDispatch} from "react-redux";
import {reduxForm} from 'redux-form';

import {Redirect} from "react-router-dom";
import * as actions from "../../01_actions";
import {MyTextFieldSimple} from '../../00_utilities/components/ui/forms/fields';
import validate from './forms/validate';
import asyncValidate from "./forms/asyncValidate";
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {makeStyles} from "@material-ui/core/styles/index";
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => (
    {
        iconoMain: {
            color: theme.palette.primary.dark
        }
    })
);


let Login = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        reset,
        error
    } = props;
    const classes = useStyles();
    const esta_cargando = useSelector(state => state.esta_cargando);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const cargarConfiguracionAplicacion = () => dispatch(actions.fetchConfiguracionAplicacion());
    const onSubmit = (e) => dispatch(actions.login(e.username, e.password, {callback: cargarConfiguracionAplicacion}));
    if (auth.isAuthenticated) {
        return <Redirect to="/"/>
    }

    return (
        <div className="container form-signin pt-3 text-center" style={{width: '400px'}}>
            <FontAwesomeIcon
                className={classes.iconoMain}
                icon={['far', 'lock']}
                size='5x'
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <MyTextFieldSimple
                    name='username'
                    label='Nombre de Usuario'
                    disabled={esta_cargando.cargando}
                    className='col-12'
                    onChange={() => {
                        dispatch(actions.clear_authentication_errors())
                    }}
                />
                <Fragment>
                    <MyTextFieldSimple
                        name='password'
                        label='Contraseña'
                        className='col-12'
                        type='password'
                        disabled={esta_cargando.cargando}
                        autoFocus={true}
                        onChange={() => {
                            dispatch(actions.clear_authentication_errors())
                        }}
                    />
                </Fragment>
                <div className='mt-3'>
                    <Typography variant="caption" gutterBottom color="error">
                        {error && <strong>{error}</strong>}
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    className='ml-3'
                    color='primary'
                    disabled={submitting || pristine || esta_cargando.cargando}
                    type='submit'
                >
                    Ingresar
                </Button>

                <Button
                    color="secondary"
                    variant="contained"
                    className='ml-3'
                    onClick={reset}
                    disabled={submitting || pristine || esta_cargando.cargando}
                >
                    Limpiar
                </Button>
            </form>
        </div>
    )
};

Login = reduxForm({
    form: "loginForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['username'],
    enableReinitialize: true
})(Login);
export default Login;