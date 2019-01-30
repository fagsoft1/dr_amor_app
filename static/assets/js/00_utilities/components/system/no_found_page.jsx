import React from 'react';
import Typography from '@material-ui/core/Typography';

const NotFound = () => {
    return (
        <div>
            <Typography variant="h2" gutterBottom color="primary">
                Página no encontrada
            </Typography>
            <p>La página que estas buscando no existe</p>
        </div>
    )
};

export default NotFound