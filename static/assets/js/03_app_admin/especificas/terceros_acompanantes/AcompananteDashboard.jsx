import React, {useState, memo, Fragment} from 'react';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';

import BloqueCategorias from './categorias/CategoriaAcompananteCRUD';
import BloqueAcompanantes from './acompanantes/AcompananteCRUD';
import BloqueFraccionesTiempo from './fracciones_tiempos/FraccionTiempoCRUD';

const ListadoElementos = memo(() => {
    const [slideIndex, setSlideIndex] = useState(0);
    const singular_name = 'Panel Acompanante';

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
                <Tab label="Acompanantes"/>
                <Tab label="Categorias"/>
                <Tab label="Fracciones Tiempo"/>
            </Tabs>

            {slideIndex === 0 && <BloqueAcompanantes/>}
            {slideIndex === 1 && <BloqueCategorias/>}
            {slideIndex === 2 && <BloqueFraccionesTiempo/>}
        </Fragment>
    )

});

export default ListadoElementos;