import {SERVER_INFORMATION_TYPES as TYPES} from '../../../01_actions/00_types';

const initial_state = {
    server_data: {},
};

export default function (state = initial_state, action) {
    switch (action.type) {
        case TYPES.fetch_server_data:
            console.log(new Date());
            console.log(new Date(action.payload.data.local_datetime));
            return {server_data: action.payload.data};
        case TYPES.clear:
            return initial_state;
        default:
            return state;
    }
}