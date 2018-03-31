import {WebSocketBridge} from 'django-channels';
import * as actions from './01_actions/01_index';

import baseDemultiplexer from './demultiplexer_base';

let _socket = null;

const reconnect = (store) => {

};

export const WebSocketAPI = {
    connect: () => {
        const ws_path = "/ws/pos_servicios/";
        _socket = new WebSocketBridge();
        _socket.connect(ws_path);
    },

    listen: (store) => {
        _socket.socket.addEventListener('open', () => {
            reconnect(store);
            // store.dispatch(actions.fetchHabitaciones());
            // store.dispatch(actions.fetchServiciosPos());
            // store.dispatch(actions.reconexion());
        });

        _socket.socket.addEventListener('close', () => {
            store.dispatch(actions.noCargando());
            //alert('Existen problemas de conexión')
        });
        _socket.listen();

        let demul_actions = {
            stream: 'habitaciones',
            update: actions.refreshUpdateHabitacion,
            delete: actions.refreshDeleteHabitacion,
        };
        baseDemultiplexer(store, _socket, demul_actions)
    },
};