import {
    CONFIGURACION_APLICACION_TYPES as TYPES
} from '../../../01_actions/00_types';

const initial_state = {
    datos_generales: {}
};

export default function (state = initial_state, action) {
    switch (action.type) {
        case TYPES.fetch_configuracion_aplicacion:
            return action.payload.data;
        case TYPES.update_datos_generales:
            return {datos_generales: action.payload.data};
        case TYPES.clear:
            return initial_state;
        default:
            return state;
    }
}