import React, {Fragment} from 'react';
import MenuBase from '../../00_utilities/components/ui/menu/menu';

const Menu = () => {
    return (
        <MenuBase>
            {mis_permisos => {
                return (
                    <Fragment>
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