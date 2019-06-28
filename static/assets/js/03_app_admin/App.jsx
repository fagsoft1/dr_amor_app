import React, {Suspense, lazy, memo} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/DrawerMenu';

import Menu from './00_menu/index';
import App1 from "./index";
const Empresas = lazy(() => import('./especificas/empresas/empresas/EmpresaCRUD'));
const Habitaciones = lazy(() => import('./especificas/habitaciones/HabitacionDashboard'));
const ProductosDashboard = lazy(() => import('./especificas/productos/ProductoDashboard'));
const PermisosList = lazy(() => import('./generales/permisos/containers/permisos_list'));
const GruposPermisosList = lazy(() => import("./generales/permisos/containers/grupos_permisos_list_container"));
const UsuariosList = lazy(() => import("./generales/usuarios/UsuarioList"));
const UsuariosDetail = lazy(() => import("./generales/usuarios/usuarios_detail_container"));
const AcompanantesDashboard = lazy(() => import("./especificas/terceros_acompanantes/AcompananteDashboard"));
const ColaboradorList = lazy(() => import("./especificas/terceros_colaboradores/colaboradores/ColaboradorCRUD"));
const ColaboradorDetail = lazy(() => import("./especificas/terceros_colaboradores/colaboradores/ColaboradorDetail"));
const ProveedoresList = lazy(() => import("./especificas/terceros_proveedores/proveedores/ProveedorCRUD"));
const BodegasList = lazy(() => import("./especificas/inventarios/bodegas/BodegaCRUD"));
const BodegasDetail = lazy(() => import("./especificas/inventarios/bodegas/BodegaDetail"));
const MovimientosInventariosList = lazy(() => import("./especificas/inventarios/movimientos_inventarios/MovimientoInventarioCRUD"));
const MovimientosInventariosDetail = lazy(() => import("./especificas/inventarios/movimientos_inventarios/MovimientoInventarioDetail"));
const TrasladosInventariosList = lazy(() => import("./especificas/inventarios/traslados/traslados_list_container"));
const TrasladoInventarioDetail = lazy(() => import("./especificas/inventarios/traslados/traslados_detail"));
const CategoriaAcompananteDetail = lazy(() => import("./especificas/terceros_acompanantes/categorias/CategoriaAcompananteDetail.jsx"));
const PuntosVentasList = lazy(() => import("./especificas/puntos_ventas/puntos_ventas/PuntoVentaCRUD"));
const PuntoVentaDetail = lazy(() => import("./especificas/puntos_ventas/puntos_ventas/PuntoVentaDetalle"));
const BilletesMonedasList = lazy(() => import("./especificas/cajas/billetes_monedas/BilleteMonedaCRUD"));
const ConceptosOperacionesCajaList = lazy(() => import("./especificas/cajas/conceptos_operaciones_cajas/ConceptoOperacionCajaCRUD"));
const ParqueaderoDashboard = lazy(() => import('./especificas/parqueadero/ParqueaderoDashboard'));
const ParqueaderoModalidadFraccionTiempoDetail = lazy(() => import('./especificas/parqueadero/modalidades_fracciones_tiempo/ModalidadFraccionTiempoDetalle'));
const ContabilidadDashboard = lazy(() => import('./especificas/contabilidad/contabilidad/contabilidad_dashboard/containers/contabilidad_dashboard'));
const ConfiguracionContabilidadDashboard = lazy(() => import('./especificas/contabilidad/configuracion/ConfiguracionContabiidadDasboard'));

const AdminApp = memo(() => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Admin'>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route exact path='/app/admin/' component={App1}/>
                        <Route exact path='/app/admin/permisos/list' component={PermisosList}/>
                        <Route exact path='/app/admin/grupos_permisos/list' component={GruposPermisosList}/>
                        <Route exact path='/app/admin/usuarios/list' component={UsuariosList}/>
                        <Route exact path='/app/admin/terceros/colaboradores/list' component={ColaboradorList}/>
                        <Route exact path='/app/admin/terceros/colaboradores/detail/:id'
                               component={ColaboradorDetail}/>
                        <Route exact path='/app/admin/terceros/proveedores/list' component={ProveedoresList}/>
                        <Route exact path='/app/admin/empresas/empresas/list' component={Empresas}/>
                        <Route exact path='/app/admin/habitaciones/dashboard' component={Habitaciones}/>
                        <Route exact path='/app/admin/productos/dashboard' component={ProductosDashboard}/>
                        <Route exact path='/app/admin/parqueadero/dashboard' component={ParqueaderoDashboard}/>
                        <Route exact path='/app/admin/parqueadero/modalidad_fraccion_tiempo/detail/:id'
                               component={ParqueaderoModalidadFraccionTiempoDetail}/>
                        <Route exact path='/app/admin/usuarios/detail/:id' component={UsuariosDetail}/>
                        <Route exact path='/app/admin/inventarios/bodegas/list' component={BodegasList}/>
                        <Route exact path='/app/admin/inventarios/bodegas/detail/:id'
                               component={BodegasDetail}/>
                        <Route exact path='/app/admin/inventarios/movimientos_inventarios/list'
                               component={MovimientosInventariosList}/>
                        <Route exact path='/app/admin/inventarios/movimientos_inventarios/detail/:id'
                               component={MovimientosInventariosDetail}/>
                        <Route exact path='/app/admin/inventarios/traslados/list'
                               component={TrasladosInventariosList}/>
                        <Route exact path='/app/admin/inventarios/traslados/detail/:id'
                               component={TrasladoInventarioDetail}/>
                        <Route exact path='/app/admin/usuarios/acompanantes/dashboard'
                               component={AcompanantesDashboard}/>
                        <Route exact path='/app/admin/usuarios/acompanantes/categoria/detail/:id'
                               component={CategoriaAcompananteDetail}/>
                        <Route exact path='/app/admin/puntos_ventas/puntos_ventas/list'
                               component={PuntosVentasList}/>
                        <Route exact path='/app/admin/puntos_ventas/puntos_ventas/detail/:id'
                               component={PuntoVentaDetail}/>
                        <Route exact path='/app/admin/cajas/billetes_monedas/list'
                               component={BilletesMonedasList}/>
                        <Route exact path='/app/admin/cajas/conceptos_operaciones_caja/list'
                               component={ConceptosOperacionesCajaList}/>
                        <Route exact path='/app/admin/contabilidad/configuracion/dashboard'
                               component={ConfiguracionContabilidadDashboard}/>
                        <Route exact path='/app/admin/contabilidad/contabilidad/dashboard'
                               component={ContabilidadDashboard}/>
                    </Switch>
                </Suspense>
            </DrawerMenu>
        </Loading>
    )
});
export default AdminApp;