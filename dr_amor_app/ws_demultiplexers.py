from channels.generic.websockets import WebsocketDemultiplexer
from habitaciones.api_serializers import HabitacionBinding
from productos.api_serializers import ProductoBinding
from terceros.api_serializers import TercerosBinding
from inventarios.api_serializers import MovimientoInventarioDetalleBinding


class PruebaDemultiplexer(WebsocketDemultiplexer):
    consumers = {
        "habitaciones": HabitacionBinding.consumer,
        "terceros": TercerosBinding.consumer,
        "productos": ProductoBinding.consumer,
        "movimientos_inventarios_detalles": MovimientoInventarioDetalleBinding.consumer,
    }
    groups = ["binding.pos_servicios"]
