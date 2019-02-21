import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import {
    COLABORADORES as permisos_view
} from "../../../00_utilities/permisos/types";
import {permisosAdapter, pesosColombianos} from "../../../00_utilities/common";
import Typography from '@material-ui/core/Typography';
import RegistroOperacionForm from '../components/forms/registro_operacion_form';

class OperacionesCaja extends Component {
    componentDidMount() {
        const cargarConceptosOperacionesCaja = () => this.props.fetchConceptosOperacionesCajas();
        const cargarProveedores = () => this.props.fetchProveedores({callback: cargarConceptosOperacionesCaja});
        const cargarColaboradores = () => this.props.fetchColaboradores({callback: cargarProveedores});
        this.props.fetchAcompanantesPresentes({callback: cargarColaboradores});
    }

    render() {
        return (
            <div>
                <Typography variant="h4" gutterBottom color="primary">
                    Registrar Operación Caja
                </Typography>
                <RegistroOperacionForm {...this.props}/>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        conceptos_operaciones_caja: state.conceptos_operaciones_caja,
        acompanantes: state.acompanantes,
        proveedores: state.proveedores,
        colaboradores: state.colaboradores,
    }
}

export default connect(mapPropsToState, actions)(OperacionesCaja)