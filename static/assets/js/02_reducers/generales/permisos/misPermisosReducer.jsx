import {
    PERMISO_TYPES as TYPES
} from '../../../01_actions/00_types';

export default function (state = {}, action) {
    switch (action.type) {
        case TYPES.mis_permisos:
            return action.payload.data.map((permiso) => {
                return permiso.codename
            });
        default:
            return state;
    }
}