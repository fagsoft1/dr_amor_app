from rest_framework import routers
from .api_views import HistoricoViewSet

router = routers.DefaultRouter()
router.register(r'historico', HistoricoViewSet)
