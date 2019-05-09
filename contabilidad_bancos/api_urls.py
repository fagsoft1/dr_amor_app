from rest_framework import routers
from .api_views import (
    CuentaBancariaBancoViewSet,
    BancoViewSet
)

router = routers.DefaultRouter()
router.register(r'contabilidad_bancos_banco', BancoViewSet)
router.register(r'contabilidad_bancos_cuenta_bancaria', CuentaBancariaBancoViewSet)
