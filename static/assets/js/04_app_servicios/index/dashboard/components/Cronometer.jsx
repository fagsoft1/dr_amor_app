import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default class Cronometer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tiempo_faltante: "Cargando",
            termino: 0
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.timer()
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    timer() {
        let date_future = new Date(this.props.hora_final);
        let date_now = new Date();

        if (date_future < date_now) {
            this.setState({termino: 1});
        } else {
            this.setState({termino: 0});
        }

        let seconds = Math.abs(Math.floor((date_future - (date_now)) / 1000));

        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        hours = hours - (days * 24);
        minutes = minutes - (days * 24 * 60) - (hours * 60);
        seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

        const TIEMPO_FALTANTE = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        this.setState({tiempo_faltante: TIEMPO_FALTANTE});
    }

    render() {
        return (
            <div className={`servicio clock-${this.state.termino}`}>
                <FontAwesomeIcon icon={['far', 'clock']}/> {this.state.tiempo_faltante}
            </div>
        )
    }
}