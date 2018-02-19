import {
    FETCH_OTRO_USUARIO_PERMISOS
} from '../../../01_actions/00_types';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_OTRO_USUARIO_PERMISOS:
            return _.mapKeys(action.payload.data, 'id');
            break;
        default:
            return state;
    }
}