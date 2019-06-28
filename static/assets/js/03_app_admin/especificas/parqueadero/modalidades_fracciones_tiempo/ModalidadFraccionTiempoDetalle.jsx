import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import Typography from '@material-ui/core/Typography/index';
import {
    MODALIDADES_FRACCIONES_TIEMPOS as permisos_view,
    MODALIDADES_FRACCIONES_TIEMPOS_DETALLES as permisos_view_2
} from "../../../../00_utilities/permisos/types";

import ModalidadTiempoDetalle from './detalles/ModalidadFraccionTiempoDetalleCRUD';
import Button from "@material-ui/core/Button/index";

const Detail = (props) => {
    const dispatch = useDispatch();
    const modalida_fraccion_tiempo_id = props.match.params.id;
    const modalidad_fraccion_tiempo = useSelector(state => state.parqueadero_modalidades_fracciones_tiempo[modalida_fraccion_tiempo_id]);
    const mis_permisos = useSelector(state => state.mis_permisos);
    const modalidades_fracciones_tiempo_detalles = useSelector(state => state.parqueadero_modalidades_fracciones_tiempo_detalles);
    const cargarDatos = () => {
        const cargarModalidadDetalles = () => dispatch(actions.fetchModalidadesFraccionesTiemposDetalles_por_modalidad_fraccion_tiempo(modalida_fraccion_tiempo_id));
        dispatch(actions.fetchModalidadFraccionTiempo(modalida_fraccion_tiempo_id, {callback: cargarModalidadDetalles}));
    };
    useEffect(() => {
        dispatch(actions.fetchMisPermisosxListado([
            permisos_view,
            permisos_view_2
        ], {callback: cargarDatos}));
        return () => {
            dispatch(actions.clearModalidadesFraccionesTiempos());
            dispatch(actions.clearModalidadesFraccionesTiemposDetalles());
        };
    }, []);

    const {
        history
    } = props;
    const permisos = permisosAdapter(mis_permisos, permisos_view);
    const permisos_detalles = permisosAdapter(mis_permisos, permisos_view_2);
    if (!modalidad_fraccion_tiempo) {
        return <Typography variant="overline" gutterBottom color="primary">
            Cargando...
        </Typography>
    }
    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de modalidad fraccion tiempo'>
            <Typography variant="h5" gutterBottom color="primary">
                Detalle Modalidad Parqueadero {modalidad_fraccion_tiempo.to_string}
            </Typography>
            <Typography variant="body1" gutterBottom color="primary">
                Tipo de vehículo: {modalidad_fraccion_tiempo.tipo_vehiculo_nombre}
            </Typography>
            <ModalidadTiempoDetalle
                modalidad_fraccion_tiempo={modalidad_fraccion_tiempo}
                object_list={modalidades_fracciones_tiempo_detalles}
                permisos_object={permisos_detalles}
            />
            <Button
                color="secondary"
                variant="contained"
                className='ml-3'
                onClick={() => history.goBack()}
            >
                Regresar
            </Button>
            <CargarDatos cargarDatos={() => cargarDatos()}/>
        </ValidarPermisos>
    )
};


export default Detail