import React, {Fragment} from 'react';
import {pesosColombianos, fechaFormatoUno, horaFormatoUno} from "../../../00_utilities/common";

const TablaServicioItem = (props) => {
    const {
        servicio: {
            estado,
            valor_servicio,
            habitacion_nombre,
            hora_inicio,
            tiempo_minutos,
            id
        }
    } = props;
    let estado_texto = '';
    switch (estado) {
        case 0:
            estado_texto = 'Nunca Iniciado';
            break;
        case 1:
            estado_texto = 'En Proceso';
            break;
        case 2:
            estado_texto = 'Terminado';
            break;
        case 3:
            estado_texto = 'Anulado';
            break;
        case 4:
            estado_texto = 'Anulado';
            break;
    }
    return (
        <tr>
            <td>{id}</td>
            <td>{habitacion_nombre}</td>
            <td>{hora_inicio && fechaFormatoUno(hora_inicio)}</td>
            <td>{hora_inicio && horaFormatoUno(hora_inicio)}</td>
            <td>{tiempo_minutos}</td>
            <td>{estado_texto}</td>
            <td>{estado === 2 && pesosColombianos(valor_servicio)}</td>
        </tr>

    )
};

const TablaServicios = (props) => {
    const {servicios, total_servicios} = props;
    return (
        <div className='mt-3'>
            {
                servicios &&
                servicios.length > 0 &&
                <Fragment>
                    <h6>Servicios</h6>
                    <table className='table table-responsive table-striped'>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Habitacion</th>
                            <th>Fecha</th>
                            <th>Hora Ini.</th>
                            <th>Tiempo</th>
                            <th>Estado</th>
                            <th>Valor</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            servicios.map(s => <TablaServicioItem key={s.id} servicio={s}/>)
                        }
                        </tbody>
                        <tbody>
                        <tr>
                            <td colSpan={2}><strong>Total a Pagar: </strong></td>
                            <td colSpan={4}></td>
                            <td>{pesosColombianos(total_servicios)}</td>
                        </tr>
                        </tbody>
                    </table>
                </Fragment>
            }
        </div>
    )
};

export default TablaServicios;