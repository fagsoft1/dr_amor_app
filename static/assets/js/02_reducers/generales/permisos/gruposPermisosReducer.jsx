import {
    FETCH_GRUPOS_PERMISOS,
    FETCH_GRUPO_PERMISO,
    CLEAR_GRUPOS_PERMISOS,
    UPDATE_GRUPO_PERMISO,
    DELETE_GRUPO_PERMISO,
    CREATE_GRUPO_PERMISO
} from '../../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_GRUPOS_PERMISOS:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_GRUPO_PERMISO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case UPDATE_GRUPO_PERMISO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case CREATE_GRUPO_PERMISO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case CLEAR_GRUPOS_PERMISOS:
            return {};
            break;
        case DELETE_GRUPO_PERMISO:
            return _.omit(state, action.payload);
            break;
        default:
            return state;
    }
}