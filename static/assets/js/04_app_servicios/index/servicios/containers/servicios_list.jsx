import React, {Component} from 'react';

import ServicioListItem from '../../servicios/components/servicio_list_item';

class ServicioList extends Component {
    constructor(props) {
        super(props);
        this.state = {busqueda: ''}
        this.cargarServicio = this.cargarServicio.bind(this);
        this.terminarServicio = this.terminarServicio.bind(this);
        this.onBusquedaChange = this.onBusquedaChange.bind(this);
    }

    terminarServicio(servicio_id) {
        const {
            fetchServicios_en_proceso,
            terminarServicio,
            fetchHabitaciones,
            cargando,
            noCargando,
            notificarErrorAjaxAction,
            notificarAction
        } = this.props;
        cargando();
        const cargarHabitaciones = () => fetchHabitaciones(() => noCargando(), notificarErrorAjaxAction);
        const cargarServiciosEnProceso = () => fetchServicios_en_proceso(cargarHabitaciones, notificarErrorAjaxAction);
        terminarServicio(
            servicio_id,
            (response) => {
                const {result} = response;
                notificarAction(result);
                cargarServiciosEnProceso()
            },
            notificarErrorAjaxAction
        );
    }

    onBusquedaChange(event) {
        this.setState({busqueda: event.target.value})
    }

    cargarServicio(id) {
        const {
            fetchServicio,
            cargando,
            noCargando,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        fetchServicio(id, () => noCargando(), notificarErrorAjaxAction);
    }

    render() {
        const {servicios, abrirModalServicio} = this.props;
        const {busqueda} = this.state;
        const servicios_ordenados = _.orderBy(servicios, ['hora_final'], ['asc']);
        let servicios_activos = _.pickBy(servicios_ordenados, servicio => {
            return servicio.estado === 1
        });


        if (busqueda !== '') {
            servicios_activos = _.pickBy(servicios_ordenados, servicio => {
                return (
                    servicio.acompanante_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                    servicio.categoria.toLowerCase().includes(busqueda.toLowerCase())
                )
            })
        }

        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="md-form">
                            <input id="busqueda" className="form-control" type="text"
                                   value={busqueda}
                                   placeholder="Modelo a buscar..."
                                   onChange={this.onBusquedaChange}/>
                        </div>
                    </div>
                    {_.map(servicios_activos, (servicio) => {
                        return <ServicioListItem
                            abrirModalServicio={abrirModalServicio}
                            cargarServicio={this.cargarServicio}
                            terminarServicio={this.terminarServicio}
                            key={servicio.id}
                            servicio={servicio}/>
                    })}
                </div>
            </div>
        )
    }
}

export default ServicioList;