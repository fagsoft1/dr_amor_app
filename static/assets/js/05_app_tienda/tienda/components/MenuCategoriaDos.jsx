import React, {Fragment, memo} from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ProductoMenu from './MenuProducto';
import Button from '@material-ui/core/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        width: '100%',
        minHeight: '5rem',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
});

const CategoriaDosMenu = memo(props => {
    const {categoria_dos, onBack, classes, onClick, categoria_dos_seleccionada, mostrar, adicionarItemAPedidoActual} = props;
    if (mostrar) {
        return (
            <div className='col-6 col-lg-4 puntero' style={{padding: 2}}>
                <Paper className={classes.root} elevation={1} onClick={() => onClick(categoria_dos.categoria_dos)}>
                    <Typography variant="body1">
                        {categoria_dos.categoria_dos}
                    </Typography>
                </Paper>
            </div>
        )
    }
    if (!mostrar && categoria_dos_seleccionada === categoria_dos.categoria_dos) {
        return <Fragment>
            <div style={{position: 'absolute', top: '-60px', left: '-60px'}}>
                <Button onClick={onBack} color='primary' variant="outlined">
                    <FontAwesomeIcon
                        icon={['far', 'angle-double-left']}
                        size='3x'
                    />
                </Button>
            </div>
            {
                categoria_dos.productos.map(p =>
                    <ProductoMenu
                        producto={p}
                        key={p.producto}
                        adicionarItemAPedidoActual={adicionarItemAPedidoActual}
                    />
                )
            }
        </Fragment>

    }
    return <Fragment></Fragment>
});

export default withStyles(styles)(CategoriaDosMenu);