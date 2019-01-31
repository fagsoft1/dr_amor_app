import React, {Fragment} from 'react';
import MenuBase from '../../00_utilities/components/ui/menu/menu';
import {Link} from 'react-router-dom'
import MenuInventarios from './inventarios';
import MenuPermisos from './permisos';
import MenuTerceros from './terceros';
import MenuCaja from './caja';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

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
                                <FontAwesomeIcon icon={['fas', 'building']} size='2x'/>
                            </div>
                        </Link>
                        <Link to='/app/admin/habitaciones/dashboard'>
                            <div style={iconStyles}>
                                <FontAwesomeIcon icon={['fas', 'bed']} size='2x'/>
                            </div>
                        </Link>
                        <Link to='/app/admin/productos/dashboard'>
                            <div style={iconStyles}>
                                <FontAwesomeIcon icon={['fas', 'glass-martini']} size='2x'/>
                            </div>
                        </Link>
                        <Link to='/app/admin/puntos_ventas/puntos_ventas/list'>
                            <div style={iconStyles}>
                                <FontAwesomeIcon icon={['fas', 'desktop']} size='2x'/>
                            </div>
                        </Link>
                    </Fragment>
                )
            }}
        </MenuBase>
    )
};

export default Menu;