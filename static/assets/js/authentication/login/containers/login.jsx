import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {reduxForm, SubmissionError} from 'redux-form';

import {Redirect} from "react-router-dom";
import * as actions from "../../../01_actions/01_index";
import {MyTextFieldSimple, MyDropdownList} from '../../../00_utilities/components/ui/forms/fields';
import {FlatIconModal} from '../../../00_utilities/components/ui/icon/iconos_base';
import validate from '../components/forms/validate';
import asyncValidate from "../components/forms/asyncValidate";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cargando_puntos_ventas: false
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    cargarPuntosVentasCliente(username) {
        const {cargando, noCargando, notificarErrorAjaxAction, notificarAction, fetchPuntosVentas_por_usuario_username} = this.props;
        cargando();
        fetchPuntosVentas_por_usuario_username(
            username,
            () => {
                this.setState({cargando_puntos_ventas: true});
                noCargando();
            },
            notificarErrorAjaxAction
        );
    }

    componentWillUnmount() {
        this.props.clearPuntosVentas();
    }


    onSubmit(e) {
        const {username, password, punto_venta = null} = e;
        this.props.login(username, password, punto_venta);
    }

    render() {
        const {
            handleSubmit,
            pristine,
            submitting,
            reset,
            puntos_ventas,
            auth,
            error
        } = this.props;
        const {cargando_puntos_ventas} = this.state;

        if (auth.isAuthenticated) {
            return <Redirect to="/"/>
        }

        const error_login = auth && auth.errors ? auth.errors : null;
        const mensaje_error = error_login && error_login.error ? error_login.error[0] : null;
        return (
            <div className="container form-signin pt-3 text-center" style={{width: '400px'}}>
                <i className="fas fa-lock fa-5x"></i>
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <MyTextFieldSimple
                        name='username'
                        nombre='Nombre de Usuario'
                        className='col-12'
                        onBlur={(e) => this.cargarPuntosVentasCliente(e.target.value)}
                        onChange={() => {
                            this.setState({cargando_puntos_ventas: false});
                            this.props.clear_authentication_errors();
                        }}
                    />
                    {
                        cargando_puntos_ventas &&
                        <Fragment>
                            <MyTextFieldSimple
                                name='password'
                                nombre='Contraseña'
                                className='col-12'
                                type='password'
                                autoFocus={true}
                                onChange={() => {
                                    this.props.clear_authentication_errors();
                                }}
                            />
                            {
                                _.size(puntos_ventas) > 0 &&
                                <MyDropdownList
                                    name='punto_venta'
                                    nombre='Seleccione punto de venta'
                                    data={_.map(puntos_ventas, p => p)}
                                    textField='nombre'
                                    valuesField='id'
                                />
                            }
                        </Fragment>
                    }
                    {
                        mensaje_error &&
                        <div className='mt-3'>
                            <strong className='form-field-error'>{mensaje_error}</strong>
                        </div>

                    }
                    {/*<p>*/}
                    {/*Don't have an account? <Link to="/register">Register</Link>*/}
                    {/*</p>*/}

                    <FlatIconModal
                        text='Ingresar'
                        disabled={submitting || pristine}
                        type='submit'
                    />

                    <FlatIconModal
                        text="Limpiar"
                        disabled={submitting || pristine}
                        onClick={reset}
                    />
                </form>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
        puntos_ventas: state.puntos_ventas
    }
}

Login = reduxForm({
    form: "loginForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['username'],
    enableReinitialize: true
})(Login);

Login = (connect(mapPropsToState, actions)(Login));

export default Login;