import React, {memo} from 'react';
import PropTypes from "prop-types";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const style = {
    cursor: 'pointer',
    position: 'fixed',
    top: '80px',
    right: '40px',
    '&:hover': {
        color: 'red',
    },
    '&:active': {
        color: 'green',
    },
};
const CargarDatos = memo(props => <FontAwesomeIcon
    style={style}
    onClick={props.cargarDatos}
    icon={['far', 'sync-alt']}
    size='2x'
/>);

CargarDatos.propTypes = {
    cargarDatos: PropTypes.func
};

export default CargarDatos;