import {
    LOADING_STOP,
    LOADING
} from '../../01_actions/00_types';

export default function (state = false, action) {
    switch (action.type) {
        case LOADING:
            return true;
            break;
        case LOADING_STOP:
            return false;
            break;
        default:
            return state;
    }
}