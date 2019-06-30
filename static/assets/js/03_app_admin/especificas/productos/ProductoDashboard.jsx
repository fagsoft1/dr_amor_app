import React, {useState, memo, Fragment} from 'react';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';

import BloqueProductos from './productos/ProductoCRUD';
import BloqueCategorias from './categorias/CategoriaProductoCRUD';
import BloqueCategoriasDos from './categorias_dos/CategoriaDosProductoCRUD';
import BloqueUnidadesProductos from './unidades/UnidadesProductoCRUD';

const ListadoElementos = memo(() => {
    const [slideIndex, setSlideIndex] = useState(0);
    const singular_name = 'Panel Producto';
    return (
        <Fragment>
            <Typography variant="h5" gutterBottom color="primary">
                {singular_name}
            </Typography>
            <Tabs indicatorColor="primary"
                  textColor="primary"
                  onChange={(value, index) => setSlideIndex(index)}
                  value={slideIndex}
            >
                <Tab label="Productos" value={0}/>
                <Tab label="Categorias" value={1}/>
                <Tab label="Categorias Dos" value={2}/>
                <Tab label="Unidades" value={3}/>
            </Tabs>
            <div className="row">
                <div className="col-12">
                    {slideIndex === 0 && <BloqueProductos/>}
                    {slideIndex === 1 && <BloqueCategorias/>}
                    {slideIndex === 2 && <BloqueCategoriasDos/>}
                    {slideIndex === 3 && <BloqueUnidadesProductos/>}
                </div>
            </div>
        </Fragment>
    )
});

export default ListadoElementos