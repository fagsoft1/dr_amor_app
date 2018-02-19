import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'


const MenuPermisos = (props) => (
    <IconMenu iconButtonElement={<IconButton><FontIcon className="fas fa-lock-alt"/></IconButton>}>
        {
            props.listar_permisos &&
            <MenuItem
                value="1"
                primaryText="Permisos"
                containerElement={<Link to='/app/admin/permisos/list'/>}
            />
        }
        {
            props.listar_groups &&
            <MenuItem
                value="1"
                primaryText="Grupos"
                containerElement={<Link to='/app/admin/grupos_permisos/list'/>}
            />
        }
    </IconMenu>
);
export default MenuPermisos;
