import React, {memo, Fragment, useState} from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import ResumenCambioHabitacion from './HabitacionCambioHabitacionResumen';
import Typography from '@material-ui/core/Typography';

const CambioHabitacion = memo(props => {
    const [habitacion_nueva, setHabitacionNueva] = useState(null);
    const {
        habitaciones,
        servicios,
        habitacion,
        onCambiarHabitacion
    } = props;
    const diferencia_precios = habitacion_nueva ? (habitacion_nueva.valor + habitacion_nueva.valor_adicional_servicio) - (habitacion.valor + habitacion.valor_adicional_servicio) : 0;
    const cantidad_servicios = servicios.length;
    return (
        <div className='row'>
            {
                cantidad_servicios > 0 &&
                <Fragment>
                    <div className="col-12">
                        <Typography variant="h4" gutterBottom color="primary">
                            Cambio Habitación
                        </Typography>
                    </div>
                    <DropdownList
                        data={_.map(habitaciones, c => c)}
                        placeholder='Habitación'
                        textField='nombre'
                        className="col-12 col-md-4"
                        valuesField='id'
                        onSelect={(e) => setHabitacionNueva(e)}
                    />
                    {
                        habitacion_nueva &&
                        <div className="col-12">
                            <ResumenCambioHabitacion
                                servicios={servicios}
                                onCambiarHabitacion={onCambiarHabitacion}
                                habitacion={habitacion}
                                habitacion_nueva={habitacion_nueva}
                                diferencia_precios={diferencia_precios}
                                cantidad_servicios={cantidad_servicios}
                            />
                        </div>
                    }
                </Fragment>
            }
        </div>
    )
});

export default CambioHabitacion;