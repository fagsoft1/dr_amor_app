import React, {memo, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index';
import Timer from '../../../00_utilities/components/system/Timer';
import Button from "@material-ui/core/Button/index";

const TerminarSiNo = memo(props => {
    const {onSiTerminarServicioClick, onNoTerminarServicioClick} = props;
    return (
        <div className="row pb-2">
            <div className="col-12">
                Desea terminar este servicio?
            </div>
            <div className="col-12 col-lg-6 pt-3 text-center">
                <Button
                    color='primary'
                    variant="contained"
                    onClick={() => {
                        onSiTerminarServicioClick()
                    }}
                >
                    Sí
                </Button>
            </div>
            <div className="col-12 col-lg-6 pt-3 text-center">
                <Button
                    color='secondary'
                    variant="contained"
                    onClick={() => {
                        onNoTerminarServicioClick()
                    }}
                >
                    NO
                </Button>
            </div>
        </div>
    )
});


const ServicioListItem = memo(props => {
    const {servicio, terminarServicio, cargarServicio, abrirModalServicio, time_now} = props;
    const [mostrar_terminar, setMostrarTerminar] = useState(false);
    const onTerminarServicioClick = () => {
        cargarServicio(servicio.id);
        setMostrarTerminar(true)
    };

    const onNoTerminarServicioClick = () => {
        setMostrarTerminar(false);
    };

    const onSiTerminarServicioClick = () => {
        terminarServicio(servicio.id);
    };

    const renderTerminarOption = () => {
        return (
            mostrar_terminar &&
            <TerminarSiNo
                onSiTerminarServicioClick={onSiTerminarServicioClick}
                onNoTerminarServicioClick={onNoTerminarServicioClick}
            />
        )
    };

    const cronometro = servicio.en_espera ? <FontAwesomeIcon icon={['far', 'spinner']} spin/> :
        <Timer hora_final={servicio.hora_final}/>;

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
                                    <FontAwesomeIcon
                                        className="puntero p-1"
                                        icon={['far', 'cogs']}
                                        size='lg'
                                        onClick={() => abrirModalServicio(servicio)}
                                    />
                                }
                                {
                                    (!servicio.servicio_siguiente || servicio.termino) &&
                                    !servicio.en_espera &&
                                    <FontAwesomeIcon
                                        className="puntero p-1"
                                        icon={['far', 'hand-paper']}
                                        size='lg'
                                        onClick={() => onTerminarServicioClick()}
                                    />
                                }
                            </div>
                            <div className='float-right pr-2'>
                                {cronometro}
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        {renderTerminarOption()}
                    </div>
                </div>
            </div>
        </div>
    )
});

export default ServicioListItem;