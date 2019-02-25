import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {pesosColombianos} from '../../../../../00_utilities/common';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

function SimpleTable(props) {
    const {classes, operaciones_caja, valor_total_prestamos} = props;
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary
                expandIcon={<FontAwesomeIcon icon={['far', 'angle-down']} size='lg' className={classes.iconoBoton}/>}>
                <div className="row" style={{width: '100%'}}>
                    <div className="col-9">
                        <Typography className={classes.heading}>
                            Prestamos
                        </Typography>
                    </div>
                    <div className="col-3 text-right">
                        <Typography className={classes.heading}>
                            {pesosColombianos(valor_total_prestamos)}
                        </Typography>
                    </div>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <table className='table table-responsive' style={{fontSize: '0.7rem'}}>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Descripción</th>
                        <th>Valor</th>
                    </tr>
                    </thead>
                    <tbody>
                    {_.map(operaciones_caja, s => {
                        return (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.descripcion}</td>
                                <td className='text-right'>{pesosColombianos(parseFloat(s.valor))}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Total</td>
                        <td className='text-right'></td>
                        <td className='text-right'>{pesosColombianos(valor_total_prestamos)}</td>
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