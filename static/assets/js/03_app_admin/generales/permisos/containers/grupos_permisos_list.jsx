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
        this.state = {
            todos_los_permisos: {},
        };
        this.notificar = this.notificar.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.actualizarPermiso = this.actualizarPermiso.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    notificar(mensaje) {
        this.props.notificarAction(mensaje);
    }

    componentDidMount() {
        const {notificarErrorAction} = this.props;
        this.props.fetchPermisosActivos(
            (response) => {
                this.setState({todos_los_permisos: _.mapKeys(response, 'id')})
            }, notificarErrorAction
        );
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearGruposPermisos()
    }

    onSubmit(item) {
        const {notificarErrorAction} = this.props;
        const success_callback = (response) => {
            this.notificar(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito el grupo de permisos ${response.name}`);
        };

        if (item.id) {
            this.props.updateGrupoPermiso(item.id, item, success_callback, notificarErrorAction)
        } else {
            this.props.createGrupoPermiso(item, success_callback, notificarErrorAction)
        }
    }

    cargarDatos() {
        const {notificarErrorAction} = this.props;
        this.props.fetchGruposPermisos(null, notificarErrorAction);
    }

    actualizarPermiso(permiso, item) {
        const {notificarErrorAction, fetchPermisosPorGrupo} = this.props;
        const success_callback = () => {
            this.notificar(`Se ha actualizado con éxito el grupo de permisos con el permiso ${permiso.codename}`);
            fetchPermisosPorGrupo(
                item.id,
                null,
                notificarErrorAction
            )
        };
        if (item) {
            this.props.addPermisoGrupo(item.id, permiso.id, success_callback, notificarErrorAction);
        }
    }

    onDelete(grupoPermiso) {
        const {notificarErrorAction} = this.props;
        const success_callback = () => {
            this.notificar(`Se ha eliminado con éxito el grupo de permisos ${grupoPermiso.name}`)
        };
        this.props.deleteGrupoPermiso(grupoPermiso.id, success_callback, notificarErrorAction)
    }

    render() {
        const {
            notificarErrorAction,
            permisos,
            grupos_permisos,
            fetchPermisosPorGrupo,
        } = this.props;
        const {todos_los_permisos} = this.state;
        const permisos_view = permisosAdapter(permisos_view_groups);
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
                                        fetchPermisosPorGrupo(
                                            item.id,
                                            () => {
                                                onSelectItem(item);
                                            },
                                            notificarErrorAction
                                        )
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
                                            actualizarPermiso={
                                                (permiso) => {
                                                    this.actualizarPermiso(permiso, list_manager_state.item_seleccionado);
                                                }}
                                            permisos_todos={todos_los_permisos}
                                            permisos_activos={permisos}
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
        auth: state.auth,
        grupos_permisos: state.grupos_permisos,
        permisos: state.permisos
    }
}

export default connect(mapPropsToState, actions)(GruposPermisosList)