import React, {Fragment} from 'react';
import MenuBase from '../../00_utilities/components/ui/menu/menu';
import Consultas from './consultas';
import {Link} from 'react-router-dom'

const iconStyles = {
    padding: 8,
};

const Menu = () => {
    return (
        <MenuBase>
            {mis_permisos => {
                return (
                    <Fragment>
                        {/*<Consultas/>*/}
                        {/*<Link to='/app/proyectos/colaboradores/colaboradores/list'>*/}
                            {/*<FontIcon className="fas fa-user" style={iconStyles}/>*/}
                        {/*</Link>*/}
                    </Fragment>
                )
            }}
        </MenuBase>
    )
};

export default Menu;