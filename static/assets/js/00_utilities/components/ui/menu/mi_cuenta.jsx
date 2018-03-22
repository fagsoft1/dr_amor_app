import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';

const MenuMiCuenta = (props) => (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
            <FontIcon className="fas fa-lock-alt"/>
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <MenuItem
                primaryText="Salir"
                containerElement={<a href="/accounts/logout/?next=/"/>}
                rightIcon={<FontIcon className="right-icon fas fa-sign-out"/>}
            />
        </div>
    </li>
);

export default MenuMiCuenta;