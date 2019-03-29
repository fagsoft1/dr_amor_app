import React from 'react';
import PropTypes from 'prop-types';
import {numerosFormato, pesosColombianos} from '../../../../../00_utilities/common';
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

function SimpleTable(props) {
    const {classes, consumos_tienda, valor_total_consumo_tienda} = props;
    const cantidad_total = _.sumBy(_.map(consumos_tienda, e => e), v => parseFloat(v.cantidad));
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary
                expandIcon={<FontAwesomeIcon icon={['far', 'angle-down']} size='lg' className={classes.iconoBoton}/>}>
                <div className="row" style={{width: '100%'}}>
                    <div className="col-9">
                        <Typography className={classes.heading}>
                            Consumos Tienda
                        </Typography>
                    </div>
                    <div className="col-3 text-right">
                        <Typography className={classes.heading}>
                            {pesosColombianos(valor_total_consumo_tienda)}
                        </Typography>
                    </div>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <table className='table table-responsive' style={{fontSize: '0.7rem'}}>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Producto</th>
                        <th>#</th>
                        <th>Valor</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        _.map(consumos_tienda, p =>
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.producto_nombre}</td>
                                <td className='text-right'>{numerosFormato(p.cantidad)}</td>
                                <td className='text-right'>{pesosColombianos(parseFloat(p.precio_total * -1))}</td>
                            </tr>
                        )
                    }
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Total</td>
                        <td></td>
                        <td className='text-right'>{parseInt(cantidad_total)}</td>
                        <td className='text-right'>{pesosColombianos(valor_total_consumo_tienda)}</td>
                    </tr>
                    </tfoot>
                </table>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default SimpleTable;