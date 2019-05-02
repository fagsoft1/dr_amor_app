import React, {Component, Fragment} from 'react';
import {pesosColombianos, horaFormatoUno} from "../../../../00_utilities/common";
import FormaPago from '../../../../07_cajas/formas_de_pago/components/forms/forma_pago';
import CambioHabitacion from './habitacion_cambio_habitacion';
import Button from '@material-ui/core/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const Item = (props) => {
    const {servicio, onDeleteServicio} = props;
    return (
        <tr>
            <td>{servicio.acompanante_nombre}</td>
            <td>{servicio.tiempo_minutos}</td>
            <td>{servicio.hora_inicio && horaFormatoUno(servicio.hora_inicio)}</td>
            <td>{servicio.hora_final && horaFormatoUno(servicio.hora_final)}</td>
            <td>{servicio.categoria}</td>
            <td>{servicio.nuevo && pesosColombianos(servicio.valor_servicio)}</td>
            <td>{servicio.nuevo && pesosColombianos(servicio.valor_habitacion)}</td>
            <td>{servicio.nuevo && pesosColombianos(servicio.valor_iva_habitacion)}</td>
            <td>{servicio.nuevo && pesosColombianos(servicio.valor_total)}</td>
            <td>
                {
                    servicio.nuevo &&
                    <FontAwesomeIcon
                        className='puntero'
                        icon={['far', 'trash']}
                        onClick={() => onDeleteServicio(servicio.id)}
                    />
                }
            </td>
        </tr>
    )
};


class ServicioHabitacionList extends Component {
    render() {
        const {
            servicios,
            onDeleteServicio,
            onIniciarServicios,
            onTerminarServicios,
            onCambiarHabitacion,
            mostrar_terminar_servicios,
            mostrar_cambiar_habitacion,
            servicios_nuevos,
            habitaciones,
            habitacion,
        } = this.props;

        const servicios_nuevos_array = _.map(servicios_nuevos, e => {
            return ({
                ...e,
                id: e.id_temp,
            })
        });

        let servicios_array = _.map(servicios, s => s);
        _.orderBy(servicios_nuevos_array, ['acompanante_nombre', 'tiempo_minutos'], ['asc', 'desc']).map(s => {
            servicios_array = [...servicios_array, s]
        });

        const valor_total = servicios_nuevos_array.reduce((v, s) => parseFloat(v) + parseFloat(s.valor_total), 0);

        const valor_habitacion = servicios_nuevos_array.reduce((v, s) => parseFloat(v) + parseFloat(s.valor_habitacion), 0);
        const valor_iva_habitacion = servicios_nuevos_array.reduce((v, s) => parseFloat(v) + parseFloat(s.valor_iva_habitacion), 0);
        const valor_servicio = servicios_nuevos_array.reduce((v, s) => parseFloat(v) + parseFloat(s.valor_servicio), 0);
        const servicios_para_terminar_array = _.map(_.pickBy(servicios, s => s.estado === 1), s => s);

        const servicios_para_cambiar_habitacion_array = _.map(_.pickBy(servicios, s => {
            return (s.estado === 1 || s.estado === 0) && !s.termino
        }), s => s);
        const habitaciones_para_cambiar_array = _.map(_.pickBy(habitaciones, s => s.estado === 0), s => s);

        return (
            <Fragment>
                <table className='table table-responsive table-striped'>
                    <thead>
                    <tr>
                        <th>Acompanante</th>
                        <th>Tiempo</th>
                        <th>Hora Inicio</th>
                        <th>Hora Fin</th>
                        <th>Categoria</th>
                        <th>$ Servicio</th>
                        <th>$ Habitacion</th>
                        <th>$ Iva</th>
                        <th>$ Total</th>
                        <th>Eliminar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {servicios_array.map(s => {
                        return (
                            <Item key={s.id} servicio={s} onDeleteServicio={onDeleteServicio}/>
                        )
                    })}
                    </tbody>
                    {
                        servicios_nuevos_array.length > 0 &&
                        <tfoot>
                        <tr>
                            <td colSpan={5}></td>
                            <td>{pesosColombianos(valor_servicio)}</td>
                            <td>{pesosColombianos(valor_habitacion)}</td>
                            <td>{pesosColombianos(valor_iva_habitacion)}</td>
                            <td>{pesosColombianos(valor_total)}</td>
                        </tr>
                        </tfoot>
                    }
                </table>
                {
                    servicios_nuevos_array.length > 0 &&
                    <div className="col-12">
                        <FormaPago
                            onSubmit={pago => onIniciarServicios(pago)}
                            valor_a_pagar={valor_total}
                            texto_boton='Iniciar Servicios'
                        >
                        </FormaPago>
                    </div>
                }
                {
                    mostrar_cambiar_habitacion &&
                    servicios_nuevos_array.length === 0 &&
                    <div className="col-12">
                        <CambioHabitacion
                            habitaciones={habitaciones_para_cambiar_array}
                            servicios={servicios_para_cambiar_habitacion_array}
                            onCambiarHabitacion={onCambiarHabitacion}
                            habitacion={habitacion}
                        />
                    </div>
                }
                {
                    mostrar_terminar_servicios &&
                    servicios_para_terminar_array.length > 0 &&
                    <Button
                        color="primary"
                        variant="contained"
                        className='ml-3'
                        onClick={() => onTerminarServicios()}
                    >
                        Terminar Todos
                    </Button>
                }
            </Fragment>
        )
    }
}

export default ServicioHabitacionList;