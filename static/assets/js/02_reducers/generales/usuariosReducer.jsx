import {
    CREATE_USUARIO,
    DELETE_USUARIO,
    FETCH_USUARIOS,
    FETCH_USUARIO,
    CLEAR_USUARIOS,
    UPDATE_USUARIO
} from '../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_USUARIOS:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_USUARIO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case UPDATE_USUARIO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case CREATE_USUARIO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case CLEAR_USUARIOS:
            return {};
            break;
        case DELETE_USUARIO:
            return _.omit(state, action.payload);
            break;
        default:
            return state;
    }
}