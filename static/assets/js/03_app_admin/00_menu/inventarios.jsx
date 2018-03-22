import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'


const MenuTerceros = (props) => (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
            <FontIcon className="fas fa-warehouse-alt"/>
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <MenuItem primaryText="Bodegas" containerElement={<Link to='/app/admin/inventarios/bodegas/list'/>}
            />
            <MenuItem primaryText="Kardex"
                      containerElement={<Link to='/app/admin/inventarios/movimientos_inventarios/list'/>}
            />
        </div>
    </li>
);


export default MenuTerceros;