import {
    MENU_TYPES as TYPES
} from '../00_types';

export const openMenu = () => {
    return (dispatch) => {
        dispatch({type: TYPES.open})
    }
};

export const openTMenu = () => {
    return (dispatch) => {
        dispatch({type: TYPES.open_submenu})
    }
};

export const closeMenu = () => {
    return (dispatch) => {
        dispatch({type: TYPES.close})
    }
};

export const closeTMenu = () => {
    return (dispatch) => {
        dispatch({type: TYPES.close_submentu})
    }
};

export const resetMenu = () => {
    return (dispatch) => {
        dispatch({type: TYPES.reset})
    }
};