import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {pesosColombianos} from "../../../00_utilities/common";
import IconButton from '@material-ui/core/IconButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const styles = theme => ({
    icono: {
        color: theme.palette.primary.dark
    }
});

class TablaPedidoActual extends Component {
    render() {
        const {pedido_actual, restarUnidadItem, adicionarUnidadItem, eliminarItem, classes, inventario_disponible} = this.props;
        return <table className='table table-responsive table-striped' style={{fontSize: '0.8rem'}}>
            <thead>
            <tr>
                <th>Nombre</th>
                <th>#</th>
                <th>$ Un.</th>
                <th>$ Total</th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {
                _.map(pedido_actual, e => {
                        return (
                            <tr key={e.id}>
                                <td>{e.nombre}</td>
                                <td>{e.cantidad}</td>
                                <td>{pesosColombianos(e.precio_unitario)}</td>
                                <td>{pesosColombianos(e.precio_total)}</td>
                                <td>
                                    <IconButton
                                        style={{
                                            margin: 0,
                                            padding: 4,
                                        }}
                                        onClick={() => restarUnidadItem(e)}
                                    >
                                        <FontAwesomeIcon
                                            className={classes.icono}
                                            icon={['far', 'minus']}
                                            size='lg'
                                        />
                                    </IconButton>
                                </td>
                                <td>
                                    {
                                        inventario_disponible[e.id] &&
                                        inventario_disponible[e.id].saldo_cantidad > 0 &&
                                        <IconButton
                                            style={{
                                                margin: 0,
                                                padding: 4,
                                            }}
                                            onClick={() => adicionarUnidadItem(e)}
                                        >
                                            <FontAwesomeIcon
                                                className={classes.icono}
                                                icon={['far', 'plus']}
                                                size='lg'
                                            />
                                        </IconButton>
                                    }
                                </td>
                                <td>
                                    <IconButton
                                        style={{
                                            margin: 0,
                                            padding: 4,
                                        }}
                                        onClick={() => eliminarItem(e)}
                                    >
                                        <FontAwesomeIcon
                                            className={classes.icono}
                                            icon={['far', 'trash']}
                                            size='lg'
                                        />
                                    </IconButton>
                                </td>
                            </tr>
                        )
                    }
                )
            }
            </tbody>
            <tfoot>
            <tr>
                <td>Total</td>
                <td>{_.sumBy(_.map(pedido_actual, e => e), 'cantidad')}</td>
                <td></td>
                <td>{pesosColombianos(_.sumBy(_.map(pedido_actual, e => e), 'precio_total'))}</td>
            </tr>
            </tfoot>
        </table>
    }
}

export default withStyles(styles)(TablaPedidoActual);