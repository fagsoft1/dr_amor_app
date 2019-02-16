import {
    LOADING as TYPES
} from '../../01_actions/00_types';

export default function (state = false, action) {
    switch (action.type) {
        case TYPES.loading:
            return {
                cargando: true,
                mensaje: action.message ? action.message : ''
            };
        case TYPES.stop:
            return {
                cargando: false,
                mensaje: null
            };
        default:
            return state;
    }
}