import {
    FETCH_PERMISOS,
    FETCH_PERMISO,
    CLEAR_PERMISOS,
    UPDATE_PERMISO
} from '../../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_PERMISOS:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_PERMISO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case UPDATE_PERMISO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case CLEAR_PERMISOS:
            return {};
            break;
        default:
            return state;
    }
}