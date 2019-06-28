import React, {useState, useEffect, memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CargarDatos from "../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';
import {
    HABITACIONES as bloque_1_permisos,
    TIPOS_HABITACIONES as bloque_2_permisos,
} from "../../../00_utilities/permisos/types";

import BloqueHabitaciones from './habitaciones/HabitacionCRUD';
import BloqueHabitacionesTipos from './habitaciones_tipos/HabitacionTipoCRUD';

const ListadoElementos = memo((props) => {
    const dispatch = useDispatch();
    const [slideIndex, setSlideIndex] = useState(0);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const habitaciones = useSelector(state => state.habitaciones);
    const habitaciones_tipos = useSelector(state => state.habitaciones_tipos);
    const permisos_object_1 = permisosAdapter(mis_permisos, bloque_1_permisos);
    const permisos_object_2 = permisosAdapter(mis_permisos, bloque_2_permisos);
    useEffect(() => {
            dispatch(actions.fetchMisPermisosxListado([bloque_1_permisos, bloque_2_permisos], {callback: () => cargarDatos()}))
            return () => {
                dispatch(actions.clearHabitaciones());
                dispatch(actions.clearTiposHabitaciones());
            };
        }, []
    );

    const cargarDatos = () => {
        cargarElementos();
    };

    const cargarElementos = (value = null) => {
        let index = value !== null ? value : slideIndex;
        if (index === 0) {
            dispatch(actions.fetchHabitaciones())
        } else if (index === 1) {
            dispatch(actions.fetchTiposHabitaciones())
        }
    };
    const handleChange = (event, value) => {
        if (value !== slideIndex) {
            cargarElementos(value);
        }
        setSlideIndex(value);
    };

    const can_see =
        permisos_object_1.list ||
        permisos_object_2.list;
    const plural_name = 'Habitaciones Panel';
    const singular_name = 'Habitacion Panel';
    return (
        <ValidarPermisos can_see={can_see} nombre={plural_name}>
            <Typography variant="h5" gutterBottom color="primary">
                {singular_name}
            </Typography>

            <Tabs indicatorColor="primary"
                  textColor="primary"
                  onChange={handleChange}
                  value={slideIndex}
            >
                <Tab label="Habitaciones" value={0}/>
                <Tab label="Habitaciones Tipos" value={1}/>
            </Tabs>
            {
                slideIndex === 0 &&
                <BloqueHabitaciones
                    object_list={habitaciones}
                    habitaciones_tipos_list={habitaciones_tipos}
                    permisos_object={permisos_object_1}
                />
            }
            {
                slideIndex === 1 &&
                <BloqueHabitacionesTipos
                    object_list={habitaciones_tipos}
                    permisos_object={permisos_object_2}
                />
            }
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </ValidarPermisos>
    )
});

export default ListadoElementos;