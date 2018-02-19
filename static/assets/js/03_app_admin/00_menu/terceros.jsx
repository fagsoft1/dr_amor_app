import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'

const MenuTerceros = (props) => (
    <IconMenu iconButtonElement={<IconButton><FontIcon className="fas fa-users"/></IconButton>}>
        {
            props.listar_usuarios &&
            <MenuItem
                value="1"
                primaryText="Usuarios"
                containerElement={<Link to='/app/admin/usuarios/list'/>}
            />
        }
    </IconMenu>
);

export default MenuTerceros;