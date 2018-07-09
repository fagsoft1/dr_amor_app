import React, {Fragment} from 'react';
import Icon from '@material-ui/core/Icon';
import {Link} from 'react-router-dom'

const MenuPermisos = (props) => (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
            <Icon className="fas fa-lock-alt"/>
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link to='/app/admin/permisos/list'>
                <span className="dropdown-item">Permisos</span>
            </Link>
            <Link to='/app/admin/grupos_permisos/list'>
                <span className="dropdown-item">Grupos</span>
            </Link>
        </div>
    </li>

);
export default MenuPermisos;
