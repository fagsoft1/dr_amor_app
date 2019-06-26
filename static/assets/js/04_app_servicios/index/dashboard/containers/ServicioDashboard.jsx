import React, {Component} from 'react';
import * as actions from "../../../../01_actions/01_index";
import HabitacionList from '../../habitaciones/containers/HabitacionList';
import ServiciosList from '../../servicios/containers/ServiciosLIst';
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import {connect} from "react-redux";
import HabitacionDetailModal from '../../habitaciones/components/HabitacionModalDetail';
import ServicioDetailModal from '../../servicios/components/ServicioModalDetail';
import RegistroOperacionContable
    from '../../../../07_cajas/operaciones_caja/components/forms/registro_operacion_dos_form';
import LiquidacionOpcionesDialog from '../../../../07_cajas/cuentas/ver_cuenta_abierta_listado';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';

class ServiciosDashboar extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            habitacion_id: null,
            servicio_id: null,
            modal_habitacion_open: false,
            modal_servicio_open: false,
            modal_operacion_caja_open: false,
            modal_liquidacion_open: false
        });
        this.cerraModalHabitacion = this.cerraModalHabitacion.bind(this);
        this.abrirModalHabitacion = this.abrirModalHabitacion.bind(this);
        this.abrirModalServicio = this.abrirModalServicio.bind(this);
        this.cerraModalLiquidaciones = this.cerraModalLiquidaciones.bind(this);
        this.cerraModalServicio = this.cerraModalServicio.bind(this);
        this.onClickHabitacion = this.onClickHabitacion.bind(this);
        this.cerraModalRegistroOperacionCaja = this.cerraModalRegistroOperacionCaja.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.clearDatos = this.clearDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
        this.interval = setInterval(
            () => {
                this.cargarDatos();
            }, 5000
        );
    }

    cargarDatos() {
        const {
            modal_habitacion_open,
            modal_servicio_open,
            modal_operacion_caja_open
        } = this.state;
        if (!(modal_habitacion_open || modal_servicio_open || modal_operacion_caja_open)) {
            const cargarHabitaciones = () => this.props.fetchHabitaciones(
                {
                    limpiar_coleccion: false,
                    show_cargando: false
                }
            );
            this.props.fetchServicios_en_proceso(
                {
                    callback: cargarHabitaciones,
                    limpiar_coleccion: false,
                    show_cargando: false
                }
            );
        }
    }

    clearDatos() {
        this.props.clearHabitaciones();
        this.props.clearServicios();
    }

    componentWillUnmount() {
        this.clearDatos();
        clearInterval(this.interval);
    }

    onClickHabitacion(habitacion_id, callback = null) {
        const {fetchHabitacion} = this.props;
        fetchHabitacion(
            habitacion_id,
            {
                callback:
                    (response) => {
                        const {estado} = response;
                        if (estado === 2 || estado === 3) {
                            callback();
                        } else if (estado === 0 || estado === 1) {
                            this.abrirModalHabitacion(response)
                        }

                    }
            }
        );
    }

    abrirModalServicio(servicio) {
        const callback = (response_servicio) => {
            const {estado} = response_servicio;
            if (estado === 1) {
                this.setState({modal_servicio_open: true, servicio_id: servicio.id});
            } else {
                this.cargarDatos();
            }
        };
        this.props.fetchServicio(servicio.id, {callback});
    }

    cerraModalServicio() {
        this.setState({modal_servicio_open: false, servicio_id: null});
        this.cargarDatos();
    }

    cerraModalLiquidaciones() {
        this.setState({modal_liquidacion_open: false});
        this.cargarDatos();
    }

    abrirModalHabitacion(habitacion) {
        this.props.clearServicios();
        this.props.fetchTercerosPresentes(
            {
                callback: () => this.setState({modal_habitacion_open: true, habitacion_id: habitacion.id})
            }
        );
    }

    cerraModalHabitacion() {
        this.setState({modal_habitacion_open: false, habitacion_id: null});
        this.cargarDatos();
    }

    cerraModalRegistroOperacionCaja() {
        this.setState({modal_operacion_caja_open: false});
        this.cargarDatos();
    }

    render() {
        const {
            terceros,
            habitaciones,
            servicios,
            history
        } = this.props;
        const {
            modal_habitacion_open,
            habitacion_id,
            modal_servicio_open,
            modal_operacion_caja_open,
            modal_liquidacion_open,
            servicio_id
        } = this.state;
        return (
            <div className="row">
                {
                    modal_operacion_caja_open &&
                    <RegistroOperacionContable
                        {...this.props}
                        cerrarModal={this.cerraModalRegistroOperacionCaja}
                        modal_open={modal_operacion_caja_open}
                    />
                }
                {
                    modal_liquidacion_open &&
                    <LiquidacionOpcionesDialog
                        onCancel={this.cerraModalLiquidaciones}
                        is_open={modal_liquidacion_open}
                        history={history}
                    />
                }
                {
                    modal_habitacion_open &&
                    <HabitacionDetailModal
                        {...this.props}
                        cerraModal={this.cerraModalHabitacion}
                        habitacion={habitaciones[habitacion_id]}
                        habitaciones={habitaciones}
                        modal_open={modal_habitacion_open}
                        terceros={terceros}
                    />
                }
                {
                    modal_servicio_open &&
                    <ServicioDetailModal
                        {...this.props}
                        cerraModal={this.cerraModalServicio}
                        servicio={servicios[servicio_id]}
                        modal_open={modal_servicio_open}
                    />
                }
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <ServiciosList
                                {...this.props}
                                abrirModalServicio={this.abrirModalServicio}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="card">
                        <div className="card-body pt-0 mt-0">
                            <HabitacionList
                                {...this.props}
                                onClickHabitacion={this.onClickHabitacion}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12 text-center mt-3">
                    <Button variant="contained" color="secondary">
                        <FontAwesomeIcon
                            icon={['far', 'cash-register']}
                            size='4x'
                            onClick={() => this.setState({modal_operacion_caja_open: true})}
                        />
                    </Button>
                    <Button className='ml-3' variant="contained" color="secondary">
                        <FontAwesomeIcon
                            icon={['far', 'hand-holding-usd']}
                            size='4x'
                            onClick={() => this.setState({modal_liquidacion_open: true})}
                        />
                    </Button>
                </div>
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        terceros: state.terceros,
        auth: state.auth,
        habitaciones: state.habitaciones,
        servicios: state.servicios,
        categorias_fracciones_tiempo_list: state.categorias_fracciones_tiempos_acompanantes
    }
}

export default connect(mapPropsToState, actions)(ServiciosDashboar)