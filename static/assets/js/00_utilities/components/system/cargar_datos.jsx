import React from 'react';
import PropTypes from "prop-types";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function CargarDatos(props) {
    const {cargarDatos} = props;
    return (
        <div
            className='boton-flotante'
            style={{cursor: "pointer"}}
            onClick={() => {
                cargarDatos();
            }}
        >
            <FontAwesomeIcon icon={['far', 'sync-alt']} size='2x'/> :
        </div>
    )
}
CargarDatos.propTypes = {
    cargarDatos: PropTypes.func
};