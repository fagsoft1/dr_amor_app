import React, {memo} from 'react';
import CambiarPinForm from './forms/CambiarPinForm'
import CambiarContrasenaForm from './forms/CambiarContrasenaForm'
import {useSelector, useDispatch} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import Typography from '@material-ui/core/Typography';

const SeguridadDashboard = memo(props => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const {user} = auth;
    const onCambiarPin = (values, callback) => {
        alert('Organizar el metodo cambiar pin ahora con tercero y no usuario, sacar el tercero de mi cuenta')
        return dispatch(actions.cambiarPinTercero(user.id, values.pin, values.password, {callback}));
    };

    const onCambiarPassword = (values, callback) => {
        return dispatch(actions.cambiarContrasenaUsuario(
            user.id,
            values.password_old,
            values.password,
            values.password_2,
            {callback}
        ))
    };
    return (
        <div className="row">
            {
                user.tercero &&
                <div className="col-12">
                    <Typography variant="h4" gutterBottom color="primary">
                        Cambiar Pin
                    </Typography>
                    <CambiarPinForm onSubmit={onCambiarPin}/>
                </div>
            }
            <div className="col-12 mt-3">
                <Typography variant="h4" gutterBottom color="primary">
                    Cambiar Contraseña
                </Typography>
                <CambiarContrasenaForm onSubmit={onCambiarPassword}/>
            </div>
        </div>
    )

});

export default SeguridadDashboard;