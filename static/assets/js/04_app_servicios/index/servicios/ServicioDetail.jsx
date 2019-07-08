import React, {Fragment, memo, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogContent from '@material-ui/core/DialogContent/index';
import DialogTitle from '@material-ui/core/DialogTitle/index';
import ServicioCambiarTiempoList from './forms/ServicioDetailCambiarTiempo'
import ServicioDetailFormAnular from './forms/ServicioDetailFormAnular';
import CambioHabitacion from '../habitaciones/components/HabitacionCambioHabitacion';
import Typography from '@material-ui/core/Typography/index';
import Button from '@material-ui/core/Button/index';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index';
import * as actions from '../../../01_actions';

const ServicioDetail = memo(props => {
    const dispatch = useDispatch();
    const {
        servicio,
        cerraModal,
        modal_open
    } = props;
    const auth = useSelector(state => state.auth);
    const {user: {punto_venta_actual}} = auth;
    const servicios = useSelector(state => state.servicios);
    const habitaciones = useSelector(state => state.habitaciones);
    const categorias_fracciones_tiempo_list = useSelector(state => state.categorias_fracciones_tiempos_acompanantes);
    const [mostrar_avanzado, setMostrarAvanzado] = useState(false);
    const [mostrar_anular_servicio, setMostrarAnularServicio] = useState(false);
    const [mostrar_cambiar_tiempo, setMostrarCambiarTiempo] = useState(false);
    const [mostrar_cambiar_habitacion, setMostrarCambiarHabitacion] = useState(false);
    const cargarDatos = () => {
        dispatch(actions.fetchHabitaciones());
        dispatch(actions.fetchCategoriasFraccionesTiemposAcompanantes_x_categoria(servicio.categoria_id));

    };
    useEffect(() => {
        cargarDatos();
    }, []);

    const solicitarAnulacion = (values) => {
        dispatch(
            actions.solicitarAnulacionServicio(
                servicio.id,
                values.observacion_anulacion,
                punto_venta_actual.id,
                {callback: cerraModal}
            )
        );
    };

    const onExtenderTiempo = (values) => {
        dispatch(
            actions.cambiarTiempoServicio(
                servicio.id,
                {...values, punto_venta_id: punto_venta_actual.id},
                {callback: cerraModal}
            )
        );
    };

    const onCambiarHabitacion = (pago, nueva_habitacion_id, servicios) => {
        const servicios_array_id = _.map(servicios, s => s.id);
        dispatch(
            actions.cambiarHabitacion(
                servicio.habitacion,
                {...pago, punto_venta_id: punto_venta_actual.id},
                nueva_habitacion_id,
                servicios_array_id,
                {callback: cerraModal}
            )
        );
    };

    const categorias_fracciones_tiempo_disponibles_array = _.pickBy(categorias_fracciones_tiempo_list, c => c.fraccion_tiempo_minutos !== servicio.tiempo_minutos)

    const servicios_para_cambiar_habitacion_array = _.map(_.pickBy(servicios, s => {
        return s.acompanante === servicio.acompanante && !s.termino
    }), s => s);

    const habitaciones_para_cambiar_array = _.map(_.pickBy(habitaciones, s => s.estado === 0), s => s);

    return (
        <Dialog
            open={modal_open}
            fullScreen={true}
        >
            <DialogTitle
                id="responsive-dialog-title">{`Servicio ${servicio.acompanante_nombre}`}</DialogTitle>
            <DialogContent>
                <div className="row">
                    <div className="col-12">
                        <Typography variant="h3" gutterBottom color="primary">
                            Información
                        </Typography>
                        <div className="row">
                            <div className="col-4">
                                <strong>Habitacion: </strong>
                                <small>{servicio.habitacion_nombre}</small>
                            </div>
                            <div className="col-4">
                                <strong>Tiempo: </strong>
                                <small>{servicio.tiempo_minutos} Minutos</small>
                            </div>
                        </div>
                    </div>
                    {
                        !servicio.termino &&
                        mostrar_avanzado &&
                        <Fragment>
                            {
                                mostrar_cambiar_tiempo &&
                                <div className="col-12">
                                    <ServicioCambiarTiempoList
                                        servicio={servicio}
                                        onExtenderTiempo={onExtenderTiempo}
                                        categorias_fracciones_tiempo_list={categorias_fracciones_tiempo_disponibles_array}
                                    />
                                </div>
                            }
                            {
                                mostrar_anular_servicio &&
                                <div className="col-12">
                                    <ServicioDetailFormAnular
                                        onSubmit={solicitarAnulacion}
                                        servicio={servicio}
                                    />
                                </div>
                            }
                            {
                                mostrar_cambiar_habitacion &&
                                <div className="col-12">
                                    <CambioHabitacion
                                        habitaciones={habitaciones_para_cambiar_array}
                                        servicios={servicios_para_cambiar_habitacion_array}
                                        onCambiarHabitacion={onCambiarHabitacion}
                                        habitacion={habitaciones[servicio.habitacion]}
                                    />
                                </div>
                            }
                        </Fragment>
                    }
                </div>
            </DialogContent>
            <DialogActions>
                <FontAwesomeIcon
                    className='puntero'
                    onClick={() => {
                        setMostrarAvanzado(!mostrar_avanzado);
                        setMostrarAnularServicio(false);
                        setMostrarCambiarTiempo(false);
                    }}
                    icon={['far', `${mostrar_avanzado ? 'minus' : 'plus'}-circle`]}
                    style={{position: 'absolute', left: 10}}
                />


                {
                    mostrar_avanzado &&
                    <div style={{position: 'absolute', left: 50}}>
                            <span
                                className='puntero'
                                onClick={() => {
                                    setMostrarAnularServicio(true);
                                    setMostrarCambiarTiempo(false);
                                    setMostrarCambiarHabitacion(false);
                                }}
                            >
                                Anular
                            </span> |
                        <span
                            className='puntero'
                            onClick={() => {
                                setMostrarAnularServicio(false);
                                setMostrarCambiarTiempo(true);
                                setMostrarCambiarHabitacion(false);
                            }}
                        > Cambiar Tiempo</span> |
                        <span
                            className='puntero'
                            onClick={() => {
                                setMostrarAnularServicio(false);
                                setMostrarCambiarTiempo(false);
                                setMostrarCambiarHabitacion(true);
                            }}
                        > Cambiar Habitación</span>
                    </div>
                }
                <Button
                    color="secondary"
                    variant="contained"
                    className='ml-3'
                    onClick={() => cerraModal()}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )

});
export default ServicioDetail;