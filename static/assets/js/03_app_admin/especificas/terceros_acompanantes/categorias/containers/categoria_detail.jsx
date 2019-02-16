import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import Typography from '@material-ui/core/Typography';
import {CATEGORIAS_ACOMPANANTES as permisos_view} from "../../../../../00_utilities/permisos/types";
import ListCrud from '../../categoria_fraccion_tiempo/components/categorias_fraciones_tiempos_list';
import {Link} from 'react-router-dom'

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos()});
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearCategoriasFraccionesTiemposAcompanantes();
        this.props.clearCategoriasAcompanantes();

    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const cargarCategoriaFraccionTiempo = () => this.props.fetchCategoriasFraccionesTiemposAcompanantes_x_categoria(id);
        this.props.fetchCategoriaAcompanante(id, {callback: cargarCategoriaFraccionTiempo});

    }

    render() {
        const {object, categorias_fracciones_tiempo_list, fracciones_tiempo_list, mis_permisos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);


        if (!object) {
            return <Typography variant="overline" gutterBottom color="primary">
                Cargando...
            </Typography>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de categoria'>
                <Typography variant="h5" gutterBottom color="primary">
                    Detalle {object.nombre}
                </Typography>
                <ListCrud
                    object_list={categorias_fracciones_tiempo_list}
                    fracciones_tiempo_list={fracciones_tiempo_list}
                    permisos_object={permisos}
                    {...this.props}
                />
                <CargarDatos cargarDatos={this.cargarDatos}/>
                <Link to={`/app/admin/usuarios/acompanantes/dashboard`}>
                    <span className='btn'>Ir a Categorías</span>
                </Link>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        auth: state.auth,
        mis_permisos: state.mis_permisos,
        object: state.categorias_acompanantes[id],
        categorias_fracciones_tiempo_list: state.categorias_fracciones_tiempos_acompanantes,
        fracciones_tiempo_list: state.fracciones_tiempos_acompanantes,
    }
}

export default connect(mapPropsToState, actions)(Detail)