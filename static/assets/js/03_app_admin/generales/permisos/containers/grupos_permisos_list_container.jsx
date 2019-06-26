import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/CargarDatos";
import {
    GROUPS as permisos_view_groups
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";
import CreateForm from '../components/forms/grupo_permiso_form';
import Tabla from '../components/grupos_permisos_tabla';
import crudHOC from '../../../../00_utilities/components/HOCCrud';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import {ListaBusqueda} from '../../../../00_utilities/utiles';

const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.onSelectItemDetail = this.onSelectItemDetail.bind(this);
        this.actualizarPermiso = this.actualizarPermiso.bind(this);
        this.state = {
            todos_los_permisos: {},
            id_grupo_actual: null,
        };
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view_groups], {callback: () => this.cargarDatos()});
    }

    componentWillUnmount() {
        this.props.clearGruposPermisos();
        this.props.clearPermisos();
    }

    actualizarPermiso(permiso) {
        const {id_grupo_actual} = this.state;
        const callback = () => {
            this.props.notificarAction(`Se ha actualizado con éxito el grupo de permisos con el permiso ${permiso.codename}`);
            this.props.fetchPermisosPorGrupo(id_grupo_actual)
        };
        if (id_grupo_actual) {
            this.props.addPermisoGrupo(id_grupo_actual, permiso.id, {callback});
        }
    }

    cargarDatos() {
        const cargarPermisosActivos = () => this.props.fetchPermisosActivos({
            callback: response => this.setState({
                todos_los_permisos: _.mapKeys(response, 'id'),
                id_grupo_actual: null
            })
        });
        this.props.fetchGruposPermisos({callback: cargarPermisosActivos});
    }

    onSelectItemDetail(item) {
        const {fetchPermisosPorGrupo} = this.props;
        fetchPermisosPorGrupo(item.id, {
            callback: () => this.setState({
                id_grupo_actual: item.id
            })
        });
    }

    buscarBusqueda(lista, busqueda) {
        return _.pickBy(lista, permiso => {
            return (
                permiso.codename.toString().toLowerCase().includes(busqueda.toString().toLowerCase()) ||
                (permiso.nombre ? permiso.nombre.toString().toLowerCase().includes(busqueda.toString().toLowerCase()) : true)
            )
        });
    };

    render() {
        const {object_list, permisos, mis_permisos} = this.props;
        const {
            todos_los_permisos,
            id_grupo_actual
        } = this.state;
        const permisos_object = permisosAdapter(mis_permisos, permisos_view_groups);
        const grupo_seleccionado = id_grupo_actual ? object_list[id_grupo_actual] : null;
        const method_pool = {
            fetchObjectMethod: this.props.fetchGrupoPermiso,
            deleteObjectMethod: this.props.deleteGrupoPermiso,
            createObjectMethod: this.props.createGrupoPermiso,
            updateObjectMethod: this.props.updateGrupoPermiso,
        };
        return (
            <Fragment>
                <CRUD
                    {...this.props}
                    method_pool={method_pool}
                    list={object_list}
                    permisos_object={permisos_object}
                    plural_name='Grupos Permisos'
                    singular_name='Grupo Permiso'
                    onSelectItemDetail={this.onSelectItemDetail}
                />
                {
                    grupo_seleccionado &&
                    <div className="row pl-5">
                        <div className="col-12">
                            <Typography variant="h6" gutterBottom color="primary">
                                Permisos de: {grupo_seleccionado.to_string}
                            </Typography>
                        </div>
                        <ListaBusqueda>
                            {
                                busqueda => {
                                    const permisos_lista = this.buscarBusqueda(todos_los_permisos, busqueda);
                                    return (
                                        _.map(permisos_lista, p => {
                                            return (
                                                <div key={p.id} className='col-12 col-md-6 col-lg-4 col-xl-3'>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                key={p.id}
                                                                checked={_.map(permisos, e => e.id).includes(p.id)}
                                                                onChange={() => this.actualizarPermiso(p)}
                                                                color='primary'
                                                            />
                                                        }
                                                        label={p.to_string}
                                                    />
                                                </div>
                                            )
                                        })
                                    )
                                }
                            }
                        </ListaBusqueda>
                    </div>
                }
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </Fragment>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        object_list: state.grupos_permisos,
        permisos: state.permisos,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(List)