import React, {Component, Fragment} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ServicioHabitacionList from './habitacion_servicios_list'
import SelectModeloServicio from '../../dashboard/components/forms/habitacion_detail_select_acompanante_servicio'
import {FlatIconModal} from '../../../../00_utilities/components/ui/icon/iconos_base';

class HabitacionDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrar_avanzado: false,
            mostrar_terminar_servicios: false,
            mostrar_cambiar_habitacion: false
        };
        this.onSelectModelo = this.onSelectModelo.bind(this);
        this.onAdicionarServicio = this.onAdicionarServicio.bind(this);
        this.onDeleteServicio = this.onDeleteServicio.bind(this);
        this.onIniciarServicios = this.onIniciarServicios.bind(this);
        this.onTerminarServicios = this.onTerminarServicios.bind(this);
        this.onCambiarHabitacion = this.onCambiarHabitacion.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearTerceros();
        this.props.clearCategoriasFraccionesTiemposAcompanantes();
    }

    cargarDatos() {
        const {habitacion, cargando, noCargando, notificarErrorAjaxAction} = this.props;
        const cargarServicios = () => this.props.fetchServicios_por_habitacion(habitacion.id, () => noCargando(), notificarErrorAjaxAction);
        this.props.fetchTercerosPresentes(cargarServicios, notificarErrorAjaxAction);
    }

    onSelectModelo(categoria_modelo_id) {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        this.props.clearCategoriasFraccionesTiemposAcompanantes();
        cargando();
        this.props.fetchCategoriasFraccionesTiemposAcompanantes_x_categoria(categoria_modelo_id, () => noCargando(), notificarErrorAjaxAction)
    }

    onAdicionarServicio(valores) {
        const {
            adicionarServicioHabitacion,
            habitacion,
            cargando,
            noCargando,
            notificarErrorAjaxAction
        } = this.props;
        const {id_tercero, categoria_fraccion_tiempo_id} = valores;
        const cargarServicios = () => this.props.fetchServicios_por_habitacion(habitacion.id, () => noCargando(), notificarErrorAjaxAction);
        adicionarServicioHabitacion(habitacion.id, id_tercero, categoria_fraccion_tiempo_id, cargarServicios, notificarErrorAjaxAction)
    }

    onDeleteServicio(servicio_id) {
        const {deleteServicio, fetchServicio, cargando, noCargando, notificarErrorAjaxAction} = this.props;
        fetchServicio(
            servicio_id,
            (response) => {
                if (response.estado === 0) {
                    deleteServicio(servicio_id)
                }
            },
            notificarErrorAjaxAction
        );
    }

    onCambiarHabitacion(pago, nueva_habitacion_id, servicios) {
        const {
            cambiarHabitacion,
            habitacion,
            cerraModal,
            notificarAction,
            notificarErrorAjaxAction,
        } = this.props;
        const servicios_array_id = _.map(servicios, s => s.id);
        cambiarHabitacion(
            habitacion.id,
            pago,
            nueva_habitacion_id,
            servicios_array_id,
            (response) => {
                const {result} = response;
                cerraModal();
                notificarAction(result);
            },
            notificarErrorAjaxAction
        );
    }

    onTerminarServicios() {
        const {
            terminarServiciosHabitacion,
            fetchHabitacion,
            cargando,
            noCargando,
            habitacion,
            notificarErrorAjaxAction,
            notificarAction,
            cerraModal,
        } = this.props;
        cargando();
        fetchHabitacion(
            habitacion.id,
            (response) => {
                if (response.estado === 1) {
                    terminarServiciosHabitacion(
                        habitacion.id,
                        (response2) => {
                            noCargando();
                            notificarAction(response2.result);
                            cerraModal();
                        },
                        notificarErrorAjaxAction
                    )
                }
            },
            notificarErrorAjaxAction
        );
    }


    onIniciarServicios(pago) {
        const {
            iniciarServiciosHabitacion,
            habitacion,
            notificarAction,
            notificarErrorAjaxAction,
            cerraModal
        } = this.props;
        iniciarServiciosHabitacion(
            habitacion.id,
            pago,
            response => {
                notificarAction(response.result);
                this.cargarDatos();
                cerraModal();
            },
            notificarErrorAjaxAction
        );
    }

    render() {
        const {
            modal_open,
            cerraModal,
            servicios,
            habitacion,
            terceros,
            categorias_fracciones_tiempo_list,
            habitaciones,
        } = this.props;

        const {
            mostrar_avanzado,
            mostrar_terminar_servicios,
            mostrar_cambiar_habitacion
        } = this.state;

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
                        onSubmit={this.onAdicionarServicio}
                        onSelectModelo={this.onSelectModelo}
                    />
                    <div className="col-12">
                        <ServicioHabitacionList
                            habitacion={habitacion}
                            habitaciones={habitaciones}
                            mostrar_terminar_servicios={mostrar_terminar_servicios}
                            mostrar_cambiar_habitacion={mostrar_cambiar_habitacion}
                            servicios={servicios_habitacion}
                            onDeleteServicio={this.onDeleteServicio}
                            onTerminarServicios={this.onTerminarServicios}
                            onIniciarServicios={this.onIniciarServicios}
                            onCambiarHabitacion={this.onCambiarHabitacion}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    {
                        habitacion.estado === 1 &&
                        <Fragment>
                            <i
                                className={`far fa-${mostrar_avanzado ? 'minus' : 'plus'}-circle puntero`}
                                onClick={() => this.setState((s) => {
                                    return {
                                        mostrar_avanzado: !s.mostrar_avanzado,
                                        mostrar_terminar_servicios: false,
                                        mostrar_cambiar_habitacion: false
                                    }
                                })}
                                style={{position: 'absolute', left: 10}}>
                            </i>
                            {
                                mostrar_avanzado &&
                                <div style={{position: 'absolute', left: 50}}>
                            <span
                                className='puntero'
                                onClick={() => this.setState({
                                    mostrar_terminar_servicios: true,
                                    mostrar_cambiar_habitacion: false
                                })}
                            >
                                Terminar Servicio
                            </span> |
                                    <span
                                        className='puntero'
                                        onClick={() => {
                                            const {
                                                fetchHabitaciones,
                                                cargando,
                                                noCargando,
                                                notificarErrorAjaxAction
                                            } = this.props;
                                            fetchHabitaciones(
                                                () => {
                                                    cargando();
                                                    this.setState({
                                                        mostrar_terminar_servicios: false,
                                                        mostrar_cambiar_habitacion: true
                                                    })
                                                },
                                                noCargando(),
                                                notificarErrorAjaxAction
                                            )
                                        }}
                                    > Cambiar Habitacion</span>
                                </div>
                            }
                        </Fragment>
                    }
                    <FlatIconModal
                        text='Cerrar'
                        className='btn btn-primary'
                        //disabled={submitting || pristine}
                        type='submit'
                        onClick={() => cerraModal()}
                    />
                </DialogActions>
            </Dialog>
        )
    }
}

export default HabitacionDetailModal;