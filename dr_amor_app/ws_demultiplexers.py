from channels.generic.websockets import WebsocketDemultiplexer
from habitaciones.api_serializers import HabitacionBinding


class PruebaDemultiplexer(WebsocketDemultiplexer):
    consumers = {
        "habitaciones": HabitacionBinding.consumer,
    }

    groups = ["binding.pos_servicios"]
