import React, {Component} from 'react';
import HabitacionCategoriaList from '../../habitaciones/components/habitaciones_categorias_list';

class HabitacionList extends Component {

    onClickCambiarEstado(estado, habitacion_id) {
        this.props.cambiarEstadoHabitacion(habitacion_id, estado)
    }

    renderHabitaciones() {

        const {habitaciones, onClickHabitacion} = this.props;
        const ARRAY_HABITACIONES = _.map(habitaciones, habitacion => {
                return habitacion
            }
        );
        const HABITACIONES_TIPO = _.groupBy(ARRAY_HABITACIONES, 'tipo_habitacion_nombre');

        let diccionario = [];
        _.mapKeys(HABITACIONES_TIPO, (habitaciones, tipo) => {
            diccionario = [...diccionario, {"tipo": tipo, "habitaciones": habitaciones}];
        });

        return (
            diccionario.map(categoria_habitacion => {
                const {tipo, habitaciones} = categoria_habitacion;
                return (
                    <HabitacionCategoriaList
                        onClickHabitacion={onClickHabitacion}
                        cambiarEstado={this.onClickCambiarEstado.bind(this)}
                        key={tipo}
                        cantidad={habitaciones.length}
                        tipo={tipo}
                        habitaciones={habitaciones}
                    />
                )
            })
        )
    }

    render() {
        return (
            <div className="row">
                {this.renderHabitaciones()}
            </div>
        )
    }
}

export default HabitacionList