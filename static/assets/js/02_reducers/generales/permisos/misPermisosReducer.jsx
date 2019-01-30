import {
    FETCH_MIS_PERMISOS
} from '../../../01_actions/00_types';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_MIS_PERMISOS:
            return action.payload.data.map((permiso) => {
                return permiso.codename
            });
            break;
        default:
            return state;
    }
}