import {
    LOADING as TYPES
} from '../../01_actions/00_types';

export default function (state = {
    cargando: false,
    mensajes: [],
    error: null,
    titulo: '',
    index: 0
}, action) {
    let new_index = state.index;
    switch (action.type) {
        case TYPES.loading:
            new_index = state.index > 0 ? state.index + 1 : 1;
            return {
                index: new_index,
                cargando: new_index > 0,
                mensajes: new_index > 0 ? (action.mensaje ? [...state.mensajes, action.mensaje] : state.mensajes) : [],
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
                cargando: false,
                mensajes: action.mensaje ? [...state.mensajes, action.mensaje] : ['Ocurrió un Error'],
                error: true,
                titulo: action.titulo ? action.titulo : 'Error!!!'
            };
        default:
            return state;
    }
}