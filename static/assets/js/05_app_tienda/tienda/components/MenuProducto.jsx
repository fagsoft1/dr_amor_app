import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import {pesosColombianos} from '../../../00_utilities/common';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        minHeight: '6rem',
        width: '100%',
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    badge: {
        right: '20px',
        top: '80%',
        // The border color match the background color.
        border: `2px solid ${
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
            }`,
    },
});

class ProductoMenu extends Component {
    render() {
        const {producto, classes, adicionarItemAPedidoActual} = this.props;
        return (
            <div className='col-6 col-lg-4 puntero' style={{padding: 2}}>
                <Badge badgeContent={parseFloat(producto.saldo_cantidad)} color="primary"
                       classes={{badge: classes.badge}}>
                    <Paper
                        style={{background: producto.saldo_cantidad > 0 ? '' : 'lightgray'}}
                        className={classes.root}
                        elevation={1}
                        onClick={() => {
                            if (producto.saldo_cantidad > 0) {
                                adicionarItemAPedidoActual(producto)
                            }
                        }}
                    >
                        <Typography variant="body1">
                            {producto.producto_nombre}
                        </Typography>
                        <Typography variant="body1">
                            {
                                producto.saldo_cantidad > 0 ?
                                    pesosColombianos(producto.producto_precio_venta) :
                                    <Fragment>Agotado</Fragment>
                            }
                        </Typography>
                    </Paper>
                </Badge>
            </div>
        )
    }
}

export default withStyles(styles)(ProductoMenu);