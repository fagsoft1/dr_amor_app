import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {reduxForm} from 'redux-form';

import {Redirect} from "react-router-dom";
import * as actions from "../../../01_actions/01_index";
import {MyTextFieldSimple, MyDropdownList} from '../../../00_utilities/components/ui/forms/fields';
import validate from '../components/forms/validate';
import asyncValidate from "../components/forms/asyncValidate";
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Button from '@material-ui/core/Button';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cargando_puntos_ventas: false
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    cargarPuntosVentasCliente(username) {
        this.props.fetchPuntosVentas_por_usuario_username(username, {callback: () => this.setState({cargando_puntos_ventas: true})});
    }

    componentWillUnmount() {
        this.props.clearPuntosVentas();
    }


    onSubmit(e) {
        const {username, password, punto_venta = null} = e;
        const callback = () => this.props.fetchMiCuenta();
        return this.props.login(username, password, punto_venta, {callback});
    }

    render() {
        const {
            handleSubmit,
            pristine,
            submitting,
            reset,
            puntos_ventas,
            auth,
            error,
            esta_cargando,
            classes
        } = this.props;
        const {cargando_puntos_ventas} = this.state;

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
                                disabled={esta_cargando.cargando}
                                autoFocus={true}
                                onChange={() => {
                                    this.props.clear_authentication_errors();
                                }}
                            />
                            {
                                _.size(puntos_ventas) > 0 &&
                                <MyDropdownList
                                    disabled={esta_cargando.cargando}
                                    name='punto_venta'
                                    nombre='Seleccione punto de venta'
                                    data={_.map(puntos_ventas, p => {
                                        return {
                                            nombre: `${p.nombre} ${p.usuario_actual ? `(Actualmente ${p.usuario_actual_nombre})` : ''}`,
                                            id: p.id
                                        }
                                    })}
                                    textField='nombre'
                                    valuesField='id'
                                />
                            }
                        </Fragment>
                    }
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

const styles = theme => (
    {
        iconoMain: {
            color: theme.palette.primary.dark
        },
    })
;

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(Login));