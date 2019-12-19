import {omit, mapKeys} from 'lodash';

const mostrarLogs = (tipo) => {
    const mostrar = true;
    if (mostrar) {
        console.log('usando base reducers');
        console.log(`Entro a base reducer ${tipo}`);
    }
};

export default function (actions_types, state = {}, action, mapKey = 'id') {
    switch (action.type) {
        case actions_types.create:
            mostrarLogs('create');
            return {...state, [action.payload.data.id]: action.payload.data};
        case actions_types.delete:
            mostrarLogs('delete');
            return omit(state, action.payload);
        case actions_types.fetch_all:
            mostrarLogs('fetch_all');
            let result = mapKeys(action.payload.data, mapKey);
            const {preserve_items = null} = action.payload;
            if (preserve_items) {
                result = {..._.omit(result, preserve_items), ..._.pickBy(state, e => preserve_items.includes(e[mapKey]))}
            }
            return result;
        case actions_types.fetch:
            mostrarLogs('fetch');
            if (!_.isEqual(state[action.payload.data.id], action.payload.data)) {
                return {...state, [action.payload.data.id]: action.payload.data};
            } else {
                return state
            }
        case actions_types.clear:
            mostrarLogs('clear');
            if (action.payload) {
                const {omit_items = null} = action.payload;
                if (omit_items) {
                    return _.pickBy(state, e => omit_items.includes(e[mapKey]));
                }
            }
            return {};
        case actions_types.update:
            mostrarLogs('update');
            return {...state, [action.payload.data.id]: action.payload.data};
        default:
            return state;
    }
}