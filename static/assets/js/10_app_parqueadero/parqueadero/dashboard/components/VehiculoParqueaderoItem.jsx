import React from 'react';
import {diferenciaTiempo, pesosColombianos} from "../../../../00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const VehiculoParqueaderoItem = (props) => {
    const {
        vehiculo,
        style,
        actual_time,
        onSelectVehiculoParqueadero,
        onImprimir
    } = props;
    const icono_open_modal = !vehiculo.hora_pago && !vehiculo.hora_salida ? 'coins' : (vehiculo.hora_pago && !vehiculo.hora_salida ? 'sign-out' : null);
    return (
        <div
            className={style.vehiculoItemInterno}
        >
            <div className={style.vehiculoItemInternoTextPlaca}>
                {vehiculo.vehiculo_placa}
            </div>
            <div className={style.vehiculoItemInternoText}>
                {vehiculo.tipo_vehiculo_nombre}
            </div>
            {
                !vehiculo.hora_pago &&
                !vehiculo.hora_salida &&
                <div className={style.vehiculoItemInternoText}>
                    {diferenciaTiempo(new Date(vehiculo.hora_ingreso), actual_time)}
                </div>
            }
            {
                vehiculo.hora_pago &&
                !vehiculo.hora_salida &&
                <div className={style.vehiculoItemInternoText}>
                    Tiempo: {diferenciaTiempo(new Date(vehiculo.hora_ingreso), vehiculo.hora_pago)}<br/>
                    Pagado: {pesosColombianos(parseFloat(vehiculo.valor_parqueadero) + parseFloat(vehiculo.valor_iva_parqueadero) + parseFloat(vehiculo.valor_impuesto_unico))}<br/>
                    {diferenciaTiempo(new Date(vehiculo.hora_pago), actual_time)}
                </div>
            }
            <div className='row'>
                {
                    icono_open_modal &&
                    <div className="col-6">
                        <FontAwesomeIcon
                            icon={['far', icono_open_modal]}
                            className='puntero'
                            size='2x'
                            onClick={() => onSelectVehiculoParqueadero(vehiculo.id)}
                        />
                    </div>
                }
                {
                    onImprimir &&
                    <div className="col-6">
                        <FontAwesomeIcon
                            className='puntero'
                            icon={['far', 'print']}
                            size='2x'
                            onClick={() => onImprimir(vehiculo.id)}
                        />
                    </div>
                }
            </div>

        </div>
    )
};

export default VehiculoParqueaderoItem;