import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../00_utilities/templates/fragmentos";
import {permisosAdapter} from "../../../../00_utilities/common";
import CreateForm from '../components/forms/grupo_permiso_form';
import ListManager from "../../../../00_utilities/components/CRUDTableManager";
import {
    GROUPS as permisos_view_groups
} from '../../../../00_utilities/permisos/types';

import Tabla from '../components/grupos_permisos_tabla';
import PermisosGrupo from '../components/permisos_select_permisos';

class GruposPermisosList extends Component {
    constructor(props) {
        super(props);
        /////////////////////////// Generales /////////////////////////////
        this.error_callback = this.error_callback.bind(this);
        this.notificar = this.notificar.bind(this);
        /////////////////////////////////////////////////////////////////
        this.cargarDatos = this.cargarDatos.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.actualizarPermiso = this.actualizarPermiso.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

/////////////////////////// Generales /////////////////////////////

    error_callback(error) {
        this.props.notificarErrorAjaxAction(error);
    }

    notificar(mensaje) {
        this.props.notificarAction(mensaje);
    }

    componentDidMount() {
        this.cargarDatos();
    }

////////////////////////////////////////////////////////

    componentWillUnmount() {
        this.props.clearGruposPermisos()
    }

    onSubmit(item) {
        const success_callback = (response) => {
            this.props.noCargando();
            this.notificar(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito el grupo de permisos ${response.name}`);
        };
        this.props.cargando();

        if (item.id) {
            this.props.updateGrupoPermiso(item.id, item, success_callback, this.error_callback)
        } else {
            this.props.createGrupoPermiso(item, success_callback, this.error_callback)
        }
    }

    cargarDatos() {
        this.props.cargando();
        const cargarGruposPermisos = () => this.props.fetchGruposPermisos(() => this.props.noCargando(), this.error_callback);
        const cargarPermisosActivos = () => this.props.fetchPermisosActivos(cargarGruposPermisos, this.error_callback);
        this.props.fetchMisPermisos(cargarPermisosActivos, this.error_callback);
    }

    actualizarPermiso(permiso, item, onSelectItem) {
        const success_callback = (response) => {
            this.notificar(`Se ha actualizado con éxito el grupo de permisos con el permiso ${permiso.codename}`);
            onSelectItem(response);
            this.props.noCargando();
        };
        if (item) {
            this.props.cargando();
            this.props.addPermisoGrupo(item.id, permiso.id, success_callback, this.error_callback);
        }

    }

    onDelete(grupoPermiso) {
        const success_callback = () => {
            this.props.noCargando();
            this.notificar(`Se ha eliminado con éxito el grupo de permisos ${grupoPermiso.name}`)
        };
        this.props.cargando();
        this.props.deleteGrupoPermiso(grupoPermiso.id, success_callback, this.error_callback)
    }

    render() {
        const {mis_permisos, permisos, grupos_permisos} = this.props;
        const permisos_view = permisosAdapter(mis_permisos, permisos_view_groups);

        return (
            <ListManager permisos={permisos_view} singular_name='grupos de permisos' plural_name='grupo de permisos'>
                {
                    (list_manager_state,
                     onSelectItem,
                     onCancel,
                     handleModalOpen,
                     handleModalClose) => {
                        return (
                            <Fragment>
                                <CreateForm
                                    onCancel={onCancel}
                                    item_seleccionado={list_manager_state.item_seleccionado}
                                    onSubmit={
                                        (item) => {
                                            this.onSubmit(item, list_manager_state.singular_name);
                                            handleModalClose();
                                        }
                                    }
                                    modal_open={list_manager_state.modal_open}
                                    element_type={`${list_manager_state.singular_name}`}
                                />


                                <Titulo>Lista de {list_manager_state.plural_name}</Titulo>
                                <CargarDatos
                                    cargarDatos={this.cargarDatos}
                                />


                                <Tabla
                                    data={grupos_permisos}
                                    permisos={permisos_view}
                                    element_type={`${list_manager_state.singular_name}`}
                                    onDelete={(item) => {
                                        this.onDelete(item, list_manager_state.singular_name);
                                        handleModalClose();
                                    }}
                                    onSelectItemEdit={(item) => {
                                        onSelectItem(item);
                                        handleModalOpen();
                                    }}

                                    onSelectItemDetail={(item) => {
                                        this.props.fetchGruposPermisos(item.id, () => onSelectItem(item), this.error_callback);
                                    }}
                                    updateItem={(item) => this.onSubmit(item, list_manager_state.singular_name)}
                                />
                                {
                                    list_manager_state.item_seleccionado &&
                                    (permisos_view.change || permisos_view.detail) &&
                                    <Fragment>
                                        <h5>{list_manager_state.item_seleccionado.name}</h5>
                                        <PermisosGrupo
                                            can_change={permisos_view.change}
                                            actualizarPermiso={(permiso) => {
                                                this.actualizarPermiso(permiso, list_manager_state.item_seleccionado, onSelectItem);
                                            }}
                                            permisos_todos={permisos}
                                            permisos_activos={list_manager_state.item_seleccionado.permissions}
                                        />
                                    </Fragment>
                                }
                                <CargarDatos
                                    cargarDatos={this.cargarDatos}
                                />

                            </Fragment>
                        )
                    }
                }
            </ListManager>
        )
    }

}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        grupos_permisos: state.grupos_permisos,
        permisos: state.permisos
    }
}

export default connect(mapPropsToState, actions)(GruposPermisosList)