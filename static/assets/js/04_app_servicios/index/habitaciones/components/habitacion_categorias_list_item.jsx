import React, {Component} from 'react';
import Cronometer from '../../dashboard/components/cronometer';

export default class HabitacionCategoriaListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {mostra_cambios_estados: false};
        this.onClickMostrarCambiarEstados = this.onClickMostrarCambiarEstados.bind(this);
    }

    onClickMostrarCambiarEstados() {
        this.setState(function (prevState, props) {
            return {mostra_cambios_estados: !prevState.mostra_cambios_estados}
        });
    }

    onClickCambiarEstado(estado) {
        const {habitacion, cambiarEstado} = this.props;
        cambiarEstado(estado, habitacion.id);
        this.setState({mostra_cambios_estados: false})
    }

    renderBotonEstado(estado) {
        const {habitacion} = this.props;
        if (habitacion.estado === estado) {
            return null
        }
        return (
            <div className="m-1 col-3">
                <i
                    onClick={() => this.onClickCambiarEstado(estado)}
                    className={`fa fa-circle fa-2x habitacion est-${estado} icon puntero`}
                    aria-hidden="true"
                >
                </i>
            </div>
        )
    }

    renderBotoneriaEstados() {
        return (
            <div className='row'>
                {this.renderBotonEstado(0)}
                {this.renderBotonEstado(2)}
                {this.renderBotonEstado(3)}
            </div>
        )
    }


    render() {
        const {
            habitacion:
                {
                    numero,
                    estado,
                    id,
                    tiempo_final_servicio,
                    fecha_ultimo_estado
                },
            onClickHabitacion
        } = this.props;
        const {mostra_cambios_estados} = this.state;

        const hora_final = estado === 1 ? tiempo_final_servicio : fecha_ultimo_estado;

        return (
            <div className="col-4 col-md-4 col-lg-3 habitacion-tipo-list-item">
                <div onClick={() => {
                    onClickHabitacion(id, this.onClickMostrarCambiarEstados);
                }}
                     className={`habitacion-tipo-list-item habitacion est-${estado} puntero`}
                >
                    <i className="far fa-bed" aria-hidden="true">
                    </i>
                    <span className="habitacion numero"> {numero}</span>
                    {
                        (estado === 1 || estado === 2 || estado === 3) &&
                        <Cronometer hora_final={hora_final}/>
                    }
                </div>
                {
                    mostra_cambios_estados &&
                    this.renderBotoneriaEstados()
                }
            </div>
        )
    }
}