import React, {memo, useState, useEffect} from 'react';
import useInterval from '../../../../00_utilities/hooks/useInterval';
import * as actions from "../../../../01_actions";
import HabitacionList from '../../habitaciones/containers/HabitacionList';
import ServiciosList from '../../servicios/ServicioList';
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import HabitacionDetailModal from '../../habitaciones/components/HabitacionModalDetail';
import ServicioDetailModal from '../../servicios/ServicioDetail';
import RegistroOperacionContable
    from '../../../../07_cajas/operaciones_caja/components/forms/registro_operacion_dos_form';
import LiquidacionOpcionesDialog from '../../../../07_cajas/cuentas/ver_cuenta_abierta_listado';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import {useDispatch, useSelector} from 'react-redux';

const ServiciosDashboar = memo(props => {
    const dispatch = useDispatch();
    const {history} = props;

    const habitaciones = useSelector(state => state.habitaciones);
    const servicios = useSelector(state => state.servicios);
    const [habitacion_id, setHabitacionId] = useState(null);
    const [servicio_id, setServicioId] = useState(null);
    const [modal_habitacion_open, setModalHabitacionOpen] = useState(null);
    const [modal_servicio_open, setModalServicioOpen] = useState(null);
    const [modal_operacion_caja_open, setModalOperacionCajaOpen] = useState(null);
    const [modal_liquidacion_open, setModalLiquidacionOpen] = useState(null);

    const cargarDatos = () => {
        if (!(modal_habitacion_open || modal_servicio_open || modal_operacion_caja_open)) {
            const cargarHabitaciones = () => dispatch(
                actions.fetchHabitaciones(
                    {
                        limpiar_coleccion: false,
                        show_cargando: false
                    }
                )
            );
            dispatch(
                actions.fetchServicios_en_proceso(
                    {
                        callback: cargarHabitaciones,
                        limpiar_coleccion: false,
                        show_cargando: false
                    }
                )
            );
        }
    };

    const clearDatos = () => {
        dispatch(actions.clearHabitaciones());
        dispatch(actions.clearServicios());
    };


    const onClickHabitacion = (habitacion_id, callback = null) => {
        dispatch(actions.fetchHabitacion(
            habitacion_id,
            {
                callback:
                    (response) => {
                        const {estado} = response;
                        if (estado === 2 || estado === 3) {
                            callback();
                        } else if (estado === 0 || estado === 1) {
                            abrirModalHabitacion(response)
                        }

                    }
            }
        ));
    };

    const abrirModalHabitacion = (habitacion) => {
        dispatch(actions.clearServicios());
        dispatch(
            actions.fetchTercerosPresentes(
                {
                    callback: () => {
                        setHabitacionId(habitacion.id);
                        setModalHabitacionOpen(true);
                    }
                }
            )
        );
    };

    const abrirModalServicio = (servicio) => {
        const callback = (response_servicio) => {
            const {estado} = response_servicio;
            if (estado === 1) {
                setServicioId(servicio.id);
                setModalServicioOpen(true);
            } else {
                cargarDatos();
            }
        };
        dispatch(actions.fetchServicio(servicio.id, {callback}));
    };

    const cerraModalServicio = () => {
        setModalServicioOpen(false);
        setServicioId(null);
        cargarDatos();
    };

    const cerraModalLiquidaciones = () => {
        setModalLiquidacionOpen(false);
        cargarDatos();
    };

    const cerraModalHabitacion = () => {
        setHabitacionId(null);
        setModalHabitacionOpen(false);
        cargarDatos();
    };

    const cerraModalRegistroOperacionCaja = () => {
        setModalOperacionCajaOpen(false);
        cargarDatos();
    };


    useEffect(() => {
        cargarDatos();
        return () => {
            clearDatos();
        };
    }, []);


    useInterval(() => {
        cargarDatos();
    }, 5000);

    return (
        <div className="row">
            {
                modal_operacion_caja_open &&
                <RegistroOperacionContable
                    cerrarModal={cerraModalRegistroOperacionCaja}
                    modal_open={modal_operacion_caja_open}
                />
            }
            {
                modal_liquidacion_open &&
                <LiquidacionOpcionesDialog
                    onCancel={cerraModalLiquidaciones}
                    is_open={modal_liquidacion_open}
                    history={history}
                />
            }
            {
                modal_habitacion_open &&
                <HabitacionDetailModal
                    habitacion_id={habitacion_id}
                    cerraModal={cerraModalHabitacion}
                    modal_open={modal_habitacion_open}
                />
            }
            {
                modal_servicio_open &&
                <ServicioDetailModal
                    cerraModal={cerraModalServicio}
                    servicio={servicios[servicio_id]}
                    modal_open={modal_servicio_open}
                />
            }
            <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                        <ServiciosList
                            abrirModalServicio={abrirModalServicio}
                        />
                    </div>
                </div>
            </div>

            <div className="col-md-9">
                <div className="card">
                    <div className="card-body pt-0 mt-0">
                        <HabitacionList
                            habitaciones={habitaciones}
                            onClickHabitacion={onClickHabitacion}
                        />
                    </div>
                </div>
            </div>
            <div className="col-12 text-center mt-3">
                <Button variant="contained" color="secondary">
                    <FontAwesomeIcon
                        icon={['far', 'cash-register']}
                        size='4x'
                        onClick={() => setModalOperacionCajaOpen(true)}
                    />
                </Button>
                <Button className='ml-3' variant="contained" color="secondary">
                    <FontAwesomeIcon
                        icon={['far', 'hand-holding-usd']}
                        size='4x'
                        onClick={() => setModalLiquidacionOpen(true)}
                    />
                </Button>
            </div>
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </div>
    )
});


export default ServiciosDashboar;