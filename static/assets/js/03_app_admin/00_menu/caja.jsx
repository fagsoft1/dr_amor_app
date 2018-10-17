import React from 'react';
import Icon from '@material-ui/core/Icon';
import {Link} from 'react-router-dom'


const MenuCaja = (props) => (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
            <Icon className="far fa-money-bill-alt"/>
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link to='/app/admin/cajas/billetes_monedas/list'>
                <span className="dropdown-item">Billetes y Monedas</span>
            </Link>
            <Link to='/app/admin/cajas/conceptos_operaciones_caja/list'>
                <span className="dropdown-item">Conceptos Operaciones Caja</span>
            </Link>
        </div>
    </li>
);


export default MenuCaja;