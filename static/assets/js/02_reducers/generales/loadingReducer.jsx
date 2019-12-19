import {
    LOADING as TYPES
} from '../../01_actions/00_types';

const initial_values = {
    cargando: false,
    mensajes: {},
    error: null,
    titulo: '',
    index: 0
};

export default function (state = initial_values, action) {
    let new_index = state.index;
    switch (action.type) {
        case TYPES.loading:
            new_index = state.index > 0 ? state.index + 1 : 1;
            return {
                index: new_index,
                cargando: new_index > 0,
                mensajes: new_index > 0 ? (action.mensaje ? {
                    ...state.mensajes,
                    [action.mensaje]: action.mensaje
                } : state.mensajes) : {},
                error: false,
                titulo: action.titulo ? action.titulo : 'Procesando...'
            };
        case TYPES.stop:
            new_index = state.index > 0 ? state.index - 1 : 0;
            return {
                index: new_index,
                cargando: new_index > 0,
                mensajes: new_index <= 0 ? [] : state.mensajes,
                error: false,
                titulo: new_index > 0 ? state.titulo : ''
            };
        case TYPES.error:
            return {
                index: 0,
                cargando: true,
                mensajes: action.mensaje ? {...state.mensajes, [action.mensaje]: action.mensaje} : ['Ocurrió un Error'],
                error: true,
                titulo: `Error ${action.titulo}`
            };
        case TYPES.reset:
            return initial_values;
        default:
            return state;
    }
}