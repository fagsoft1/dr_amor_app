from rest_framework import routers
from .api_views import (
    MetodoPagoViewSet,
)

router = routers.DefaultRouter()
router.register(r'contabilidad_metodos_pagos', MetodoPagoViewSet)
