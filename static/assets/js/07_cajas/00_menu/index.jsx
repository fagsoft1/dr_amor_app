import React, {Fragment} from 'react';
import MenuBase from '../../00_utilities/components/ui/menu/menu';
import {Link} from 'react-router-dom'
import Icon from '@material-ui/core/Icon';

const iconStyles = {
    paddingTop: 8,
    paddingRight: 8
};

const Menu = () => {
    return (
        <MenuBase>
            {mis_permisos => {
                return (
                    <Fragment>
                        <Link to='/app/cajas/liquidar_acompanante'>
                            <Icon style={iconStyles} className="fas fa-female"/>
                        </Link>
                        <Link to='/app/cajas/cierre_caja'>
                            <Icon style={iconStyles} className="fas fa-female"/>
                        </Link>
                    </Fragment>
                )
            }}
        </MenuBase>
    )
};

export default Menu;