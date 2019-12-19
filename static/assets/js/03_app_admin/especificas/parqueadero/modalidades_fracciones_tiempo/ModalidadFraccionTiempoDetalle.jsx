import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../../permisos/validar_permisos";
import Typography from '@material-ui/core/Typography/index';
import {
    MODALIDADES_FRACCIONES_TIEMPOS,
    MODALIDADES_FRACCIONES_TIEMPOS_DETALLES
} from "../../../../permisos";

import ModalidadTiempoDetalle from './detalles/ModalidadFraccionTiempoDetalleCRUD';
import Button from "@material-ui/core/Button/index";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";

const Detail = (props) => {
    const dispatch = useDispatch();
    const modalida_fraccion_tiempo_id = props.match.params.id;
    const modalidad_fraccion_tiempo = useSelector(state => state.parqueadero_modalidades_fracciones_tiempo[modalida_fraccion_tiempo_id]);
    const cargarDatos = () => {
        dispatch(actions.fetchModalidadFraccionTiempo(modalida_fraccion_tiempo_id));
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearModalidadesFraccionesTiempos());
        };
    }, []);

    const {
        history
    } = props;

    const permisos = useTengoPermisos(MODALIDADES_FRACCIONES_TIEMPOS);
    const permisos_detalles = useTengoPermisos(MODALIDADES_FRACCIONES_TIEMPOS_DETALLES);
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
                object_list={_.mapKeys(modalidad_fraccion_tiempo.fracciones, 'id')}
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