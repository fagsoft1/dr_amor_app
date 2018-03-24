import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import Menu from './00_menu/index';

import App1 from "./index";
import PermisosList from "./generales/permisos/containers/permisos_list";
import GruposPermisosList from "./generales/permisos/containers/grupos_permisos_list";
import UsuariosList from "./generales/usuarios/containers/usuarios_list";
import UsuariosDetail from "./generales/usuarios/containers/usuarios_detail";
import AcompanantesDashboard from "./especificas/terceros_acompanantes/dashboard/containers/acompanantes_dashboard";
import ColaboradorList from "./especificas/terceros_colaboradores/colaboradores/containers/base_list_container";
import ProveedoresList from "./especificas/terceros_proveedores/proveedores/containers/proveedores_list_container";
import EmpresasList from "./especificas/empresas/empresas/containers/empresas_list_container";
import HabitacionesList from "./especificas/habitaciones/habitaciones_dashboard/containers/habitaciones_dashboard";
import ProductosDashboard from "./especificas/productos/productos_dashboard/containers/base_dashboard";
import BodegasList from "./especificas/inventarios/bodegas/containers/bodegas_list_container";
import BodegasDetail from "./especificas/inventarios/bodegas/containers/bodega_detail";
import MovimientosInventariosList from "./especificas/inventarios/movimientos_inventarios/containers/movimientos_inventarios_list_container";
import MovimientosInventariosDetail from "./especificas/inventarios/movimientos_inventarios/containers/movimientos_inventarios_detail";

import TrasladosInventariosList from "./especificas/inventarios/traslados/containers/traslados_list_container";
import TrasladoInventarioDetail from "./especificas/inventarios/traslados/containers/traslados_detail";


const AdminApp = (props) => {
    return (
        <Loading>
            <Fragment>
                <Menu/>
                <div className="p-3">
                    <Switch>
                        <Route exact path='/app/admin/' component={App1}/>
                        <Route exact path='/app/admin/permisos/list' component={PermisosList}/>
                        <Route exact path='/app/admin/grupos_permisos/list' component={GruposPermisosList}/>
                        <Route exact path='/app/admin/usuarios/list' component={UsuariosList}/>
                        <Route exact path='/app/admin/usuarios/colaboradores/list' component={ColaboradorList}/>
                        <Route exact path='/app/admin/terceros/proveedores/list' component={ProveedoresList}/>
                        <Route exact path='/app/admin/empresas/empresas/list' component={EmpresasList}/>
                        <Route exact path='/app/admin/habitaciones/dashboard' component={HabitacionesList}/>
                        <Route exact path='/app/admin/productos/dashboard' component={ProductosDashboard}/>
                        <Route exact path='/app/admin/usuarios/detail/:id' component={UsuariosDetail}/>
                        <Route exact path='/app/admin/inventarios/bodegas/list' component={BodegasList}/>
                        <Route exact path='/app/admin/inventarios/bodegas/detail/:id' component={BodegasDetail}/>
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
                    </Switch>
                </div>
            </Fragment>
        </Loading>
    )
};

export default AdminApp;