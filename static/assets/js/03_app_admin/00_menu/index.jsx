import React, {Fragment} from 'react';
import MenuBase from '../../00_utilities/components/ui/menu/menu';
import {Link} from 'react-router-dom'
import Icon from '@material-ui/core/Icon';
import MenuInventarios from './inventarios';
import MenuPermisos from './permisos';
import MenuTerceros from './terceros';
import MenuCaja from './caja';

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
                        <MenuTerceros/>
                        <MenuPermisos/>
                        <MenuInventarios/>
                        <MenuCaja/>
                        <Link to='/app/admin/empresas/empresas/list'>
                            <div style={iconStyles}>
                                <Icon style={iconStyles} className="fas fa-building"/>
                            </div>
                        </Link>
                        <Link to='/app/admin/habitaciones/dashboard'>
                            <div style={iconStyles}>
                                <Icon style={iconStyles} className="fas fa-bed"/>
                            </div>
                        </Link>
                        <Link to='/app/admin/productos/dashboard'>
                            <div style={iconStyles}>
                                <Icon style={iconStyles} className="fas fa-glass-martini"/>
                            </div>
                        </Link>
                        <Link to='/app/admin/puntos_ventas/puntos_ventas/list'>
                            <div style={iconStyles}>
                                <Icon style={iconStyles} className="fas fa-desktop"/>
                            </div>
                        </Link>
                    </Fragment>
                )
            }}
        </MenuBase>
    )
};

export default Menu;