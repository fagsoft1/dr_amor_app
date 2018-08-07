import React, {Component} from 'react';
import Cronometer from '../../dashboard/components/cronometer';
import {Link} from 'react-router-dom';

const TerminarSiNo = (props) => {
    const {onSiTerminarServicioClick, onNoTerminarServicioClick} = props;

    return (
        <div className="col-12">
            Desea terminar este servicio?
            <div className='row p-1'>
                <div className="col-12 col-lg-6">
                    <span
                        onClick={() => {
                            onSiTerminarServicioClick()
                        }}
                        className='btn btn-primary'>
                    Terminar</span>
                </div>
                <div className="col-12 col-lg-6">
                    <span
                        onClick={() => {
                            onNoTerminarServicioClick()
                        }}
                        className='btn btn-secondary'>
                    Cancelar
                </span>
                </div>
            </div>
        </div>
    )
};

export default class ServicioListItem extends Component {
    constructor(prosp) {
        super(prosp);
        this.state = {
            mostrar_terminar: false
        }
    }

    onTerminarServicioClick() {
        const {cargarServicio, servicio} = this.props;
        cargarServicio(servicio.id);
        this.setState({mostrar_terminar: true});
    }

    onNoTerminarServicioClick() {
        this.setState({mostrar_terminar: false});
    }

    onSiTerminarServicioClick() {
        const {servicio, terminarServicio} = this.props;
        terminarServicio(servicio.id);
    }

    renderTerminarOption() {
        const {mostrar_terminar} = this.state;
        if (mostrar_terminar) {
            return (
                <TerminarSiNo
                    onSiTerminarServicioClick={this.onSiTerminarServicioClick.bind(this)}
                    onNoTerminarServicioClick={this.onNoTerminarServicioClick.bind(this)}
                />
            )
        }
    }

    render() {
        const {servicio, abrirModalServicio} = this.props;
        const cronometro = servicio.en_espera ?
            <i className="fas fa-spinner fa-spin">
            </i> :
            <Cronometer hora_final={servicio.hora_final}/>;

        return (
            <div className="col-12">
                <div
                    className={`servicio servicio-list-item ${servicio.en_espera ? 'espera' : ''} ${servicio.termino ? 'terminado blink_me' : ''}`}>
                    <div className="row">
                        <span style={{position: 'absolute', right: 20}}><small>{servicio.tiempo_minutos} min.</small></span>
                        <div className="col-12">
                            <div
                                className="servicio servicio-modelo-nombre right">
                                {servicio.acompanante_nombre}
                                <small><span> ({servicio.categoria})</span></small>
                                <br/>
                                <strong>
                                    <small>{servicio.habitacion_nombre}</small>
                                </strong>
                            </div>
                            <div className="pl-2">
                                <div className='float-left'>
                                    {
                                        !servicio.termino &&
                                        <i className="fas fa-cogs puntero p-1"
                                           aria-hidden="true"
                                           onClick={() => abrirModalServicio(servicio)}></i>
                                    }
                                    {
                                        (!servicio.servicio_siguiente || servicio.termino) &&
                                        !servicio.en_espera &&
                                        <i onClick={() => this.onTerminarServicioClick()}
                                           className="fas fa-hand-paper puntero  p-1" aria-hidden="true">
                                        </i>
                                    }
                                </div>
                                <div className='float-right pr-2'>
                                    {cronometro}
                                </div>
                            </div>
                        </div>
                        {this.renderTerminarOption()}
                    </div>
                </div>
            </div>
        )
    }
}