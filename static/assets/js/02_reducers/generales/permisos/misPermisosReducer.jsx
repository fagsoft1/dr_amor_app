import {
    FETCH_MIS_PERMISOS
} from '../../../01_actions/00_types';

import _ from 'lodash';

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