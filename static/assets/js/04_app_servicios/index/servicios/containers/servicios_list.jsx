import React, {Component} from 'react';

import ServicioListItem from '../../servicios/components/servicio_list_item';

class ServicioList extends Component {
    constructor(props) {
        super(props);
        this.state = {busqueda: ''};
        this.cargarServicio = this.cargarServicio.bind(this);
        this.terminarServicio = this.terminarServicio.bind(this);
        this.onBusquedaChange = this.onBusquedaChange.bind(this);
    }

    terminarServicio(servicio_id) {
        const {
            fetchServicios_en_proceso,
            terminarServicio,
            fetchHabitaciones,
            auth: {punto_venta}
        } = this.props;

        const cargarHabitaciones = () => fetchHabitaciones();
        const cargarServiciosEnProceso = () => fetchServicios_en_proceso({callback: cargarHabitaciones});
        terminarServicio(servicio_id, punto_venta.id, {callback: cargarServiciosEnProceso});
    }

    onBusquedaChange(event) {
        this.setState({busqueda: event.target.value})
    }

    cargarServicio(id) {
        const {fetchServicio} = this.props;
        fetchServicio(id);
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