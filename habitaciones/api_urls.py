from rest_framework import routers
from .api_views import (
    HabitacionViewSet,
    TipoHabitacionViewSet
)

router = routers.DefaultRouter()
router.register(r'habitaciones', HabitacionViewSet)
router.register(r'habitaciones_tipos', TipoHabitacionViewSet)
