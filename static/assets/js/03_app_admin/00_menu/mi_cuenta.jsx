import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

const MenuMiCuenta = () => (
    <IconMenu
        iconButtonElement={
            <IconButton touch={true}>
                <NavigationExpandMoreIcon/>
            </IconButton>
        }
    >
        <MenuItem
            primaryText="Salir"
            containerElement={<a href="/accounts/logout/?next=/"/>}
            rightIcon={<FontIcon className="right-icon fas fa-sign-out"/>}
        />
    </IconMenu>
);

export default MenuMiCuenta;