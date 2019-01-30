import React from 'react';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

function renderModelo(modelo) {
    return (
        <div className={`col-4 col-sm-2 col-md-1 modelo-box est-mod-${modelo.estado}`} key={modelo.id}>
            {modelo.full_name_proxy}
        </div>
    )
}

export default (props) => {
    const {categoria} = props;
    return (
        <div className="col-12 categoria">

            <Badge color="secondary" badgeContent={categoria.modelos.length}>
                <Typography variant="h3" gutterBottom color="primary">
                    {categoria.categoria}
                </Typography>
            </Badge>
            <div className="row">
                {categoria.modelos.map(modelo => renderModelo(modelo))}
            </div>
            <hr/>
        </div>
    )
}