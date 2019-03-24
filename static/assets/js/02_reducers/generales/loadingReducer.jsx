import {
    LOADING as TYPES
} from '../../01_actions/00_types';

export default function (state = {cargando: false, mensaje: null, error: null, titulo: null}, action) {
    switch (action.type) {
        case TYPES.loading:
            return {
                cargando: true,
                mensaje: action.mensaje ? action.mensaje : '',
                error: false,
                titulo: action.titulo ? action.titulo : 'Procesando...'
            };
        case TYPES.stop:
            return {
                cargando: false,
                mensaje: null,
                error: false,
                titulo: null
            };
        case TYPES.error:
            return {
                cargando: true,
                mensaje: action.mensaje ? action.mensaje : 'Ocurrió un Error',
                error: true,
                titulo: action.titulo ? action.titulo : 'Error!!!'
            };
        default:
            return state;
    }
}