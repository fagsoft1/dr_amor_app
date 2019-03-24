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
            store.dispatch(actions.noCargando());
        });

        _socket.socket.addEventListener('close', () => {
            store.dispatch(actions.mostrar_error_loading('Problemas de Conexion', 'Error de red'));
        });
        _socket.listen();

        let demul_actions = {
            stream: 'habitaciones',
            update: actions.refreshUpdateHabitacion,
            create: actions.refreshUpdateHabitacion,
            delete: actions.refreshDeleteHabitacion,
        };
        baseDemultiplexer(store, _socket, demul_actions);

        demul_actions = {
            stream: 'servicios',
            update: actions.refreshUpdateServicio,
            create: actions.refreshUpdateServicio,
            delete: actions.refreshDeleteServicio,
        };
        baseDemultiplexer(store, _socket, demul_actions);

        demul_actions = {
            stream: 'productos',
            update: actions.refreshUpdateProducto,
            create: actions.refreshUpdateProducto,
            delete: actions.refreshDeleteProducto,
        };
        baseDemultiplexer(store, _socket, demul_actions);

        demul_actions = {
            stream: 'terceros',
            update: actions.refreshUpdateTercero,
            create: actions.refreshUpdateTercero,
            delete: actions.refreshDeleteTercero,
        };
        baseDemultiplexer(store, _socket, demul_actions);

        demul_actions = {
            stream: 'movimientos_inventarios_detalles',
            update: actions.refreshUpdateMovimientoInventarioDetalle,
            create: actions.refreshUpdateMovimientoInventarioDetalle,
            delete: actions.refreshDeleteMovimientoInventarioDetalle,
        };
        baseDemultiplexer(store, _socket, demul_actions)


    },
};