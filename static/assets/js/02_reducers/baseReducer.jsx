import _ from 'lodash';

const mostrarLogs = (tipo) => {
    const mostrar = true;
    if (mostrar) {
        console.log('usando base reducers');
        console.log(`Entro a base reducer ${tipo}`);
    }
};

export default function (actions_types, state = [], action, id = 'id') {
    switch (action.type) {
        case actions_types.create:
            mostrarLogs('create');
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case actions_types.delete:
            mostrarLogs('delete');
            return _.omit(state, action.payload);
            break;
        case actions_types.fetch_all:
            mostrarLogs('fetch_all');
            return _.mapKeys(action.payload.data, id);
            break;
        case actions_types.fetch:
            mostrarLogs('fetch');
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case actions_types.clear:
            mostrarLogs('clear');
            return {};
            break;
        case actions_types.update:
            mostrarLogs('update');
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        default:
            return state;
    }
}