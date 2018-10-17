import React from 'react';
import Icon from '@material-ui/core/Icon';
import {Link} from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip';


const MenuCaja = (props) => (
    <li className="nav-item dropdown">
        <Tooltip title="Registrar Operaciones">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
                <Icon className="far fa-exchange-alt"/>
            </a>
        </Tooltip>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link to='/app/cajas/'>
                <span className="dropdown-item">Acompañantes</span>
            </Link>
            <Link to='/app/cajas/'>
                <span className="dropdown-item">Colaboradores</span>
            </Link>
            <Link to='/app/cajas/'>
                <span className="dropdown-item">Proveedores</span>
            </Link>
            <Link to='/app/cajas/'>
                <span className="dropdown-item">Taxis</span>
            </Link>
            <Link to='/app/cajas/'>
                <span className="dropdown-item">Otros</span>
            </Link>
        </div>
    </li>
);


export default MenuCaja;