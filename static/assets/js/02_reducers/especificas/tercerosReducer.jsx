import {
    CREATE_TERCERO,
    DELETE_TERCERO,
    FETCH_TERCEROS,
    FETCH_TERCERO,
    CLEAR_TERCEROS,
    UPDATE_TERCERO
} from '../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_TERCEROS:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_TERCERO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case CREATE_TERCERO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case UPDATE_TERCERO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case DELETE_TERCERO:
            return _.omit({...state}, action.payload);
            break;
        case CLEAR_TERCEROS:
            return {};
            break;
        default:
            return state;
    }
}