import React, {useState, memo, Fragment} from 'react';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';

import BloqueHabitaciones from './habitaciones/HabitacionCRUD';
import BloqueHabitacionesTipos from './habitaciones_tipos/HabitacionTipoCRUD';

const ListadoElementos = memo((props) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const singular_name = 'Habitacion Panel';
    return (
        <Fragment>
            <Typography variant="h5" gutterBottom color="primary">
                {singular_name}
            </Typography>

            <Tabs indicatorColor="primary"
                  textColor="primary"
                  onChange={(event, index) => setSlideIndex(index)}
                  value={slideIndex}
            >
                <Tab label="Habitaciones" value={0}/>
                <Tab label="Habitaciones Tipos" value={1}/>
            </Tabs>
            {slideIndex === 0 && <BloqueHabitaciones/>}
            {slideIndex === 1 && <BloqueHabitacionesTipos/>}
        </Fragment>
    )
});

export default ListadoElementos;