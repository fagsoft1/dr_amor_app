import React, {useState} from 'react';
import useInterval from "../../hooks/useInterval";
import moment from 'moment-timezone';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

moment.tz.setDefault("America/Bogota");

const Timer = (props) => {
    const {hora_final} = props;
    const [duracion, setDuration] = useState('Cargando...');
    const [termino, setTermino] = useState(0);
    useInterval(() => {
        const hora_actual = new Date();
        let diferencia = moment(hora_final).diff(moment(hora_actual));
        if (diferencia < 0) {
            setTermino(1);
            diferencia = moment(hora_actual).diff(moment(hora_final))
        }
        const nueva_duracion = moment.duration(diferencia);
        let horas = Math.floor(nueva_duracion.asHours());
        horas = horas <= 10 ? `0${horas}` : horas;
        const timer = `${horas}${moment.utc(diferencia).format(":mm:ss")}`;
        setDuration(timer)
    }, 1000);
    return (
        <div className={`servicio clock-${termino}`}>
            <FontAwesomeIcon icon={['far', 'clock']}/> {duracion}
        </div>
    )
};

export default Timer;