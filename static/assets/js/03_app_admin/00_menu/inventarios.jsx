import React from 'react';
import Icon from '@material-ui/core/Icon';
import {Link} from 'react-router-dom'


const MenuTerceros = (props) => (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
            <Icon className="fas fa-warehouse"/>
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link to='/app/admin/inventarios/bodegas/list'>
                <span className="dropdown-item">Bodegas</span>
            </Link>
            <Link to='/app/admin/inventarios/movimientos_inventarios/list'>
                <span className="dropdown-item">Kardex</span>
            </Link>
            <Link to='/app/admin/inventarios/traslados/list'>
                <span className="dropdown-item">Kardex Traslados</span>
            </Link>
        </div>
    </li>
);


export default MenuTerceros;