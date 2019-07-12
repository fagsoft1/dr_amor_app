import React, {Fragment, memo, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ServicioHabitacionList from './HabitacionServicioList'
import SelectModeloServicio from '../../dashboard/components/forms/HabitacionModalDetailSelectAcompanante'
import Button from '@material-ui/core/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as actions from '../../../../01_actions';

const HabitacionModalDetail = memo(props => {
    const dispatch = useDispatch();
    const {
        modal_open,
        cerraModal,
        habitacion_id,
    } = props;
    const auth = useSelector(state => state.auth);
    const servicios = useSelector(state => state.servicios);
    const terceros = useSelector(state => state.terceros);
    const habitaciones = useSelector(state => state.habitaciones);
    const categorias_fracciones_tiempo_list = useSelector(state => state.categorias_fracciones_tiempos_acompanantes);
    const habitacion = habitaciones[habitacion_id];
    const {user: {punto_venta_actual}} = auth;
    const [mostrar_avanzado, setMostrarAvanzado] = useState(false);
    const [mostrar_terminar_servicios, setMostrarTerminarServicio] = useState(false);
    const [mostrar_cambiar_habitacion, setMostrarCambiarHabitacion] = useState(false);
    const [servicios_nuevos, setServiciosNuevos] = useState({});

    const cargarDatos = () => {
        const cargarServicios = () => dispatch(actions.fetchServicios_por_habitacion(habitacion.id));
        dispatch(actions.fetchTercerosPresentes({callback: cargarServicios}));
    };

    const onSelectModelo = (categoria_modelo_id) => {
        dispatch(actions.clearCategoriasFraccionesTiemposAcompanantes());
        dispatch(actions.fetchCategoriasFraccionesTiemposAcompanantes_x_categoria(categoria_modelo_id));
    };

    const onDeleteServicio = (servicio_id) => {
        setServiciosNuevos(_.omit(servicios_nuevos, servicio_id));
    };

    const onCambiarHabitacion = (pago, nueva_habitacion_id, servicios) => {
        const servicios_array_id = _.map(servicios, s => s.id);
        dispatch(actions.cambiarHabitacion(
            habitacion.id,
            {...pago, punto_venta_id: punto_venta_actual.id},
            nueva_habitacion_id,
            servicios_array_id,
            {callback: cerraModal}
        ));
    };

    const onTerminarServicios = () => {
        dispatch(actions.fetchHabitacion(
            habitacion.id,
            {
                callback:
                    (response) => {
                        if (response.estado === 1) {
                            dispatch(actions.terminarServiciosHabitacion(
                                habitacion.id,
                                punto_venta_actual.id,
                                {callback: cerraModal}
                            ))
                        }
                    }
            }
        ));
    };

    const onIniciarServicios = (pago) => {
        dispatch(actions.iniciarServiciosHabitacion(
            habitacion.id,
            {...pago, punto_venta_id: punto_venta_actual.id},
            _.map(_.orderBy(servicios_nuevos, ['tiempo_minutos'], ['desc']), e => e),
            {
                callback:
                    () => {
                        dispatch(actions.fetchHabitaciones());
                        dispatch(actions.fetchServicios_en_proceso());
                        cerraModal();
                    }
            }
        ));
    };

    const onAdicionarServicio = (valores) => {
        const {id_tercero, categoria_fraccion_tiempo_id} = valores;
        const tercero = terceros[valores.id_tercero];
        const categoria_tiempo = categorias_fracciones_tiempo_list[valores.categoria_fraccion_tiempo_id];

        const valor_habitacion = parseFloat(habitacion.valor_antes_impuestos).toFixed(0);
        const valor_impuesto = parseFloat(habitacion.impuesto).toFixed(0);
        const valor_servicio = parseFloat(categoria_tiempo.valor) + parseFloat(habitacion.valor_adicional_servicio);

        const maximo = _.size(servicios_nuevos) > 0 ? _.max(_.map(servicios_nuevos, e => e.id)) : 0;

        const servicio_nuevo = {
            id: maximo + 1,
            id_temp: `nue_${maximo + 1}`,
            tercero_id: id_tercero,
            categoria_fraccion_tiempo_id: categoria_fraccion_tiempo_id,
            acompanante_nombre: tercero.full_name_proxy,
            tiempo_minutos: categoria_tiempo.fraccion_tiempo_minutos,
            categoria: categoria_tiempo.categoria_nombre,
            valor_servicio: valor_servicio,
            valor_habitacion: valor_habitacion,
            valor_iva_habitacion: valor_impuesto,
            valor_total: parseFloat(valor_habitacion) + parseFloat(valor_impuesto) + valor_servicio,
            nuevo: true
        };
        setServiciosNuevos({...servicios_nuevos, [servicio_nuevo.id_temp]: servicio_nuevo})
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearTerceros());
            dispatch(actions.clearCategoriasFraccionesTiemposAcompanantes());
        }
    }, []);

    if (!habitacion) {
        return (
            <div>Cargando</div>
        )
    }

    const servicios_habitacion = _.map(
        _.pickBy(servicios, s => s.habitacion === habitacion.id),
        s => s
    );

    const acompanantes_en_habitacion = servicios_habitacion.map(s => s.acompanante);

    const terceros_presentes = _.map(_.pickBy(terceros, t => {
        return (
            t.presente &&
            t.es_acompanante &&
            (t.estado === 0 || acompanantes_en_habitacion.includes(t.id))
        )
    }), i => i);

    return (
        <Dialog
            open={modal_open}
            fullScreen={true}
        >
            <DialogTitle
                id="responsive-dialog-title">{`${habitacion.tipo_habitacion_nombre} ${habitacion.numero}`}</DialogTitle>
            <DialogContent>
                <SelectModeloServicio
                    categorias_fracciones_tiempo_list={categorias_fracciones_tiempo_list}
                    terceros_presentes={terceros_presentes}
                    onSubmit={onAdicionarServicio}
                    onSelectModelo={onSelectModelo}
                />
                <div className="col-12">
                    <ServicioHabitacionList
                        habitacion={habitacion}
                        habitaciones={habitaciones}
                        mostrar_terminar_servicios={mostrar_terminar_servicios}
                        mostrar_cambiar_habitacion={mostrar_cambiar_habitacion}
                        servicios={servicios_habitacion}
                        servicios_nuevos={servicios_nuevos}
                        onDeleteServicio={onDeleteServicio}
                        onTerminarServicios={onTerminarServicios}
                        onIniciarServicios={onIniciarServicios}
                        onCambiarHabitacion={onCambiarHabitacion}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                {
                    habitacion.estado === 1 &&
                    <Fragment>
                        <FontAwesomeIcon
                            className='puntero'
                            icon={['far', `${mostrar_avanzado ? 'minus' : 'plus'}-circle`]}
                            onClick={() => {
                                setMostrarAvanzado(!mostrar_avanzado);
                                setMostrarTerminarServicio(false);
                                setMostrarCambiarHabitacion(false);
                            }}
                            style={{position: 'absolute', left: 10}}
                        />
                        {
                            mostrar_avanzado &&
                            <div style={{position: 'absolute', left: 50}}>
                            <span
                                className='puntero'
                                onClick={() => {
                                    setMostrarCambiarHabitacion(false);
                                    setMostrarTerminarServicio(true);
                                }}
                            >
                                Terminar Servicio
                            </span> |
                                <span
                                    className='puntero'
                                    onClick={() => {
                                        const callback = () => {
                                            setMostrarTerminarServicio(false);
                                            setMostrarCambiarHabitacion(true);
                                        };
                                        dispatch(actions.fetchHabitaciones({callback, limpiar_coleccion: false}));
                                    }}
                                > Cambiar Habitacion
                            </span>
                            </div>
                        }
                    </Fragment>
                }
                <Button
                    color="primary"
                    variant="contained"
                    className='ml-3'
                    onClick={cerraModal}
                >
                    Cerrar
                </Button>

            </DialogActions>
        </Dialog>
    )

});

export default HabitacionModalDetail;