import React, {memo, useState} from 'react';
import Timer from '../../../../00_utilities/components/system/Timer';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const HabitacionCategoriaListItem = memo(props => {
    const [mostra_cambios_estados, setCambiosEstados] = useState(false);
    const {
        habitacion,
        cambiarEstado,
        habitacion:
            {
                numero,
                estado,
                id,
                tiempo_final_servicio,
                fecha_ultimo_estado
            },
        onClickHabitacion
    } = props;

    const hora_final = estado === 1 ? tiempo_final_servicio : fecha_ultimo_estado;

    const onClickMostrarCambiarEstados = () => {
        setCambiosEstados(!mostra_cambios_estados);
    };

    const onClickCambiarEstado = (estado) => {
        cambiarEstado(estado, habitacion.id);
        setCambiosEstados(false);
    };

    const renderBotonEstado = (estado) => {
        if (habitacion.estado === estado) {
            return null
        }
        return (
            <div className="m-1 col-3">
                <FontAwesomeIcon
                    className={`est-${estado} habitacion icon puntero`}
                    icon={['far', 'circle']}
                    size='2x'
                    onClick={() => onClickCambiarEstado(estado)}
                />
            </div>
        )
    };

    const renderBotoneriaEstados = () => {
        return (
            <div className='row'>
                {renderBotonEstado(0)}
                {renderBotonEstado(2)}
                {renderBotonEstado(3)}
            </div>
        )
    };
    return (
        <div className="col-4 col-md-4 col-lg-3 habitacion-tipo-list-item">
            <div onClick={() => {
                onClickHabitacion(id, onClickMostrarCambiarEstados);
            }}
                 className={`habitacion-tipo-list-item habitacion est-${estado} puntero`}
            >
                <FontAwesomeIcon icon={['far', 'bed']}/>
                <span className="habitacion numero"> {numero}</span>
                {
                    (estado === 1 || estado === 2 || estado === 3) &&
                    <Timer hora_final={hora_final}/>
                }
            </div>
            {
                mostra_cambios_estados &&
                renderBotoneriaEstados()
            }
        </div>
    )

});

export default HabitacionCategoriaListItem;