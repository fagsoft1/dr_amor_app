import React, {memo} from 'react';
import {useDispatch} from 'react-redux';
import HabitacionCategoriaList from '../components/HabitacionCategoriaList';
import * as actions from '../../../../01_actions';

const HabitacionList = memo(props => {
    const dispatch = useDispatch();
    const {habitaciones, onClickHabitacion, time_now} = props;

    const onClickCambiarEstado = (estado, habitacion_id) => {
        dispatch(actions.cambiarEstadoHabitacion(habitacion_id, estado));
    };

    const ARRAY_HABITACIONES = _.map(habitaciones, habitacion => {
            return habitacion
        }
    );
    const HABITACIONES_TIPO = _.groupBy(ARRAY_HABITACIONES, 'tipo_habitacion_nombre');

    let diccionario = [];
    _.mapKeys(HABITACIONES_TIPO, (habitaciones, tipo) => {
        diccionario = [...diccionario, {"tipo": tipo, "habitaciones": habitaciones}];
    });

    return (
        <div className="row">
            {
                diccionario.map(categoria_habitacion => {
                    const {tipo, habitaciones} = categoria_habitacion;
                    return (
                        <HabitacionCategoriaList
                            onClickHabitacion={onClickHabitacion}
                            cambiarEstado={onClickCambiarEstado}
                            key={tipo}
                            cantidad={habitaciones.length}
                            tipo={tipo}
                            habitaciones={habitaciones}
                        />
                    )
                })
            }
        </div>
    )
});


export default HabitacionList