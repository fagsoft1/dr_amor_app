from .api_routers import DefaultRouter
from permisos.api_urls import router as permisos_router
from usuarios.api_urls import router as usuarios_router
from terceros.api_urls import router as terceros_router
from terceros_acompanantes.api_urls import router as terceros_acompanante_router
from empresas.api_urls import router as empresas_router
from habitaciones.api_urls import router as habitaciones_router
from productos.api_urls import router as productos_router
from inventarios.api_urls import router as inventarios_router
from puntos_venta.api_urls import router as puntos_ventas_router
from servicios.api_urls import router as servicios_router
from cajas.api_urls import router as cajas_router
from ventas.api_urls import router as ventas_router
from parqueadero.api_urls import router as parqueadero_router
from liquidaciones.api_urls import router as liquidaciones_router
from consultas_dr_amor.api_urls import router as consultas_dr_amor_router
from contabilidad_cuentas.api_urls import router as contabilidad_cuentas_router
from contabilidad_diario.api_urls import router as contabilidad_diarios_router
from contabilidad_bancos.api_urls import router as contabilidad_bancos_router
from contabilidad_impuestos.api_urls import router as contabilidad_impuestos_router
from contabilidad_movimientos.api_urls import router as contabilidad_movimientos_router
from contabilidad_metodos_pago.api_urls import router as metodos_pagos_router
from contabilidad_comprobantes.api_urls import router as comprobantes_contables_router

router = DefaultRouter()
router.extend(permisos_router)
router.extend(usuarios_router)
router.extend(terceros_router)
router.extend(terceros_acompanante_router)
router.extend(empresas_router)
router.extend(habitaciones_router)
router.extend(productos_router)
router.extend(inventarios_router)
router.extend(puntos_ventas_router)
router.extend(servicios_router)
router.extend(cajas_router)
router.extend(ventas_router)
router.extend(parqueadero_router)
router.extend(liquidaciones_router)
router.extend(consultas_dr_amor_router)
router.extend(contabilidad_cuentas_router)
router.extend(contabilidad_bancos_router)
router.extend(contabilidad_diarios_router)
router.extend(contabilidad_movimientos_router)
router.extend(contabilidad_impuestos_router)
router.extend(metodos_pagos_router)
router.extend(comprobantes_contables_router)
