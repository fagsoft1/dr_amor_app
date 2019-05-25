import React, {Component} from 'react';
import HabitacionCategoriaListItem from './HabitacionCategoriaListItem';
import Typography from '@material-ui/core/Typography';

export default class CategoriaHabitacionList extends Component {
    render() {
        const {habitaciones, tipo, cambiarEstado, onClickHabitacion} = this.props;
        const habitaciones_ordenadas = _.orderBy(habitaciones, ['numero'], ['asc']);
        return (
            <div className="col-12 col-sm-6 habitacion-tipo-list">
                <Typography variant="h6" gutterBottom color="primary">
                    {tipo}
                </Typography>
                <div className="row">
                    {habitaciones_ordenadas.map(habitacion => {
                        return (
                            <HabitacionCategoriaListItem
                                onClickHabitacion={onClickHabitacion}
                                key={habitacion.id}
                                habitacion={habitacion}
                                cambiarEstado={cambiarEstado}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }
}