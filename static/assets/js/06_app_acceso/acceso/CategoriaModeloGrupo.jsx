import React, {memo} from 'react';
import Typography from '@material-ui/core/Typography/index';
import Badge from '@material-ui/core/Badge/index';


export default memo(props => {
    const {categoria, onClickModelo} = props;
    const renderModelo = (modelo) => {
        return (
            <div
                className={`col-4 col-sm-2 col-md-1 modelo-box est-mod-${modelo.estado} puntero`}
                key={modelo.id}
                onClick={() => onClickModelo(modelo)}
            >
                {modelo.full_name_proxy}
            </div>
        )
    };
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
});