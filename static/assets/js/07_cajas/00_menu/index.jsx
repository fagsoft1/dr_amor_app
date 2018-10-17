import React, {Fragment} from 'react';
import MenuBase from '../../00_utilities/components/ui/menu/menu';
import {Link} from 'react-router-dom'
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

const iconStyles = {
    paddingTop: 8,
    paddingRight: 8
};

const styles = {
    tooltip: {
        tittle: {
            fontSize: '14px'
        }
    }
};


const Menu = () => {
    return (
        <MenuBase>
            {auth => {
                const {punto_venta} = auth;
                return (
                    <Fragment>
                        <Link to='/app/cajas/'>
                            <div style={iconStyles}>
                                <Icon className="fas fa-home"/>
                            </div>
                        </Link>
                        {
                            punto_venta.id &&
                            punto_venta.abierto &&
                            <Fragment>
                                <Link to='/app/cajas/registro_operaciones/'>
                                    <div style={iconStyles}>
                                        <Tooltip
                                            title={<span style={styles.tooltip.tittle}>Registrar Operacionese</span>}>
                                            <Icon className="fas fa-exchange-alt"/>
                                        </Tooltip>
                                    </div>
                                </Link>
                                <Link to='/app/cajas/liquidar_acompanante'>
                                    <div style={iconStyles}>
                                        <Tooltip
                                            title={<span style={styles.tooltip.tittle}>Liquidación Acompañante</span>}>
                                            <Icon className="fas fa-female"/>
                                        </Tooltip>
                                    </div>
                                </Link>
                                <Link to='/app/cajas/cierre_caja'>
                                    <div style={iconStyles}>
                                        <Tooltip title={<span style={styles.tooltip.tittle}>Cierre de Caja</span>}>
                                            <Icon className="fas fa-door-open"/>
                                        </Tooltip>
                                    </div>
                                </Link>
                            </Fragment>
                        }
                    </Fragment>
                )
            }}
        </MenuBase>
    )
};

export default Menu;