import React, {Component, Suspense, lazy} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/DrawerMenu';

import Menu from './00_menu/index';
import App1 from "./index";

const Empresas = lazy(() => import('./especificas/empresas/empresas/EmpresaList'));
const Habitaciones = lazy(() => import('./especificas/habitaciones/habitaciones_dashboard/HabitacionDashboard'));
const ProductosDashboard = lazy(() => import('./especificas/productos/ProductoDashboard'));
const PermisosList = lazy(() => import('./generales/permisos/containers/permisos_list'));

const GruposPermisosList = lazy(() => import("./generales/permisos/containers/grupos_permisos_list_container"));
const UsuariosList = lazy(() => import("./generales/usuarios/containers/usuarios_list_container"));
const UsuariosDetail = lazy(() => import("./generales/usuarios/containers/usuarios_detail_container"));
const AcompanantesDashboard = lazy(() => import("./especificas/terceros_acompanantes/dashboard/containers/acompanantes_dashboard"));

const ColaboradorList = lazy(() => import("./especificas/terceros_colaboradores/colaboradores/containers/colaboradores_list_container"));
const ColaboradorDetail = lazy(() => import("./especificas/terceros_colaboradores/colaboradores/containers/colaboradores_detail"));


const ProveedoresList = lazy(() => import("./especificas/terceros_proveedores/proveedores/containers/proveedores_list_container"));
const BodegasList = lazy(() => import("./especificas/inventarios/bodegas/containers/bodegas_list_container"));
const BodegasDetail = lazy(() => import("./especificas/inventarios/bodegas/containers/bodega_detail"));
const MovimientosInventariosList = lazy(() => import("./especificas/inventarios/movimientos_inventarios/containers/movimientos_inventarios_list_container"));
const MovimientosInventariosDetail = lazy(() => import("./especificas/inventarios/movimientos_inventarios/containers/movimientos_inventarios_detail"));

const TrasladosInventariosList = lazy(() => import("./especificas/inventarios/traslados/containers/traslados_list_container"));
const TrasladoInventarioDetail = lazy(() => import("./especificas/inventarios/traslados/containers/traslados_detail"));

const CategoriaAcompananteDetail = lazy(() => import("./especificas/terceros_acompanantes/categorias/containers/categoria_detail"));

const PuntosVentasList = lazy(() => import("./especificas/puntos_ventas/puntos_ventas/PuntoVentaList"));
const PuntoVentaDetail = lazy(() => import("./especificas/puntos_ventas/puntos_ventas/PuntoVentaDetalle"));

const BilletesMonedasList = lazy(() => import("./especificas/cajas/billetes_monedas/containers/billetes_monedas_list_container"));
const ConceptosOperacionesCajaList = lazy(() => import("./especificas/cajas/conceptos_operaciones_cajas/containers/conceptos_operaciones_caja_list_container"));

const ParqueaderoDashboard = lazy(() => import('./especificas/parqueadero/ParqueaderoDashboard'));
const ParqueaderoModalidadFraccionTiempoDetail = lazy(() => import('./especificas/parqueadero/modalidades_fracciones_tiempo/ModalidadFraccionTiempoDetalle'));

const ContabilidadDashboard = lazy(() => import('./especificas/contabilidad/contabilidad/contabilidad_dashboard/containers/contabilidad_dashboard'));
const ConfiguracionContabilidadDashboard = lazy(() => import('./especificas/contabilidad/configuracion/configuracion_dashboard/containers/configuracion_contabilidad_dashboard'));

class AdminApp extends Component {
    render() {
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
                            <Route exact path='/app/admin/usuarios/acompanantes/detail/:id'
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
    }
}

export default AdminApp;