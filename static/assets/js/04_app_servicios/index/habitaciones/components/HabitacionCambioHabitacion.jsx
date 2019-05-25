import React, {Component, Fragment} from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import ResumenCambioHabitacion from './HabitacionCambioHabitacionResumen';
import Typography from '@material-ui/core/Typography';

class CambioHabitacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            habitacion_nueva: null
        }
    }

    render() {
        const {
            habitaciones,
            servicios,
            habitacion,
            onCambiarHabitacion
        } = this.props;
        const {habitacion_nueva} = this.state;
        const diferencia_precios = habitacion_nueva ? habitacion_nueva.valor - habitacion.valor : 0;
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
                            onSelect={(e) => {
                                this.setState({habitacion_nueva: e})
                            }}
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
    }
};

export default CambioHabitacion;