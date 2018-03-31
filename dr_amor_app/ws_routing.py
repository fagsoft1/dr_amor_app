from channels import route_class
from .ws_demultiplexers import PruebaDemultiplexer

channel_routing = [
    #route_class(UsuariosDemultiplexer, path='^/ws/usuarios/?$'),
    route_class(PruebaDemultiplexer, path='^/ws/pos_servicios/?$'),
]
