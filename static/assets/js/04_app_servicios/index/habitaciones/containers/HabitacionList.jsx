import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import HabitacionCategoriaList from '../components/HabitacionCategoriaList';
import * as actions from '../../../../01_actions';
import useInterval from "../../../../00_utilities/hooks/useInterval";

const HabitacionList = memo(props => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            actions.fetchHabitaciones(
                {
                    limpiar_coleccion: false,
                    show_cargando: false
                }
            )
        );
        return () => dispatch(actions.clearHabitaciones());
    }, []);
    const {onClickHabitacion, cargarHabitaciones} = props;

    useInterval(() => {
        if (cargarHabitaciones) {
            dispatch(
                actions.fetchHabitaciones(
                    {
                        limpiar_coleccion: false,
                        show_cargando: false
                    }
                )
            )
        }
    }, 5000);

    const habitaciones = useSelector(state => state.habitaciones);


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