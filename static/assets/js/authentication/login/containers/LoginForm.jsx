import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
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

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillUnmount() {
        this.props.clearPuntosVentas();
    }


    onSubmit(e) {
        const {username, password} = e;
        const callback = () => this.props.fetchMiCuenta();
        return this.props.login(username, password, {callback});
    }

    render() {
        const {
            handleSubmit,
            pristine,
            submitting,
            reset,
            auth,
            error,
            esta_cargando,
            classes
        } = this.props;
        console.log(esta_cargando)

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
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <MyTextFieldSimple
                        name='username'
                        nombre='Nombre de Usuario'
                        disabled={esta_cargando.cargando}
                        className='col-12'
                        onChange={() => {
                            this.props.clear_authentication_errors();
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
                                this.props.clear_authentication_errors();
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
    }
}

function mapPropsToState(state, ownProps) {
    return {
        esta_cargando: state.esta_cargando,
        auth: state.auth
    }
}

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

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(LoginForm));