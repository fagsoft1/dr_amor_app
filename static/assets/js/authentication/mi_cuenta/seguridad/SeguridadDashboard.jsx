import React, {memo} from 'react';
import CambiarPinForm from './forms/CambiarPinForm'
import CambiarContrasenaForm from './forms/CambiarContrasenaForm'
import {useSelector, useDispatch} from "react-redux";
import * as actions from "../../../01_actions";

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
                <div className="col-12 col-md-6 col-lg-3">
                    <CambiarPinForm onSubmit={onCambiarPin}/>
                </div>
            }
            <div className="col-12 col-md-6 col-lg-4">
                <CambiarContrasenaForm onSubmit={onCambiarPassword}/>
            </div>
        </div>
    )

});

export default SeguridadDashboard;