import React, {Component} from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {tengoPermiso} from '../../00_utilities/common';
import {
    PERMISO_LIST_USER,
    PERMISO_LIST_PERMISSION,
    PERMISO_LIST_GROUP
} from '../../00_utilities/permisos/types';


import MenuMiCuenta from './mi_cuenta';
import MenuTerceros from './terceros';
import MenuPermisos from './permisos';

import * as actions from "./../../01_actions/01_index";
import {connect} from "react-redux";


class Menu extends Component {
    componentDidMount() {
        this.props.fetchMiCuenta();
        this.props.fetchMisPermisos();
    }

    render() {
        const {mis_permisos} = this.props;

        const listar_usuarios = tengoPermiso(mis_permisos, [PERMISO_LIST_USER]);
        const menu_terceros = listar_usuarios;


        const listar_permisos = tengoPermiso(mis_permisos, [PERMISO_LIST_PERMISSION]);
        const listar_groups = tengoPermiso(mis_permisos, [PERMISO_LIST_GROUP]);
        const menu_permisos = listar_permisos || listar_groups;

        return (
            <Toolbar>
                <ToolbarGroup firstChild={true}>
                    {
                        menu_terceros &&
                        <MenuTerceros listar_usuarios={listar_usuarios}/>
                    }
                    {
                        menu_permisos &&
                        <MenuPermisos
                            listar_permisos={listar_permisos}
                            listar_groups={listar_groups}
                        />
                    }
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarSeparator/>
                    <MenuMiCuenta/>
                </ToolbarGroup>
            </Toolbar>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mi_cuenta: state.mi_cuenta,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(Menu);