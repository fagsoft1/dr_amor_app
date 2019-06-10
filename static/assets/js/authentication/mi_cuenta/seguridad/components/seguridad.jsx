import React, {Component} from 'react';
import CambiarPinForm from './forms/cambiar_pin_form'
import CambiarContrasenaForm from './forms/cambiar_contrasena_form'
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import Typography from '@material-ui/core/Typography';

class Seguridad extends Component {
    constructor(props) {
        super(props);
        this.onCambiarPin = this.onCambiarPin.bind(this);
        this.onCambiarPassword = this.onCambiarPassword.bind(this);
    }

    onCambiarPin(values, callback) {
        const {auth: {user}} = this.props;
        alert('Organizar el metodo cambiar pin ahora con tercero y no usuario, sacar el tercero de mi cuenta')
        this.props.cambiarPinTercero(user.id, values.pin, values.password, {callback});
    }

    onCambiarPassword(values, callback) {
        const {auth: {user}} = this.props;
        this.props.cambiarContrasenaUsuario(
            user.id,
            values.password_old,
            values.password,
            values.password_2,
            {callback}
        )
    }

    render() {
        const {auth: {user}} = this.props;
        return (
            <div className="row">
                {
                    user.tercero &&
                    <div className="col-12">
                        <Typography variant="h4" gutterBottom color="primary">
                            Cambiar Pin
                        </Typography>
                        <CambiarPinForm onSubmit={this.onCambiarPin}/>
                    </div>
                }
                <div className="col-12 mt-3">
                    <Typography variant="h4" gutterBottom color="primary">
                        Cambiar Contraseña
                    </Typography>
                    <CambiarContrasenaForm onSubmit={this.onCambiarPassword}/>
                </div>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth
    }
}

export default connect(mapPropsToState, actions)(Seguridad)