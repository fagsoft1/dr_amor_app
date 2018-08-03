import {
    LOADING_STOP,
    LOADING
} from '../../01_actions/00_types';

export default function (state = false, action) {
    switch (action.type) {
        case LOADING:
            return {
                cargando: true,
                mensaje: action.message ? action.message : ''
            };
        case LOADING_STOP:
            return {
                cargando: false,
                mensaje: null
            };
        default:
            return state;
    }
}