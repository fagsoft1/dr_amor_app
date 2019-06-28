import React, {useEffect, useState, memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CargarDatos from "../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';
import {
    ACOMPANANTES as bloque_1_permisos,
    CATEGORIAS_ACOMPANANTES as bloque_2_permisos,
    FRACCIONES_TIEMPOS_ACOMPANANTES as bloque_3_permisos
} from "../../../00_utilities/permisos/types";

import BloqueCategorias from './categorias/CategoriaAcompananteCRUD';
import BloqueAcompanantes from './acompanantes/AcompananteCRUD';
import BloqueFraccionesTiempo from './fracciones_tiempos/FraccionTiempoCRUD';

const ListadoElementos = memo((props) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const dispatch = useDispatch();
    const permisos_acompanantes = permisosAdapter(mis_permisos, bloque_1_permisos);
    const permisos_categorias = permisosAdapter(mis_permisos, bloque_2_permisos);
    const permisos_fracciones_tiempo = permisosAdapter(mis_permisos, bloque_3_permisos);

    const acompanantes = useSelector(state => state.acompanantes);
    const categorias_acompanantes = useSelector(state => state.categorias_acompanantes);
    const fracciones_tiempos_acompanantes = useSelector(state => state.fracciones_tiempos_acompanantes);

    useEffect(() => {
            dispatch(actions.fetchMisPermisosxListado([
                bloque_1_permisos,
                bloque_2_permisos,
                bloque_3_permisos
            ], {callback: () => cargarDatos()}));
            return () => {
                dispatch(actions.clearAcompanantes());
                dispatch(actions.clearFraccionesTiemposAcompanantes());
                dispatch(actions.clearCategoriasAcompanantes());
            };
        }, []
    );

    const cargarDatos = () => {
        cargarElementos();
    };

    const cargarElementos = (value = null) => {
        let index = value !== null ? value : slideIndex;
        if (index === 0) {
            dispatch(actions.fetchAcompanantes())
        } else if (index === 1) {
            dispatch(actions.fetchCategoriasAcompanantes())
        } else if (index === 2) {
            dispatch(actions.fetchFraccionesTiemposAcompanantes())
        }
    };
    const handleChange = (event, value) => {
        if (value !== slideIndex) {
            cargarElementos(value);
        }
        setSlideIndex(value);
    };

    const can_see =
        permisos_categorias.list ||
        permisos_acompanantes.list ||
        permisos_fracciones_tiempo.list;
    const plural_name = 'Panel Acompanantes';
    const singular_name = 'Panel Acompanante';

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
                <Tab label="Acompanantes"/>
                <Tab label="Categorias"/>
                <Tab label="Fracciones Tiempo"/>
            </Tabs>

            {
                slideIndex === 0 &&
                <BloqueAcompanantes
                    object_list={acompanantes}
                    permisos_object={permisos_acompanantes}
                />
            }
            {
                slideIndex === 1 &&
                <BloqueCategorias
                    object_list={categorias_acompanantes}
                    permisos_object={permisos_categorias}
                />
            }
            {
                slideIndex === 2 &&
                <BloqueFraccionesTiempo
                    object_list={fracciones_tiempos_acompanantes}
                    permisos_object={permisos_fracciones_tiempo}
                />
            }
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </ValidarPermisos>
    )

});

export default ListadoElementos;