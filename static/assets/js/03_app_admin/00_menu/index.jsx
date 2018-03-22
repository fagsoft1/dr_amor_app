import React, {Fragment} from 'react';
import MenuBase from '../../00_utilities/components/ui/menu/menu';
import MenuTerceros from './terceros';
import MenuPermisos from './permisos';
import MenuInventarios from './inventarios';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'

const iconStyles = {
    padding: 8,
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
                        <Link to='/app/admin/empresas/empresas/list'>
                            <FontIcon className="fas fa-building" style={iconStyles}/>
                        </Link>
                        <Link to='/app/admin/habitaciones/dashboard'>
                            <FontIcon className="fas fa-bed" style={iconStyles}/>
                        </Link>
                        <Link to='/app/admin/productos/dashboard'>
                            <FontIcon className="fas fa-glass-martini" style={iconStyles}/>
                        </Link>
                    </Fragment>
                )
            }}
        </MenuBase>
    )
};

export default Menu;