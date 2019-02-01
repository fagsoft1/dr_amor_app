import React, {Fragment} from 'react';
import {pesosColombianos} from "../../../../00_utilities/common";
import FormaPago from '../../movimiento_dinero/components/forms/forma_pago';
import Button from '@material-ui/core/Button';

const ResumenCambioHabitacion = (props) => {
    const {
        habitacion_nueva,
        habitacion,
        cantidad_servicios,
        onCambiarHabitacion,
        diferencia_precios,
        servicios
    } = props;

    const valor_habitacion_nueva = habitacion_nueva.valor;
    const valor_habitacion = habitacion.valor;
    return (
        <Fragment>
            {
                diferencia_precios !== 0 ?
                    <Fragment>
                        <FormaPago
                            perdir_observacion_devolucion={true}
                            onSubmit={(v) => onCambiarHabitacion(v, habitacion_nueva.id, servicios)}
                            valor_a_pagar={diferencia_precios * cantidad_servicios}
                            texto_boton='Cambiar Habitación'
                        >
                            <table className='table table-striped table-responsive'>
                                <tbody>
                                <tr>
                                    <td>Nro. Servicios</td>
                                    <td></td>
                                    <td>{cantidad_servicios}</td>
                                </tr>
                                <tr>
                                    <td>Valor Habitacion Actual</td>
                                    <td>{pesosColombianos(valor_habitacion)}</td>
                                    <td>{pesosColombianos(valor_habitacion * cantidad_servicios)}</td>
                                </tr>
                                <tr>
                                    <td>Valor Habitacion Nueva</td>
                                    <td>{pesosColombianos(valor_habitacion_nueva)}</td>
                                    <td>{pesosColombianos(valor_habitacion_nueva * cantidad_servicios)}</td>
                                </tr>
                                <tr>
                                    <td>Valor Adicional</td>
                                    <td>{pesosColombianos(valor_habitacion_nueva)}</td>
                                    <td>{pesosColombianos(diferencia_precios * cantidad_servicios)}</td>
                                </tr>
                                </tbody>
                            </table>
                        </FormaPago>
                    </Fragment> :
                    <Fragment>
                        <Button
                            color="primary"
                            variant="contained"
                            className='ml-3'
                            onClick={() => onCambiarHabitacion(null, habitacion_nueva.id, servicios)}
                        >
                            Cambiar Habitación
                        </Button>
                    </Fragment>
            }
        </Fragment>
    )
};

export default ResumenCambioHabitacion;