import React, {useState, memo, Fragment} from 'react';
import TextField from '@material-ui/core/TextField';

const ListaBusqueda = memo((props) => {
    const [busqueda, setBusqueda] = useState('');
    return (
        <Fragment>
            <TextField
                placeholder="A buscar"
                fullWidth={true}
                onChange={(e) => setBusqueda(e.target.value)}
                autoComplete="off"
                value={busqueda}
            />
            {props.children(busqueda)}
        </Fragment>
    )
});

export default ListaBusqueda;