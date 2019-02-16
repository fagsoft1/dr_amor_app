import {MENU_TYPES as TYPES} from '../../01_actions/00_types';

export default function (state = {open_menu: false, submenu_abiertos: 0}, action) {
    switch (action.type) {
        case TYPES.open:
            return {
                open_menu: true,
                submenu_abiertos: state.submenu_abiertos
            };
        case TYPES.close:
            return {
                open_menu: false,
                submenu_abiertos: state.submenu_abiertos
            };
        case TYPES.close_submentu:
            return {
                open_menu: state.open_menu,
                submenu_abiertos: state.submenu_abiertos - 1
            };
        case TYPES.open_submenu:
            return {
                open_menu: state.open_menu,
                submenu_abiertos: state.submenu_abiertos + 1
            };
        case TYPES.reset:
            return {
                open_menu: false,
                submenu_abiertos: 0
            };
        default:
            return state;
    }
}