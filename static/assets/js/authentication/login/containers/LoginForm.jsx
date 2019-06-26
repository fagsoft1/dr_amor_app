import React, {Fragment} from "react";
import {useSelector, useDispatch} from "react-redux";
import {reduxForm} from 'redux-form';

import {Redirect} from "react-router-dom";
import * as actions from "../../../01_actions/01_index";
import {MyTextFieldSimple} from '../../../00_utilities/components/ui/forms/fields';
import validate from '../components/forms/validate';
import asyncValidate from "../components/forms/asyncValidate";
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Button from '@material-ui/core/Button';

let LoginForm = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        reset,
        error,
        classes
    } = props;
    const esta_cargando = useSelector(state => state.esta_cargando);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const onSubmit = (e) => dispatch(actions.login(e.username, e.password));
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
                    nombre='Nombre de Usuario'
                    disabled={esta_cargando.cargando}
                    className='col-12'
                    onChange={() => {
                        dispatch(actions.clear_authentication_errors())
                    }}
                />
                <Fragment>
                    <MyTextFieldSimple
                        name='password'
                        nombre='Contraseña'
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

LoginForm = reduxForm({
    form: "loginForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['username'],
    enableReinitialize: true
})(LoginForm);

const styles = theme => (
    {
        iconoMain: {
            color: theme.palette.primary.dark
        },
    })
;
export default withStyles(styles, {withTheme: true})(LoginForm);