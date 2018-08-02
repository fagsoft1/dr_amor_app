import React, {Component} from 'react';
import * as actions from "../../../../01_actions/01_index";
import HabitacionList from '../../habitaciones/containers/habitaciones_list';
import ServiciosList from '../../servicios/containers/servicios_list';
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {connect} from "react-redux";
import HabitacionDetailModal from '../../habitaciones/components/habitacion_modal_detail';
import ServicioDetailModal from '../../servicios/components/servicio_modal_detail';

class ServiciosDashboar extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            habitacion_id: null,
            servicio_id: null,
            modal_habitacion_open: false,
            modal_servicio_open: false,
        });
        this.cerraModalHabitacion = this.cerraModalHabitacion.bind(this);
        this.abrirModalHabitacion = this.abrirModalHabitacion.bind(this);
        this.abrirModalServicio = this.abrirModalServicio.bind(this);
        this.cerraModalServicio = this.cerraModalServicio.bind(this);
        this.onClickHabitacion = this.onClickHabitacion.bind(this);
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

            notificarErrorAction
        } = this.props;
        const cargarHabitaciones = () => this.props.fetchHabitaciones(null, notificarErrorAction);
        this.props.fetchServicios_en_proceso(cargarHabitaciones, notificarErrorAction);
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
        const {


            notificarErrorAction,
            notificarAction,
            fetchHabitacion
        } = this.props;

        fetchHabitacion(
            habitacion_id,
            (response) => {
                const {estado} = response;
                if (estado === 2 || estado === 3) {
                    callback();
                } else if (estado === 0 || estado === 1) {
                    this.abrirModalHabitacion(response)
                }

            },
            notificarErrorAction
        );
    }

    abrirModalServicio(servicio) {
        const {  notificarErrorAction} = this.props;

        this.clearDatos();
        this.props.fetchServicio(
            servicio.id,
            (response_servicio) => {
                if (response_servicio.estado === 1) {
                    this.setState({modal_servicio_open: true, servicio_id: servicio.id});
                } else {
                    this.cargarDatos();
                }

            },
            notificarErrorAction
        );
    }

    cerraModalServicio() {
        const {

        } = this.props;
        this.setState({modal_servicio_open: false, servicio_id: null});

        this.cargarDatos();
    }

    abrirModalHabitacion(habitacion) {
        const {  notificarErrorAction} = this.props;

        this.props.clearServicios();
        this.props.fetchTercerosPresentes(() => {
                this.setState({modal_habitacion_open: true, habitacion_id: habitacion.id});

            },
            notificarErrorAction
        );
    }

    cerraModalHabitacion() {
        this.setState({modal_habitacion_open: false, habitacion_id: null});
        this.cargarDatos();
    }

    render() {
        const {
            terceros,
            habitaciones,
            servicios
        } = this.props;
        const {
            modal_habitacion_open,
            habitacion_id,
            modal_servicio_open,
            servicio_id
        } = this.state;
        return (
            <div className="row">
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
                                abrirModalServicio={this.abrirModalServicio}
                                {...this.props}
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
                            <CargarDatos
                                cargarDatos={this.cargarDatos}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
        terceros: state.terceros,
        habitaciones: state.habitaciones,
        servicios: state.servicios,
        categorias_fracciones_tiempo_list: state.categorias_fracciones_tiempos_acompanantes
    }
}

export default connect(mapPropsToState, actions)(ServiciosDashboar)