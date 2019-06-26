import React, {Fragment, memo} from 'react';
import PropTypes from "prop-types";

const ValidaPermisos = memo((props) => {
    const {can_see, nombre, children} = props;
    console.log('renderizón validar permiso')
    if (can_see) {
        return (
            <Fragment>
                {children}
            </Fragment>
        );
    } else {
        return (<Fragment>{`No tiene suficientes permisos para ver ${nombre}.`}</Fragment>)
    }
});
ValidaPermisos.propTypes = {
    can_see: PropTypes.bool,
    nombre: PropTypes.string
};
export default ValidaPermisos;