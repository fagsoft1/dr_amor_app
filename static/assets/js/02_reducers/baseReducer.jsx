import {omit, mapKeys} from 'lodash';

const mostrarLogs = (tipo) => {
    const mostrar = true;
    if (mostrar) {
        console.log('usando base reducers');
        console.log(`Entro a base reducer ${tipo}`);
    }
};

export default function (actions_types, state = {}, action, id = 'id') {
    switch (action.type) {
        case actions_types.create:
            mostrarLogs('create');
            state = {...state, [action.payload.data.id]: action.payload.data};
            return state;
        case actions_types.delete:
            mostrarLogs('delete');
            state = omit(state, action.payload);
            return state;
        case actions_types.fetch_all:
            mostrarLogs('fetch_all');
            state = mapKeys(action.payload.data, id);
            return state;
        case actions_types.fetch:
            mostrarLogs('fetch');
            if (!_.isEqual(action.payload.data, state[action.payload.data.id])) {
                state = {...state, [action.payload.data.id]: action.payload.data};
            }
            return state;
        case actions_types.clear:
            mostrarLogs('clear');
            return {};
        case actions_types.update:
            mostrarLogs('update');
            state = {...state, [action.payload.data.id]: action.payload.data};
            return state;
        default:
            return state;
    }
}