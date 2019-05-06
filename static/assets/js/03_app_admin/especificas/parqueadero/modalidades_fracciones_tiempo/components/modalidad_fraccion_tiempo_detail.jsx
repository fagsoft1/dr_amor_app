import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import Typography from '@material-ui/core/Typography';
import {
    MODALIDADES_FRACCIONES_TIEMPOS as permisos_view,
    MODALIDADES_FRACCIONES_TIEMPOS_DETALLES as permisos_view_2
} from "../../../../../00_utilities/permisos/types";

import ModalidadTiempoDetalle from '../detalles/components/modalidades_fracciones_tiempos_detalles_list';

class Detail extends Component {
    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view, permisos_view_2], {callback: () => this.cargarDatos()});
    }

    componentWillUnmount() {
        this.props.clearModalidadesFraccionesTiempos();
        this.props.clearModalidadesFraccionesTiemposDetalles();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const cargarModalidadDetalles = () => this.props.fetchModalidadesFraccionesTiemposDetalles();
        this.props.fetchModalidadFraccionTiempo(id, {callback: cargarModalidadDetalles});
    }

    render() {
        const {object, modalidades_fracciones_tiempo_detalles, mis_permisos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        const permisos_detalles = permisosAdapter(mis_permisos, permisos_view_2);
        if (!object) {
            return <Typography variant="overline" gutterBottom color="primary">
                Cargando...
            </Typography>
        }

        return (
            <ValidarPermisos can_see={permisos.view} nombre='detalles de modalidad fraccion tiempo'>
                <Typography variant="h5" gutterBottom color="primary">
                    Detalle {object.to_string}
                </Typography>
                <ModalidadTiempoDetalle
                    {...this.props}
                    modalidad_fraccion_tiempo={object}
                    object_list={modalidades_fracciones_tiempo_detalles}
                    permisos_object={permisos_detalles}
                />
                <CargarDatos cargarDatos={() => this.cargarDatos()}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        modalidades_fracciones_tiempo_detalles: state.parqueadero_modalidades_fracciones_tiempo_detalles,
        object: state.parqueadero_modalidades_fracciones_tiempo[id]
    }
}

export default connect(mapPropsToState, actions)(Detail)