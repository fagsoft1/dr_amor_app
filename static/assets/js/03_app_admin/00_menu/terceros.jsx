import React from 'react';
import Icon from '@material-ui/core/Icon';
import {Link} from 'react-router-dom'


const MenuTerceros = (props) => (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
            <Icon className="fas fa-users"/>
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link to='/app/admin/usuarios/list'>
                <span className="dropdown-item">Usuarios</span>
            </Link>
            <Link to='/app/admin/usuarios/acompanantes/dashboard'>
                <span className="dropdown-item">Acompanantes</span>
            </Link>
            <Link to='/app/admin/usuarios/colaboradores/list'>
                <span className="dropdown-item">Colaboradores</span>
            </Link>
            <Link to='/app/admin/terceros/proveedores/list'>
                <span className="dropdown-item">Proveedores</span>
            </Link>
        </div>
    </li>
);


export default MenuTerceros;