import React, {memo, useState} from 'react';
import * as actions from "../../../01_actions";
import HabitacionList from '../habitaciones/containers/HabitacionList';
import ServiciosList from '../servicios/ServicioList';
import HabitacionDetailModal from '../habitaciones/components/HabitacionModalDetail';
import ServicioDetailModal from '../servicios/ServicioDetail';
import RegistroOperacionCajaModalForm
    from '../../../07_cajas/operaciones_caja/components/forms/RegistroOperacionCajaModalForm';
import LiquidacionOpcionesDialog from '../../../07_cajas/cuentas/ver_cuenta_abierta_listado';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import {useDispatch} from 'react-redux';

const ServiciosDashboar = memo(props => {
    const dispatch = useDispatch();
    const {history} = props;

    const [habitacion_id, setHabitacionId] = useState(null);
    const [servicio_id, setServicioId] = useState(null);
    const [modal_habitacion_open, setModalHabitacionOpen] = useState(null);
    const [modal_servicio_open, setModalServicioOpen] = useState(null);
    const [modal_operacion_caja_open, setModalOperacionCajaOpen] = useState(null);
    const [modal_liquidacion_open, setModalLiquidacionOpen] = useState(null);


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
        setHabitacionId(habitacion.id);
        setModalHabitacionOpen(true);
    };

    const abrirModalServicio = (servicio_id) => {
        const callback = (response_servicio) => {
            const {estado} = response_servicio;
            if (estado === 1) {
                setServicioId(servicio_id);
                setModalServicioOpen(true);
            }
        };
        dispatch(actions.fetchServicio(servicio_id, {callback}));
    };

    const cerraModalServicio = () => {
        setModalServicioOpen(false);
        setServicioId(null);
    };

    const cerraModalLiquidaciones = () => {
        setModalLiquidacionOpen(false);
    };

    const cerraModalHabitacion = () => {
        setHabitacionId(null);
        setModalHabitacionOpen(false);
    };

    const cerraModalRegistroOperacionCaja = () => {
        setModalOperacionCajaOpen(false);
    };

    return (
        <div className="row">
            {modal_operacion_caja_open && <RegistroOperacionCajaModalForm
                cerrarModal={cerraModalRegistroOperacionCaja}
                modal_open={modal_operacion_caja_open}
            />}
            {/*{modal_operacion_caja_open && <RegistroOperacionContable*/}
            {/*    cerrarModal={cerraModalRegistroOperacionCaja}*/}
            {/*    modal_open={modal_operacion_caja_open}*/}
            {/*/>}*/}
            {modal_liquidacion_open && <LiquidacionOpcionesDialog
                onCancel={cerraModalLiquidaciones}
                is_open={modal_liquidacion_open}
                history={history}
            />}
            {modal_habitacion_open && <HabitacionDetailModal
                habitacion_id={habitacion_id}
                cerraModal={cerraModalHabitacion}
                modal_open={modal_habitacion_open}
            />}
            {modal_servicio_open && <ServicioDetailModal
                cerraModal={cerraModalServicio}
                servicio_id={servicio_id}
                modal_open={modal_servicio_open}
            />}
            <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                        <ServiciosList
                            cargarServiciosEnProceso={!(modal_habitacion_open || modal_servicio_open || modal_operacion_caja_open)}
                            abrirModalServicio={abrirModalServicio}
                        />
                    </div>
                </div>
            </div>

            <div className="col-md-9">
                <div className="card">
                    <div className="card-body pt-0 mt-0">
                        <HabitacionList
                            cargarHabitaciones={!(modal_habitacion_open || modal_servicio_open || modal_operacion_caja_open)}
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
        </div>
    )
});


export default ServiciosDashboar;