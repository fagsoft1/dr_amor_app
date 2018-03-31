const mostrarFunciones = (e) => {
    const mostrar = true;
    if (mostrar) {
        e()
    }
};

const demultiplexer = (store, socket, actions) => {
    socket.demultiplex(actions.stream, function (payload, streamName) {
        mostrarFunciones(console.log(`%cDemultiplexer ${actions.stream} con acción - %c${payload.action} - %cID ${payload.pk}`, 'color:red', 'color:blue', 'color:green'));
        switch (payload.action) {
            case ("update"):
                store.dispatch(actions.update(payload));
                break;
            case ("create"):
                store.dispatch(actions.update(payload));
                break;
            case ("delete"):
                store.dispatch(actions.delete(payload.pk));
                break;
        }
    });
};

export default demultiplexer;