import {
    FETCH_MI_CUENTA
} from '../../01_actions/00_types';

export default function (state = {}, action) {
    switch (action.type) {
        case FETCH_MI_CUENTA:
            return action.payload.data[0];
            break;
        default:
            return state;
    }
}