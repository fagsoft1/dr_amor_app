from channelsmultiplexer import AsyncJsonWebsocketDemultiplexer
from chat.consumers import ChatConsumer


class EchoDemultiplexerAsyncJson(AsyncJsonWebsocketDemultiplexer):
    applications = {
        "chat": ChatConsumer,
    }
