import React, {Fragment} from 'react';
import PropTypes from "prop-types";

const ValidaPermisos = (props) => {
    const {can_see, nombre, children} = props;
    if (can_see) {
        return (
            <Fragment>
                {children}
            </Fragment>
        );
    } else {
        return (<Fragment>{`No tiene suficientes permisos para ver ${nombre}.`}</Fragment>)
    }
};
ValidaPermisos.propTypes = {
    can_see: PropTypes.bool,
    nombre: PropTypes.string
};
export default ValidaPermisos;